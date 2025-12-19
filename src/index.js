export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS (يسمح www وبدون www)
    const origin = request.headers.get("Origin") || "";
    const allowed = new Set([
      "https://sust-library.site",
      "https://www.sust-library.site",
      "http://sust-library.site",
      "http://www.sust-library.site",
    ]);
    const corsOrigin = allowed.has(origin) ? origin : "*";
    const cors = {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "GET") return new Response("Method not allowed", { status: 405, headers: cors });

    if (url.pathname !== "/list") {
      return new Response("OK. Use /list?prefix=program/semester/course/category/", { headers: cors });
    }

    const prefix = url.searchParams.get("prefix") || "";
    const delimiter = "/";

    const res = await env.R2.list({ prefix, delimiter, limit: 1000 });

    const base = "https://files.sust-library.site/";
    const encodePath = (p) => p.split("/").map(encodeURIComponent).join("/");

    const folders = (res.delimitedPrefixes || []).map((p) => ({
      type: "folder",
      prefix: p,
      name: p.replace(prefix, "").replace(/\/$/, ""),
    }));

    const files = (res.objects || []).map((o) => ({
      type: "file",
      key: o.key,
      name: o.key.replace(prefix, ""),
      size: o.size,
      uploaded: o.uploaded,
      url: base + encodePath(o.key),
    }));

    files.sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify({ ok: true, prefix, folders, files }, null, 2), {
      headers: { ...cors, "Content-Type": "application/json; charset=utf-8" },
    });
  },
};
