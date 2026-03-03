import { NextRequest, NextResponse } from 'next/server';
import { listFilesFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

const CLASSES = ['RPL', 'TKJ', 'DKV'];

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const classFilter = searchParams.get('class')?.toUpperCase();

        let results;

        if (classFilter && CLASSES.includes(classFilter)) {
            results = await listFilesFromCloudinary(classFilter);
        } else {
            // Fetch all three folders in parallel
            const [rpl, tkj, dkv] = await Promise.all([
                listFilesFromCloudinary('RPL'),
                listFilesFromCloudinary('TKJ'),
                listFilesFromCloudinary('DKV'),
            ]);
            results = [...rpl, ...tkj, ...dkv].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
        }

        return NextResponse.json({ files: results });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Gagal memuat galeri.';
        console.error('[gallery]', err);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
