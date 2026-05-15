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
    // Try with Search API first (best for when public_id doesn't include folder)
    const searchExpression = `folder:"${folder}" AND resource_type:${resourceType}`;
    const result = await cloudinary.search
      .expression(searchExpression)
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();

    if (result && result.resources && result.resources.length > 0) {
      return result.resources.map((resource: any) => {
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
          folder: resource.folder || folder,
          format: resource.format,
        };
      });
    }

    // Fallback to Prefix search if Search API returns nothing
    const prefixResult = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      resource_type: resourceType,
      max_results: 500,
    });

    return (prefixResult.resources || []).map((resource: any) => ({
      id: resource.asset_id || resource.public_id,
      publicId: resource.public_id,
      url: resource.secure_url,
      thumbnailUrl: resource.secure_url,
      type: resourceType,
      width: resource.width,
      height: resource.height,
      createdAt: resource.created_at,
      folder: resource.folder || '',
      format: resource.format,
    }));
  } catch (error) {
    console.error(`Error fetching ${resourceType} from ${folder} using Search API:`, error);
    
    // Fallback to old method if Search API fails (though prefix search won't work for these specific guru files)
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        resource_type: resourceType,
        max_results: 500,
      });
      // ... (mapping logic same as before)
      return (result.resources || []).map((resource: any) => ({
        id: resource.asset_id || resource.public_id,
        publicId: resource.public_id,
        url: resource.secure_url,
        thumbnailUrl: resource.secure_url, // simple fallback
        type: resourceType,
        width: resource.width,
        height: resource.height,
        createdAt: resource.created_at,
        folder: resource.folder || '',
        format: resource.format,
      }));
    } catch (fallbackError) {
      return [];
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const foldersParam = searchParams.get('folder') || 'skinfaverse21/nostalgia';
    const folders = foldersParam.split(',');

    const fetchPromises: Promise<NostalgiaMedia[]>[] = [];
    for (const folder of folders) {
      const trimmedFolder = folder.trim();
      fetchPromises.push(fetchMediaFromFolder(trimmedFolder, 'image'));
      fetchPromises.push(fetchMediaFromFolder(trimmedFolder, 'video'));
    }

    // Fetch all media in parallel
    const results = await Promise.all(fetchPromises);

    // Combine and sort by creation date (newest first)
    const allMedia = results.flat().sort(
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
