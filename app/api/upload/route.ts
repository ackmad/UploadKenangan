import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { uploadFileToCloudinary, getResourceType } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/mov', 'video/avi', 'video/webm', 'video/x-m4v', 'video/3gpp'];
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_SIZE = 30 * 1024 * 1024;  // 30 MB
const MAX_FILES = 10;

function generateFilename(className: string, ext: string): string {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `2026_${className.toUpperCase()}_${date}_${time}_${random}${ext}`;
}

export async function POST(req: NextRequest) {
    try {
        let formData: FormData;
        try {
            formData = await req.formData();
        } catch {
            return NextResponse.json({ error: 'Format request tidak valid.' }, { status: 400 });
        }

        const className = formData.get('class');
        if (!className || typeof className !== 'string' || !['RPL', 'TKJ', 'DKV'].includes(className.toUpperCase())) {
            return NextResponse.json({ error: 'Pilih kelas terlebih dahulu (RPL, TKJ, atau DKV).' }, { status: 400 });
        }

        const fileEntries = formData.getAll('files') as File[];

        if (fileEntries.length === 0) {
            return NextResponse.json({ error: 'Tidak ada file yang diupload.' }, { status: 400 });
        }
        if (fileEntries.length > MAX_FILES) {
            return NextResponse.json({ error: `Maksimal ${MAX_FILES} file sekaligus.` }, { status: 400 });
        }

        for (const file of fileEntries) {
            if (!ALLOWED_TYPES.includes(file.type)) {
                return NextResponse.json({
                    error: `File "${file.name}" tidak didukung. Gunakan foto (JPG/PNG/WEBP) atau video (MP4/MOV).`,
                }, { status: 400 });
            }

            const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
            const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
            const maxLabel = isVideo ? '30MB' : '5MB';

            if (file.size > maxSize) {
                return NextResponse.json({
                    error: `File "${file.name}" melebihi batas ukuran ${maxLabel}.`,
                }, { status: 400 });
            }
        }

        const uploaded: string[] = [];
        for (const file of fileEntries) {
            const ext = path.extname(file.name).toLowerCase() || '.jpg';
            const newName = generateFilename(className, ext);
            const buffer = Buffer.from(await file.arrayBuffer());

            const result = await uploadFileToCloudinary(buffer, newName, className, file.type);
            uploaded.push(result.publicId);
        }

        return NextResponse.json({ success: true, count: uploaded.length });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Terjadi kesalahan saat upload.';
        console.error('[upload] ERROR:', err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
