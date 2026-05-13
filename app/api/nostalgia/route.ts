import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface NostalgiaMedia {
  id: string;
  publicId: string;
  url: string;
  thumbnailUrl: string;
  type: 'image' | 'video';
  width: number;
  height: number;
  createdAt: string;
  folder: string;
  format: string;
}

async function fetchMediaFromFolder(
  folder: string,
  resourceType: 'image' | 'video'
): Promise<NostalgiaMedia[]> {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      resource_type: resourceType,
      max_results: 500,
      direction: 'desc', // newest first
    });

    return (result.resources || []).map((resource: any) => {
      const thumbnailUrl =
        resourceType === 'video'
          ? cloudinary.url(resource.public_id, {
              resource_type: 'video',
              format: 'jpg',
              transformation: [
                { width: 600, height: 600, crop: 'fill', quality: 'auto' },
              ],
            })
          : cloudinary.url(resource.public_id, {
              transformation: [
                { width: 600, height: 600, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
              ],
            });

      return {
        id: resource.asset_id || resource.public_id,
        publicId: resource.public_id,
        url: resource.secure_url,
        thumbnailUrl,
        type: resourceType,
        width: resource.width,
        height: resource.height,
        createdAt: resource.created_at,
        folder: resource.folder || '',
        format: resource.format,
      };
    });
  } catch (error) {
    console.error(`Error fetching ${resourceType} from ${folder}:`, error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const folder = searchParams.get('folder') || 'skinfaverse21/nostalgia';

    // Fetch both images and videos in parallel
    const [images, videos] = await Promise.all([
      fetchMediaFromFolder(folder, 'image'),
      fetchMediaFromFolder(folder, 'video'),
    ]);

    // Combine and sort by creation date (newest first)
    const allMedia = [...images, ...videos].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      count: allMedia.length,
      media: allMedia,
    });
  } catch (error) {
    console.error('Error in nostalgia API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch media from Cloudinary',
        media: [],
      },
      { status: 500 }
    );
  }
}
