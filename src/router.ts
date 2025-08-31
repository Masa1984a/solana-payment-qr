// src/router.ts
import { handleHome } from "./handlers/home.ts";
import { handleBlinks } from "./handlers/blinks.ts";
import { handleTransaction } from "./handlers/transaction.ts";
import { handleStaticFile } from "./handlers/static.ts";

export async function router(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const method = req.method;
  const pathname = url.pathname;
  
  // 共通のCORSヘッダー
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  // OPTIONS リクエストの処理（CORS プリフライト）
  if (method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  // 静的ファイルの処理
  if (pathname.startsWith("/static/")) {
    const staticResponse = await handleStaticFile(req);
    if (staticResponse) {
      return staticResponse;
    }
  }
  
  // ルーティング
  try {
    // ホームページ
    if (method === "GET" && pathname === "/") {
      return await handleHome(req);
    }
    
    // Blinks endpoint
    if (method === "GET" && pathname.startsWith("/pay/")) {
      return await handleBlinks(req);
    }
    
    // Transaction endpoint
    if (method === "POST" && pathname.startsWith("/api/transaction/")) {
      return await handleTransaction(req);
    }
    
    // 404 Not Found
    return new Response("Not Found", { 
      status: 404,
      headers: corsHeaders 
    });
    
  } catch (error) {
    console.error("Router error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }), 
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        }
      }
    );
  }
}
