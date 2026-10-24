(function () {
  const currentScript = document.currentScript;
  const slug = (currentScript && currentScript.getAttribute('data-slotsync-slug')) || 'urban-salon';

  // Inject floating button
  const button = document.createElement('button');
  button.id = 'slotsync-book-button';
  button.innerHTML = '📅 Book Appointment';
  button.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-weight: 700;
    font-size: 15px;
    padding: 12px 24px;
    border-radius: 9999px;
    border: none;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.45);
    cursor: pointer;
    z-index: 999999;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  `;

  button.onmouseenter = () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 25px rgba(99, 102, 241, 0.6)';
  };
  button.onmouseleave = () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.45)';
  };

  // Modal overlay
  const overlay = document.createElement('div');
  overlay.id = 'slotsync-modal-overlay';
  overlay.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    z-index: 1000000;
    align-items: center;
    justify-content: center;
  `;

  const iframe = document.createElement('iframe');
  iframe.src = `${window.location.origin}/embed/${slug}`;
  iframe.style.cssText = `
    width: 100%;
    max-width: 500px;
    height: 600px;
    border: none;
    border-radius: 16px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  `;

  overlay.appendChild(iframe);
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
    }
  };

  button.onclick = () => {
    overlay.style.display = 'flex';
  };

  document.body.appendChild(button);
  document.body.appendChild(overlay);
})();
