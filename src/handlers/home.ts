// src/handlers/home.ts
import { getHtmlTemplate } from "../templates/index.ts";

export async function handleHome(_req: Request): Promise<Response> {
  try {
    const html = await getHtmlTemplate();
    
    return new Response(html, {
      headers: { 
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-cache" 
      },
    });
  } catch (error) {
    console.error("Error loading home page:", error);
    return new Response("Internal Server Error", { 
      status: 500,
      headers: { "Content-Type": "text/plain" }
    });
  }
}