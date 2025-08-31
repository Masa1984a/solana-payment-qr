// src/handlers/home.ts
import { getHtmlTemplate } from "../templates/index.ts";

export async function handleHome(_req: Request): Promise<Response> {
  const html = await getHtmlTemplate();
  
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}