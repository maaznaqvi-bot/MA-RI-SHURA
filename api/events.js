export const config = { runtime: 'edge' };

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTbXtkL4ry38KEg6MvKsED3gRhZRmNcU_El9yQY29kf9Uis7fjPyOW1ap9L64SYWhkheeBOuLufd1-K/pub?output=csv';

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const gid = searchParams.get('gid') || '0';
  const url = gid === '0' ? SHEET_URL : `${SHEET_URL}&gid=${gid}&single=true`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; YMShuraApp/1.0)' },
    });
    if (!res.ok) return new Response(JSON.stringify({ error: res.status }), { status: res.status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    const csv = await res.text();
    return new Response(csv, { status: 200, headers: { 'Content-Type': 'text/csv', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, s-maxage=60' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}
