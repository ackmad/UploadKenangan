import { NextResponse } from 'next/server';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dg2kguctm';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'SKINFAVERSE21/AlbumKenangan';

    // Fetch resources from Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image`;
    
    const params = new URLSearchParams({
      type: 'upload',
      prefix: folder,
      max_results: '500',
    });

    const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64');
    
    const response = await fetch(`${url}?${params}`, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Transform resources to pages
    const pages = data.resources
      .map((resource: any) => {
        // Extract page number from filename (e.g., "page-01.jpg" -> 1)
        const filename = resource.public_id.split('/').pop() || '';
        const pageMatch = filename.match(/(\d+)/);
        const pageNumber = pageMatch ? parseInt(pageMatch[1], 10) : 0;

        return {
          id: resource.public_id,
          imageUrl: resource.secure_url,
          pageNumber,
          width: resource.width,
          height: resource.height,
        };
      })
      .sort((a: any, b: any) => a.pageNumber - b.pageNumber); // Sort by page number

    // Get PDF download URL if exists
    const pdfFolder = folder.replace('/AlbumKenangan', '');
    const pdfUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${pdfFolder}/AlbumKenangan.pdf`;

    return NextResponse.json({
      success: true,
      pages,
      totalPages: pages.length,
      pdfUrl,
      folder,
    });
  } catch (error: any) {
    console.error('Yearbook API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch yearbook pages',
        pages: [],
        totalPages: 0,
      },
      { status: 500 }
    );
  }
}
