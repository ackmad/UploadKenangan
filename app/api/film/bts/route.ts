import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression(`folder:SKINFAVERSE21/film/bts AND resource_type:video`)
      .sort_by('created_at', 'desc')
      .max_results(50)
      .execute();

    const videos = (result.resources || []).map((resource: any) => {
      // Generate optimized video URL (max 720p, auto quality, auto format)
      const url = cloudinary.url(resource.public_id, {
        resource_type: 'video',
        transformation: [
          { width: 1280, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      });

      // Generate optimized poster URL (smaller image)
      const posterUrl = cloudinary.url(resource.public_id, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [
          { width: 600, crop: 'limit' },
          { quality: 'auto' }
        ]
      });

      let title = resource.filename || resource.public_id.split('/').pop();
      // Make it slightly more readable
      title = title.replace(/_/g, ' ');

      return {
        publicId: resource.public_id,
        url,
        posterUrl,
        title,
      };
    });

    return NextResponse.json({
      success: true,
      videos,
    });
  } catch (error) {
    console.error('Error fetching BTS videos:', error);
    return NextResponse.json({ success: false, videos: [] }, { status: 500 });
  }
}
