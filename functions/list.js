export async function onRequest({ env }) {
  const listed = await env.R2.list({ limit: 1000 });
  const out = listed.objects.map(o => ({
    key: o.key,
    size: o.size,
    uploaded: o.uploaded
  }));
  return Response.json(out);
}
