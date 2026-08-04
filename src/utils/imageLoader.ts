const assetsMap = import.meta.glob('../assets/**/*.{png,jpg,jpeg,gif,svg,webp,mp4,MP4}', { eager: true, import: 'default' }) as Record<string, string>;

export function getImageUrl(path: string): string {
  if (!path) return '';
  const cleanPath = path.trim().replace(/^['"]|['"]$/g, '');

  // 1. Direct key match
  let normalizedKey = cleanPath;
  if (cleanPath.startsWith('/src/assets/')) {
    normalizedKey = cleanPath.replace('/src/assets/', '../assets/');
  } else if (cleanPath.startsWith('src/assets/')) {
    normalizedKey = cleanPath.replace('src/assets/', '../assets/');
  } else if (!cleanPath.startsWith('../assets/')) {
    normalizedKey = `../assets/${cleanPath.replace(/^\//, '')}`;
  }

  if (assetsMap[normalizedKey]) {
    return assetsMap[normalizedKey];
  }

  // 2. Filename match
  const filename = cleanPath.split('/').pop() || '';
  if (filename) {
    for (const globKey in assetsMap) {
      if (globKey.endsWith('/' + filename)) {
        return assetsMap[globKey];
      }
    }

    // 3. Partial/prefix filename match
    const baseName = filename.split('.')[0];
    const prefix = baseName.split('_')[0];
    for (const globKey in assetsMap) {
      const globFilename = globKey.split('/').pop() || '';
      if (prefix && prefix.length >= 4 && globFilename.startsWith(prefix)) {
        return assetsMap[globKey];
      }
    }
  }

  return cleanPath;
}

