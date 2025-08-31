// app.js - Solana Payment QR Generator クライアントサイドJS

window.onload = function() {
  const savedWallet = localStorage.getItem('wallet_address');
  if (savedWallet) {
    document.getElementById('wallet').value = savedWallet;
  }
};

function setAmount(value) {
  document.getElementById('amount').value = value;
}



function copyURL() {
  const url = document.getElementById('payment-url').textContent;
  const copyBtn = document.querySelector('.copy-icon-btn');
  
  navigator.clipboard.writeText(url).then(() => {
    // 元のコンテンツを保存
    const originalHTML = copyBtn.innerHTML;
    
    // "Copied!"メッセージを表示
    copyBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFC2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    copyBtn.classList.add('copied');
    
    // 2秒後に元に戻す
    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy URL:', err);
  });
}

function resetForm() {
  document.getElementById('qr-result').classList.remove('show');
  document.getElementById('amount').value = '';
  document.getElementById('memo').value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// フォーム送信処理
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('qr-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const wallet = document.getElementById('wallet').value;
      const amount = document.getElementById('amount').value;
      const memo = document.getElementById('memo').value || 'Payment';
      const network = document.getElementById('network').value;
      const mode = document.getElementById('mode') ? document.getElementById('mode').value : 'solana_pay';
      
      localStorage.setItem('wallet_address', wallet);
      
      let shareUrl = '';
      if (mode === 'solana_pay') {
        // Solana Pay URL (deep link)
        shareUrl = `solana:${wallet}?amount=${amount}&label=${encodeURIComponent('Payment Request')}&message=${encodeURIComponent(memo)}`;
      } else {
        // Blink (Actions) URL via interstitial (dial.to)
        const origin = window.location.origin;
        const actionUrl = `${origin}/api/actions/pay/${wallet}?amount=${encodeURIComponent(amount)}&network=${encodeURIComponent(network)}&memo=${encodeURIComponent(memo)}`;
        const blinkUrl = `solana-action:${actionUrl}`;
        shareUrl = `https://dial.to/?action=${encodeURIComponent(blinkUrl)}`;
      }

      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;

      document.getElementById('qr-code').innerHTML = `<img src="${qrApiUrl}" alt="QR Code" />`;
      document.getElementById('payment-url').textContent = shareUrl;
      document.getElementById('qr-result').classList.add('show');
      
      // Devnet警告の表示/非表示
      const warningBox = document.getElementById('devnet-warning');
      if (network === 'devnet') {
        warningBox.style.display = 'block';
      } else {
        warningBox.style.display = 'none';
      }

      // ネットワークバッジ表示（フォームの選択に基づく）
      const badge = document.getElementById('network-badge');
      if (badge) {
        badge.style.display = 'inline-flex';
        badge.classList.remove('devnet', 'mainnet');
        if (network === 'devnet') {
          badge.textContent = (mode === 'blink' ? 'Blink • Devnet' : 'Solana Pay • Devnet');
          badge.classList.add('devnet');
        } else {
          badge.textContent = (mode === 'blink' ? 'Blink • Mainnet' : 'Solana Pay • Mainnet');
          badge.classList.add('mainnet');
        }
      }
      
      document.getElementById('qr-result').scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// グローバル関数として公開（onclick属性で使用するため）
window.setAmount = setAmount;
window.copyURL = copyURL;
window.resetForm = resetForm;
