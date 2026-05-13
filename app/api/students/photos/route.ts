import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'missing',
});

const FOLDER_MAP: Record<string, string> = {
  RPL: 'SKINFAVERSE21/personal/rpl',
  TKJ: 'SKINFAVERSE21/personal/tkj',
  DKV: 'SKINFAVERSE21/personal/dkv',
};

interface StudentPhoto {
  publicId: string;
  url: string;
  studentName: string;
  studentId: number | null;
  jurusan: string;
}

async function fetchPhotosFromFolder(folder: string, jurusan: string): Promise<StudentPhoto[]> {
  try {
    console.log(`Searching photos in folder: ${folder}`);
    
    // Using search API for more reliable folder results
    const result = await cloudinary.search
      .expression(`folder:${folder}`)
      .max_results(500)
      .execute();

    console.log(`Found ${result.resources?.length || 0} photos in ${folder}`);
    
    if (result.resources && result.resources.length > 0) {
      console.log('Sample photo:', result.resources[0].public_id);
    }

    return (result.resources || []).map((resource: any) => {
      // Extract student name from filename
      // Format: "69_yanuar-bintang-pratama_entyji"
      const filename = resource.public_id.split('/').pop() || '';
      const parts = filename.split('_');
      
      let studentName = '';
      let studentId: number | null = null;

      if (parts.length >= 2) {
        // First part is the ID
        const idPart = parseInt(parts[0]);
        if (!isNaN(idPart)) {
          studentId = idPart;
        }

        // Middle part is the name (handle cases with or without suffix)
        if (parts.length >= 3) {
          studentName = parts.slice(1, -1).join(' ');
        } else {
          studentName = parts[1];
        }
      }

      // Generate optimized URL with proper transformations
      const url = cloudinary.url(resource.public_id, {
        transformation: [
          { 
            width: 600, 
            height: 800, 
            crop: 'fill', 
            gravity: 'face:center', 
            quality: 'auto:good', 
            fetch_format: 'auto' 
          },
        ],
      });

      return {
        publicId: resource.public_id,
        url,
        studentName: studentName.replace(/-/g, ' '),
        studentId,
        jurusan,
      };
    });
  } catch (error) {
    console.error(`Error searching photos in ${folder}:`, error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jurusan = searchParams.get('jurusan')?.toUpperCase();

    if (jurusan && FOLDER_MAP[jurusan]) {
      // Fetch photos for specific jurusan
      const photos = await fetchPhotosFromFolder(FOLDER_MAP[jurusan], jurusan);
      return NextResponse.json({
        success: true,
        jurusan,
        count: photos.length,
        photos,
      });
    } else {
      // Fetch all photos from all jurusan
      const [rplPhotos, tkjPhotos, dkvPhotos] = await Promise.all([
        fetchPhotosFromFolder(FOLDER_MAP.RPL, 'RPL'),
        fetchPhotosFromFolder(FOLDER_MAP.TKJ, 'TKJ'),
        fetchPhotosFromFolder(FOLDER_MAP.DKV, 'DKV'),
      ]);

      const allPhotos = [...rplPhotos, ...tkjPhotos, ...dkvPhotos];

      return NextResponse.json({
        success: true,
        count: allPhotos.length,
        photos: allPhotos,
        breakdown: {
          RPL: rplPhotos.length,
          TKJ: tkjPhotos.length,
          DKV: dkvPhotos.length,
        },
      });
    }
  } catch (error) {
    console.error('Error in students photos API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch student photos from Cloudinary',
        photos: [],
      },
      { status: 500 }
    );
  }
}
