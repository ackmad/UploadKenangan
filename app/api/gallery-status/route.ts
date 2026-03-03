import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const locked = process.env.GALLERY_LOCKED === 'true';
    return NextResponse.json({ locked });
}
