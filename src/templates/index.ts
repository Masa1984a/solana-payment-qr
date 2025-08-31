// src/templates/index.ts
export async function getHtmlTemplate(): Promise<string> {
  const htmlContent = await Deno.readTextFile(
    new URL("./home.html", import.meta.url)
  );
  return htmlContent;
}