const startBtn = document.getElementById('startBtn');
const downloadSpeedEl = document.getElementById('downloadSpeed');
const uploadSpeedEl = document.getElementById('uploadSpeed');

function animateRocket(barId, speed) {
  const bar = document.getElementById(barId);
  const rocket = bar.querySelector('.rocket');

  // Limit max speed for animation scale
  const maxSpeed = 100; // Mbps
  let heightPercent = Math.min(speed / maxSpeed, 1);

  // Calculate new bottom position in px (0 to 130px so rocket doesn't go out)
  const maxHeightPx = 130;
  const bottomPx = heightPercent * maxHeightPx;

  rocket.style.bottom = `${bottomPx}px`;
}

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  downloadSpeedEl.textContent = 'Download Speed: Testing...';
  uploadSpeedEl.textContent = 'Upload Speed: Testing...';

  // Reset rocket positions
  animateRocket('downloadBar', 0);
  animateRocket('uploadBar', 0);

  const imageUrl = "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg"; // ~3.7MB image
  const startTime = Date.now();

  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // seconds
      const bitsLoaded = blob.size * 8;
      const speedMbps = (bitsLoaded / duration / (1024 * 1024)).toFixed(2);

      downloadSpeedEl.textContent = `Download Speed: ${speedMbps} Mbps`;
      animateRocket('downloadBar', speedMbps);

      return fakeUploadTest();
    })
    .then(uploadSpeed => {
      uploadSpeedEl.textContent = `Upload Speed: ${uploadSpeed} Mbps`;
      animateRocket('uploadBar', uploadSpeed);

      startBtn.disabled = false;
    })
    .catch(() => {
      downloadSpeedEl.textContent = 'Download Speed: Error';
      uploadSpeedEl.textContent = 'Upload Speed: Error';

      // Reset rockets on error
      animateRocket('downloadBar', 0);
      animateRocket('uploadBar', 0);

      startBtn.disabled = false;
    });
});

function fakeUploadTest() {
  return new Promise(resolve => {
    setTimeout(() => {
      const uploadSpeed = (Math.random() * 15 + 5).toFixed(2);
      resolve(uploadSpeed);
    }, 1500);
  });
}
