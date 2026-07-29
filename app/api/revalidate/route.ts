import { revalidate } from 'lib/bigcommerce';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('Busting Cache');
  return revalidate(req);
}
