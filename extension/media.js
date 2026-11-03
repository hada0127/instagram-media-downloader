export function allowedMediaUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password &&
      ['cdninstagram.com', 'fbcdn.net'].some(domain => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
  } catch { return false; }
}

export function normalizeItems(items) {
  const seen = new Set();
  return items.filter(item => {
    if (!item || !['image', 'video'].includes(item.type) || !allowedMediaUrl(item.url)) return false;
    const key = item.id ? `${item.type}:${item.id}` : `${item.type}:${new URL(item.url).pathname}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((item, index) => ({
    caption: typeof item.caption === 'string' ? item.caption : '',
    id: String(item.id || new URL(item.url).pathname), type: item.type, url: item.url,
    preview: allowedMediaUrl(item.preview) ? item.preview : item.type === 'image' ? item.url : '',
    post: String(item.post || 'post').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'post',
    index: Number.isInteger(item.index) && item.index > 0 ? item.index : index + 1,
    aliases: (Array.isArray(item.aliases) ? item.aliases : []).filter(allowedMediaUrl),
  }));
}

export function captionPrefix(value) {
  const clean = String(value || '').normalize('NFC')
    // Remove keycap emoji as a unit so their digits do not leak into the name.
    .replace(/[#*0-9]\uFE0F?\u20E3/gu, '')
    .replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim();
  let prefix = [...new Intl.Segmenter('ko', {granularity:'grapheme'}).segment(clean)]
    .slice(0, 10).map(part => part.segment).join('').replace(/[. ]+$/g, '');
  // A reserved Windows device name before a dot remains reserved with a suffix.
  if (/^(CON|PRN|AUX|NUL|COM[1-9¹²³]|LPT[1-9¹²³])(?:\.|$)/i.test(prefix)) prefix = '_' + prefix;
  return prefix;
}

export function filename(item) {
  const path = new URL(item.url).pathname;
  const extension = item.type === 'video' ? 'mp4' : (path.match(/\.(jpe?g|png|webp|avif)$/i)?.[1].toLowerCase() || 'jpg');
  const post = String(item.post || 'post').replace(/[^a-zA-Z0-9]/g, '').slice(0, 80) || 'post';
  const prefix = captionPrefix(item.caption) || post;
  return `${prefix}_${String(item.index).padStart(2, '0')}.${extension}`;
}
