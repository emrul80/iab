let imageObj1 = null;
let scale1 = 1;
let offsetX1 = 0;
let offsetY1 = 0;

let imageObj2 = null;
let scale2 = 1;
let offsetX2 = 0;
let offsetY2 = 0;

const frames = {
  1: 'frame_profile.png',
  2: 'frame_post.png'
};

function loadImage(event, id) {
  const canvas = document.getElementById('canvas' + id);
  const ctx = canvas.getContext('2d');
  const reader = new FileReader();

  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      if (id === 1) {
        imageObj1 = img;
        scale1 = 1;
        offsetX1 = 0;
        offsetY1 = 0;
      } else {
        imageObj2 = img;
        scale2 = 1;
        offsetX2 = 0;
        offsetY2 = 0;
      }
      drawCanvas(id);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function drawCanvas(id) {
  const canvas = document.getElementById('canvas' + id);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const img = id === 1 ? imageObj1 : imageObj2;
  const scale = id === 1 ? scale1 : scale2;
  const offsetX = id === 1 ? offsetX1 : offsetX2;
  const offsetY = id === 1 ? offsetY1 : offsetY2;

  if (img) {
    const imgWidth = img.width * scale;
    const imgHeight = img.height * scale;
    ctx.drawImage(img, offsetX, offsetY, imgWidth, imgHeight);
  }

  const frameImg = new Image();
  frameImg.onload = function () {
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
  };
  frameImg.src = frames[id];
}

function downloadImage(id) {
  const canvas = document.getElementById('canvas' + id);
  const link = document.createElement('a');
  link.download = (id === 1 ? 'profile' : 'post') + '_framed.png';
  link.href = canvas.toDataURL();
  link.click();
}

// Drag & Zoom support
let isDragging = false;
let startX, startY;

['canvas1', 'canvas2'].forEach((canvasId, idx) => {
  const id = idx + 1;
  const canvas = document.getElementById(canvasId);

  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const dx = e.offsetX - startX;
      const dy = e.offsetY - startY;
      if (id === 1) {
        offsetX1 += dx;
        offsetY1 += dy;
      } else {
        offsetX2 += dx;
        offsetY2 += dy;
      }
      startX = e.offsetX;
      startY = e.offsetY;
      drawCanvas(id);
    }
  });

  canvas.addEventListener('mouseup', () => (isDragging = false));
  canvas.addEventListener('mouseleave', () => (isDragging = false));

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.05 : -0.05;
    if (id === 1) {
      scale1 += delta;
      if (scale1 < 0.2) scale1 = 0.2;
    } else {
      scale2 += delta;
      if (scale2 < 0.2) scale2 = 0.2;
    }
    drawCanvas(id);
  });
});