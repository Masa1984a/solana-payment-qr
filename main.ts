// main.ts
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { handleHome } from "./src/handlers/home.ts";
import { handleBlinks } from "./src/handlers/blinks.ts";
import { handleTransaction } from "./src/handlers/transaction.ts";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const method = req.method;
  const pathname = url.pathname;

  // ルーティング
  try {
    // 静的ファイル
    if (pathname.startsWith("/static/")) {
      return await serveStatic(pathname);
    }

    // APIルート
    if (method === "GET" && pathname === "/") {
      return await handleHome(req);
    }

    if (method === "GET" && pathname.startsWith("/pay/")) {
      return await handleBlinks(req);
    }

    if (method === "POST" && pathname.startsWith("/api/transaction/")) {
      return await handleTransaction(req);
    }

    // 404
    return new Response("Not Found", { status: 404 });
  } catch (error) {
    console.error("Server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

// 静的ファイルサーバー
async function serveStatic(pathname: string): Promise<Response> {
  const filePath = `.${pathname}`;
  try {
    const file = await Deno.readFile(filePath);
    const contentType = getContentType(pathname);
    return new Response(file, {
      headers: { "Content-Type": contentType },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}

function getContentType(pathname: string): string {
  if (pathname.endsWith(".css")) return "text/css";
  if (pathname.endsWith(".js")) return "application/javascript";
  if (pathname.endsWith(".html")) return "text/html";
  return "text/plain";
}