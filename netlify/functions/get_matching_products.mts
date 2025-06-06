import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  // Get URL object to parse query parameters
  const url = new URL(req.url);
  const params = url.searchParams;

  // Extract query parameters
  const queryParams = {
    productType: params.get('product_type'),
    room: params.get('room'),
    color: params.get('color'),
    finish: params.get('finish'),
    sizeDimensions: params.get('size'),
    material: params.get('material'),
    style: params.get('style'),
  };

  // Log all parameters to console
  console.log('Product Search Parameters:', queryParams);

  // Return success response
  return new Response(JSON.stringify({
    message: 'Query parameters logged successfully',
    parameters: queryParams
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const config = {
  path: "/api/get-matching-products"
};
