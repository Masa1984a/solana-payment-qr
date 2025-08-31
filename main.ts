// main.ts (テスト用最小版)
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

serve((req: Request) => {
  const url = new URL(req.url);
  console.log(`Request to: ${url.pathname}`);
  
  return new Response("Hello from Deno Deploy! Path: " + url.pathname, {
    headers: { "Content-Type": "text/plain" },
  });
});