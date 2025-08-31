// src/templates/index.ts
export async function getHtmlTemplate(): Promise<string> {
    // 別ファイルから読み込むか、直接返す
    return `
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solana Payment QR Generator</title>
    <link rel="stylesheet" href="/static/styles.css">
  </head>
  <body>
    <div id="app"></div>
    <script src="/static/app.js"></script>
  </body>
  </html>
    `;
}