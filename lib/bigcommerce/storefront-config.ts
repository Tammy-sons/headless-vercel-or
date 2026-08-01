import { BIGCOMMERCE_API_URL } from './constants';

interface StorefrontCheckoutResponse {
  data?: {
    cart_url: string;
    checkout_url: string;
    embedded_checkout_url: string;
  };
  status: number;
}

export const memoizedCartRedirectUrl = async (cartId: string): Promise<StorefrontCheckoutResponse> => {
  const response = await fetch(`${BIGCOMMERCE_API_URL}/stores/${process.env.BIGCOMMERCE_STORE_HASH}/v3/carts/${cartId}/redirect_urls`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-auth-token': process.env.BIGCOMMERCE_ACCESS_TOKEN!,
    },
    cache: 'no-store'
  });

  return (await response.json()) as StorefrontCheckoutResponse;
};