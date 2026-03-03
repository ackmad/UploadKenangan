import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const FOLDER_MAP: Record<string, string> = {
    RPL: 'SMK-ANGKATAN-2026/RPL',
    TKJ: 'SMK-ANGKATAN-2026/TKJ',
    DKV: 'SMK-ANGKATAN-2026/DKV',
};

export type ResourceType = 'image' | 'video';

export interface UploadResult {
    publicId: string;
    secureUrl: string;
    thumbnailUrl: string;
    resourceType: ResourceType;
}

export function getResourceType(mimeType: string): ResourceType {
    return mimeType.startsWith('video/') ? 'video' : 'image';
}

/**
 * Upload a file buffer to the correct Cloudinary folder.
 */
export async function uploadFileToCloudinary(
    buffer: Buffer,
    filename: string,
    className: string,
    mimeType: string,
): Promise<UploadResult> {
    const folder = FOLDER_MAP[className.toUpperCase()];
    if (!folder) throw new Error(`Unknown class: ${className}`);

    const resourceType = getResourceType(mimeType);

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: filename.replace(/\.[^.]+$/, ''),
                resource_type: resourceType,
                // For images: auto quality & format
                // For videos: auto quality
                ...(resourceType === 'image'
                    ? { transformation: [{ quality: 'auto', fetch_format: 'auto' }] }
                    : { transformation: [{ quality: 'auto' }] }),
            },
            (error, result) => {
                if (error || !result) return reject(error ?? new Error('Upload failed'));

                const thumbnailUrl =
                    resourceType === 'video'
                        ? cloudinary.url(result.public_id, {
                            resource_type: 'video',
                            format: 'jpg',
                            transformation: [{ width: 400, height: 400, crop: 'fill' }],
                        })
                        : cloudinary.url(result.public_id, {
                            width: 400,
                            height: 400,
                            crop: 'fill',
                            quality: 'auto',
                            fetch_format: 'auto',
                        });

                resolve({
                    publicId: result.public_id,
                    secureUrl: result.secure_url,
                    thumbnailUrl,
                    resourceType,
                });
            },
        );
        stream.end(buffer);
    });
}

export interface CloudinaryFile {
    id: string;
    name: string;
    className: string;
    thumbnailUrl: string;
    fullUrl: string;
    createdAt: string;
    resourceType: ResourceType;
}

type CloudinaryResource = {
    public_id: string;
    secure_url: string;
    created_at: string;
    resource_type: string;
};

async function fetchResources(folder: string, resourceType: 'image' | 'video'): Promise<CloudinaryResource[]> {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: folder + '/',
            resource_type: resourceType,
            max_results: 200,
            direction: 'desc',
        });
        return result.resources ?? [];
    } catch {
        return [];
    }
}

/**
 * List all images AND videos from a specific class folder in Cloudinary.
 */
export async function listFilesFromCloudinary(className: string): Promise<CloudinaryFile[]> {
    const folder = FOLDER_MAP[className.toUpperCase()];
    if (!folder) return [];

    const [images, videos] = await Promise.all([
        fetchResources(folder, 'image'),
        fetchResources(folder, 'video'),
    ]);

    const toFile = (r: CloudinaryResource, type: 'image' | 'video'): CloudinaryFile => {
        const thumbnailUrl =
            type === 'video'
                ? cloudinary.url(r.public_id, {
                    resource_type: 'video',
                    format: 'jpg',
                    transformation: [{ width: 400, height: 400, crop: 'fill' }],
                })
                : cloudinary.url(r.public_id, {
                    width: 400,
                    height: 400,
                    crop: 'fill',
                    quality: 'auto',
                    fetch_format: 'auto',
                });

        return {
            id: r.public_id,
            name: r.public_id.split('/').pop() ?? '',
            className,
            thumbnailUrl,
            fullUrl: r.secure_url,
            createdAt: r.created_at,
            resourceType: type,
        };
    };

    return [
        ...images.map((r) => toFile(r, 'image')),
        ...videos.map((r) => toFile(r, 'video')),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
