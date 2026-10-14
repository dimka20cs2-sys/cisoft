// Сжатие изображений в браузере (canvas → JPEG base64).
export const MAX_MEDIA_CHARS = 900000;   // ≈ 675 КБ бинарных данных (лимит правил — 950 000)
export const MAX_PREVIEW_CHARS = 20000;  // превью ≤ 20 КБ
export const MAX_AVATAR_CHARS = 40000;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject({ userMessage: 'Не удалось открыть изображение. Поддерживаются JPG, PNG, WebP, GIF.' }); };
    img.src = url;
  });
}

function draw(img, maxSide, square = false) {
  let w = img.naturalWidth, h = img.naturalHeight;
  let sx = 0, sy = 0, sw = w, sh = h;
  if (square) { const s = Math.min(w, h); sx = (w - s) / 2; sy = (h - s) / 2; sw = sh = s; w = h = s; }
  const k = Math.min(1, maxSide / Math.max(w, h));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w * k));
  c.height = Math.max(1, Math.round(h * k));
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff'; // прозрачный фон PNG → белый в JPEG
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, c.width, c.height);
  return c;
}

// Подбираем размер/качество, пока строка не уложится в лимит
function fit(img, maxSide, maxChars, quality, square = false) {
  let side = maxSide, q = quality;
  for (let i = 0; i < 12; i++) {
    const data = draw(img, side, square).toDataURL('image/jpeg', q);
    if (data.length <= maxChars) return data;
    if (q > 0.5) q -= 0.1; else side = Math.round(side * 0.8);
  }
  throw { userMessage: 'Изображение слишком большое — не удалось сжать.' };
}

export async function compressPhoto(file) {
  if (!file || !/^image\//.test(file.type)) throw { userMessage: 'Можно отправлять только изображения.' };
  if (file.size > 40 * 1024 * 1024) throw { userMessage: 'Файл больше 40 МБ — выберите изображение поменьше.' };
  const img = await loadImage(file);
  const data = fit(img, 1280, MAX_MEDIA_CHARS, 0.8);
  const preview = fit(img, 360, MAX_PREVIEW_CHARS, 0.6);
  return { data, preview, width: img.naturalWidth, height: img.naturalHeight };
}

export async function compressAvatar(file) {
  if (!file || !/^image\//.test(file.type)) throw { userMessage: 'Выберите изображение.' };
  const img = await loadImage(file);
  return fit(img, 128, MAX_AVATAR_CHARS, 0.85, true);
}
