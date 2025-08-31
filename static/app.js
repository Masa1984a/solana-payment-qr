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
  const url = document.getElementById('payment-url').value;
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
      const network = document.getElementById('network').value;
      
      localStorage.setItem('wallet_address', wallet);
      
      const paymentUrl = `solana:${wallet}?amount=${amount}&label=${encodeURIComponent('Payment Request')}&message=${encodeURIComponent(memo)}`;
      
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(paymentUrl)}`;
      
      document.getElementById('qr-code').innerHTML = `<img src="${qrApiUrl}" alt="QR Code" />`;
      document.getElementById('payment-url').value = paymentUrl;
      document.getElementById('qr-result').classList.add('show');

      if (network === 'devnet') {
        document.getElementById('devnet-warning').style.display = 'block';
      } else {
        document.getElementById('devnet-warning').style.display = 'none';
      }

      document.getElementById('qr-result').scrollIntoView({ behavior: 'smooth' });
    });
  }
});

// グローバル関数として公開（onclick属性で使用するため）
window.setAmount = setAmount;
window.copyURL = copyURL;
window.resetForm = resetForm;
