import { getToken } from 'next-auth/jwt';

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return new Response(JSON.stringify(token, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}