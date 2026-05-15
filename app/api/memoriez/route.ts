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
      .expression(`folder:SKINFAVERSE21/memoriez`)
      .sort_by('created_at', 'desc')
      .max_results(200)
      .execute();

    const memoriez = (result.resources || []).map((resource: any) => {
      // Determine if it's video or image
      const isVideo = resource.resource_type === 'video';
      
      let url = resource.secure_url;
      if (isVideo) {
        url = cloudinary.url(resource.public_id, {
          resource_type: 'video',
          transformation: [
            { width: 1280, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
      } else {
        url = cloudinary.url(resource.public_id, {
          transformation: [
            { width: 800, crop: 'limit' },
            { quality: 'auto', fetch_format: 'auto' }
          ]
        });
      }

      let title = resource.filename || resource.public_id.split('/').pop();
      title = title.replace(/_/g, ' ');

      return {
        url,
        isVideo,
        desc: title
      };
    });

    return NextResponse.json({
      success: true,
      memoriez,
    });
  } catch (error) {
    console.error('Error fetching memoriez:', error);
    return NextResponse.json({ success: false, memoriez: [] }, { status: 500 });
  }
}
