export function getAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/9.x/micah/svg?seed=${encodeURIComponent(seed || 'default')}`;
}
