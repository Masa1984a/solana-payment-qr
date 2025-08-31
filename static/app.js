// app.js - Solana Payment QR Generator クライアントサイドJS

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
  document.querySelector(`[data-type="${type}"]`).classList.add('selected');
}

function setAmount(value) {
  document.getElementById('amount').value = value;
}

function downloadQR() {
  const img = document.querySelector('#qr-code img');
  const link = document.createElement('a');
  link.href = img.src;
  link.download = `solana-payment-${Date.now()}.png`;
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

// フォーム送信処理
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('qr-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const wallet = document.getElementById('wallet').value;
      const amount = document.getElementById('amount').value;
      const memo = document.getElementById('memo').value || 'Payment';
      
      localStorage.setItem('wallet_address', wallet);
      
      let paymentUrl;
      
      if (selectedType === 'solanapay') {
        // Solana Pay URL
        paymentUrl = `solana:${wallet}?amount=${amount}&label=${encodeURIComponent('Payment Request')}&message=${encodeURIComponent(memo)}`;
      } else {
        // Phantom Universal Link
        const baseUrl = window.location.origin;
        const targetUrl = `${baseUrl}/pay/${wallet}?amount=${amount}&memo=${encodeURIComponent(memo)}`;
        paymentUrl = `https://phantom.app/ul/browse/${targetUrl}`;
      }
      
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentUrl)}`;
      
      document.getElementById('qr-code').innerHTML = `<img src="${qrApiUrl}" alt="QR Code" />`;
      document.getElementById('payment-url').textContent = paymentUrl;
      document.getElementById('qr-result').classList.add('show');
      
      document.getElementById('qr-result').scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// グローバル関数として公開（onclick属性で使用するため）
window.selectType = selectType;
window.setAmount = setAmount;
window.downloadQR = downloadQR;
window.shareQR = shareQR;
window.copyURL = copyURL;
window.resetForm = resetForm;
