import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('Busting Cache');

  const collectionWebhooks = [
    'store/category/created',
    'store/category/updated',
    'store/category/deleted'
  ];
  const productWebhooks = [
    'store/product/created',
    'store/product/updated',
    'store/product/deleted'
  ];

  const topic = req.headers.get('x-bc-topic') || '';
  const secret = req.nextUrl.searchParams.get('secret');
  const selectedSecret = process.env.BIGCOMMERCE_REVALIDATION_SECRET;

  if (!secret || secret !== selectedSecret) {
    return NextResponse.json({ status: 401, message: 'Invalid secret' }, { status: 401 });
  }

  if (productWebhooks.includes(topic)) {
    revalidateTag('products');
    return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
  }

  if (collectionWebhooks.includes(topic)) {
    revalidateTag('categories');
    revalidateTag('collections');
    return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
  }

  return NextResponse.json({ status: 200, revalidated: false, now: Date.now() });
}