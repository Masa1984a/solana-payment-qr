// src/handlers/static.ts
export async function handleStaticFile(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const pathname = url.pathname;
  
  // 静的ファイルのパスでない場合はnullを返す
  if (!pathname.startsWith("/static/")) {
    return null;
  }
  
  // セキュリティのため、パスをサニタイズ
  const filename = pathname.replace("/static/", "");
  if (filename.includes("..")) {
    return new Response("Forbidden", { status: 403 });
  }
  
  try {
    // ファイルのMIMEタイプを判定
    let contentType = "text/plain";
    if (filename.endsWith(".css")) {
      contentType = "text/css";
    } else if (filename.endsWith(".js")) {
      contentType = "application/javascript";
    } else if (filename.endsWith(".html")) {
      contentType = "text/html";
    } else if (filename.endsWith(".json")) {
      contentType = "application/json";
    }
    
    // ファイルを読み込み
    const filePath = new URL(`../../static/${filename}`, import.meta.url);
    const fileContent = await Deno.readTextFile(filePath);
    
    return new Response(fileContent, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600", // 1時間キャッシュ
      },
    });
  } catch (error) {
    // ファイルが見つからない場合
    if (error instanceof Deno.errors.NotFound) {
      return new Response("Not Found", { status: 404 });
    }
    // その他のエラー
    console.error("Static file error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
