export async function onRequest({ env, params }) {
  const key = params.key;
  const obj = await env.R2.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.etag);
  headers.set("Content-Disposition", `inline; filename="${key}"`);

  return new Response(obj.body, { headers });
}
