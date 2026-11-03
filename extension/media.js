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
    id: String(item.id || new URL(item.url).pathname), type: item.type, url: item.url,
    preview: allowedMediaUrl(item.preview) ? item.preview : item.type === 'image' ? item.url : '',
    post: String(item.post || 'post').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'post',
    index: index + 1,
  }));
}

export function filename(item) {
  const path = new URL(item.url).pathname;
  const extension = item.type === 'video' ? 'mp4' : (path.match(/\.(jpe?g|png|webp|avif)$/i)?.[1].toLowerCase() || 'jpg');
  const post = String(item.post || 'post').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80) || 'post';
  return `Instagram/${post}/${post}_${String(item.index).padStart(2, '0')}.${extension}`;
}
