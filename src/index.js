export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // / => صفحة بسيطة
    if (url.pathname === "/") {
      return new Response(
        `SUST eLibrary API is running ✅\n\nTry: /list`,
        { headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }

    // /list => عرض الملفات الموجودة في الـ R2
    if (url.pathname === "/list") {
      const list = await env.R2.list({ limit: 1000 });

      const files = list.objects.map(o => ({
        key: o.key,
        size: o.size,
        uploaded: o.uploaded
      }));

      return Response.json({ count: files.length, files });
    }

    // أي مسار تاني
    return new Response("Not Found", { status: 404 });
  }
};
