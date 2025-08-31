// main.ts - Deno Deploy エントリーポイント
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { router } from "./src/router.ts";

// Deno Deployサーバーの起動
serve(async (req: Request) => {
  try {
    // ルーターでリクエストを処理
    const response = await router(req);
    return response;
  } catch (error) {
    // 予期しないエラーのハンドリング
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error"
      }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
});