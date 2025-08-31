// main.ts - 完全版QRコード生成サービス
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  clusterApiUrl,
  LAMPORTS_PER_SOL
} from "https://esm.sh/@solana/web3.js@1.87.6";

serve(async (req: Request) => {
  const url = new URL(req.url);
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  };

  // メインページ
  if (req.method === "GET" && url.pathname === "/") {
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Solana Payment QR Generator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    
    .container { max-width: 600px; margin: 0 auto; }
    
    .header {
      text-align: center;
      color: white;
      margin-bottom: 30px;
    }
    
    .header h1 { font-size: 32px; margin-bottom: 10px; }
    
    .card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    
    .form-group { margin-bottom: 20px; }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
    }
    
    input, textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 16px;
      transition: border-color 0.3s;
    }
    
    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .amount-presets {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 10px;
    }
    
    .preset-btn {
      padding: 10px;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }
    
    .preset-btn:hover {
      border-color: #667eea;
      background: #f3e5ff;
    }
    
    .generate-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .generate-btn:hover { transform: scale(1.02); }
    
    #qr-result {
      display: none;
      text-align: center;
      padding: 30px;
      background: #f9f9f9;
      border-radius: 16px;
      margin-top: 20px;
    }
    
    #qr-result.show { display: block; }
    
    #qr-code {
      max-width: 300px;
      margin: 20px auto;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    #qr-code img {
      width: 100%;
      height: auto;
    }
    
    .qr-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 20px;
    }
    
    .action-btn {
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .download-btn { background: #4CAF50; color: white; }
    .share-btn { background: #2196F3; color: white; }
    .copy-btn { background: #FF9800; color: white; }
    .new-btn { background: #9C27B0; color: white; }
    
    .payment-url {
      margin: 20px 0;
      padding: 15px;
      background: white;
      border-radius: 10px;
      border: 2px solid #e0e0e0;
      word-break: break-all;
      font-family: monospace;
      font-size: 12px;
      color: #666;
    }
    
    .info-box {
      background: #E3F2FD;
      border-left: 4px solid #2196F3;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    
    .info-box h3 {
      color: #1976D2;
      margin-bottom: 8px;
    }
    
    .qr-type-selector {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    
    .type-option {
      flex: 1;
      padding: 10px;
      border: 2px solid #e0e0e0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      transition: all 0.2s;
    }
    
    .type-option.selected {
      border-color: #667eea;
      background: #f3e5ff;
    }
    
    .warning-box {
      background: #FFF3E0;
      border-left: 4px solid #FF9800;
      padding: 12px;
      border-radius: 8px;
      margin-top: 15px;
      font-size: 14px;
      color: #E65100;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Solana Payment QR Generator</h1>
      <p>Generate QR codes for instant payments</p>
    </div>
    
    <div class="card">
      <div class="info-box">
        <h3>How to use</h3>
        <p>1. Enter wallet address<br>
           2. Set amount<br>
           3. Generate QR code<br>
           4. Share with sender</p>
      </div>
      
      <form id="qr-form">
        <div class="form-group">
          <label for="wallet">Recipient Wallet Address</label>
          <input 
            type="text" 
            id="wallet" 
            placeholder="Enter Solana wallet address" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="amount">Amount (SOL)</label>
          <input 
            type="number" 
            id="amount" 
            placeholder="0.1" 
            step="0.001" 
            min="0.001" 
            max="100"
            required
          />
          <div class="amount-presets">
            <button type="button" class="preset-btn" onclick="setAmount(0.01)">
              <div>0.01</div>
              <small>SOL</small>
            </button>
            <button type="button" class="preset-btn" onclick="setAmount(0.05)">
              <div>0.05</div>
              <small>SOL</small>
            </button>
            <button type="button" class="preset-btn" onclick="setAmount(0.1)">
              <div>0.1</div>
              <small>SOL</small>
            </button>
            <button type="button" class="preset-btn" onclick="setAmount(0.5)">
              <div>0.5</div>
              <small>SOL</small>
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label for="memo">Description (Optional)</label>
          <input 
            type="text" 
            id="memo" 
            placeholder="e.g., Coffee payment"
          />
        </div>
        
        <div class="form-group">
          <label>QR Code Type</label>
          <div class="qr-type-selector">
            <div class="type-option selected" onclick="selectType('solanapay')" data-type="solanapay">
              <strong>Solana Pay</strong>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">Direct</div>
            </div>
            <div class="type-option" onclick="selectType('phantom')" data-type="phantom">
              <strong>Phantom</strong>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">Browser</div>
            </div>
          </div>
        </div>
        
        <button type="submit" class="generate-btn">
          Generate QR Code
        </button>
      </form>
    </div>
    
    <div class="card" id="qr-result">
      <h2>Generated QR Code</h2>
      
      <div id="qr-code"></div>
      
      <div class="payment-url" id="payment-url"></div>
      
      <div class="qr-actions">
        <button class="action-btn download-btn" onclick="downloadQR()">
          Download
        </button>
        <button class="action-btn share-btn" onclick="shareQR()">
          Share
        </button>
        <button class="action-btn copy-btn" onclick="copyURL()">
          Copy URL
        </button>
        <button class="action-btn new-btn" onclick="resetForm()">
          New QR
        </button>
      </div>
      
      <div class="warning-box">
        <strong>Test Mode (Devnet)</strong><br>
        Using test SOL only. Switch to mainnet for real payments.
      </div>
    </div>
  </div>

  <script>
    let selectedType = 'solanapay';
    
    window.onload = function() {
      const savedWallet = localStorage.getItem('wallet_address');
      if (savedWallet) {
        document.getElementById('wallet').value = savedWallet;
      }
    };
    
    function selectType(type) {
      selectedType = type;
      document.querySelectorAll('.type-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      document.querySelector('[data-type="' + type + '"]').classList.add('selected');
    }
    
    document.getElementById('qr-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const wallet = document.getElementById('wallet').value;
      const amount = document.getElementById('amount').value;
      const memo = document.getElementById('memo').value || 'Payment';
      
      localStorage.setItem('wallet_address', wallet);
      
      let paymentUrl;
      
      if (selectedType === 'solanapay') {
        // Solana Pay URL
        paymentUrl = 'solana:' + wallet + 
                    '?amount=' + amount + 
                    '&label=' + encodeURIComponent('Payment Request') +
                    '&message=' + encodeURIComponent(memo);
      } else {
        // Phantom Universal Link
        const baseUrl = window.location.origin;
        const targetUrl = baseUrl + '/pay/' + wallet + '?amount=' + amount + '&memo=' + encodeURIComponent(memo);
        paymentUrl = 'https://phantom.app/ul/browse/' + targetUrl;
      }
      
      const qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(paymentUrl);
      
      document.getElementById('qr-code').innerHTML = '<img src="' + qrApiUrl + '" alt="QR Code" />';
      document.getElementById('payment-url').textContent = paymentUrl;
      document.getElementById('qr-result').classList.add('show');
      
      document.getElementById('qr-result').scrollIntoView({ behavior: 'smooth' });
    });
    
    function setAmount(value) {
      document.getElementById('amount').value = value;
    }
    
    function downloadQR() {
      const img = document.querySelector('#qr-code img');
      const link = document.createElement('a');
      link.href = img.src;
      link.download = 'solana-payment-' + Date.now() + '.png';
      link.click();
    }
    
    async function shareQR() {
      const url = document.getElementById('payment-url').textContent;
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Solana Payment Request',
            text: 'Please send SOL',
            url: url
          });
        } catch (err) {
          copyURL();
        }
      } else {
        copyURL();
      }
    }
    
    function copyURL() {
      const url = document.getElementById('payment-url').textContent;
      navigator.clipboard.writeText(url).then(() => {
        alert('URL copied!');
      });
    }
    
    function resetForm() {
      document.getElementById('qr-result').classList.remove('show');
      document.getElementById('amount').value = '';
      document.getElementById('memo').value = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  </script>
</body>
</html>`;
    
    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // Blinks endpoint
  if (req.method === "GET" && url.pathname.startsWith("/pay/")) {
    const pathParts = url.pathname.split("/");
    const recipientWallet = pathParts[2];
    const amount = url.searchParams.get("amount") || "0.1";
    const memo = url.searchParams.get("memo") || "Payment";
    
    const metadata = {
      type: "action",
      icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      title: memo,
      description: "Payment request for " + amount + " SOL",
      label: "Pay Now",
      links: {
        actions: [{
          label: "Send " + amount + " SOL",
          href: "/api/transaction/" + recipientWallet + "/" + amount,
        }],
      },
    };
    
    return new Response(JSON.stringify(metadata), { headers });
  }

  // Transaction endpoint
  if (req.method === "POST" && url.pathname.startsWith("/api/transaction/")) {
    const pathParts = url.pathname.split("/");
    const recipientWallet = pathParts[3];
    const amount = pathParts[4];
    
    try {
      const body = await req.json();
      const { account } = body;

      const connection = new Connection(clusterApiUrl("devnet"));
      const sender = new PublicKey(account);
      const recipient = new PublicKey(recipientWallet);
      
      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: recipient,
          lamports: Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL),
        })
      );

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = sender;

      const serialized = transaction.serialize({
        requireAllSignatures: false,
        verifySignatures: false,
      });
      const base64 = btoa(String.fromCharCode(...serialized));

      return new Response(
        JSON.stringify({
          transaction: base64,
          message: amount + " SOL sent successfully!",
        }),
        { headers }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        { headers, status: 500 }
      );
    }
  }

  return new Response("Not Found", { status: 404 });
});