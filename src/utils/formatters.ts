export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
}

export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 10) return 'Just now';
    if (diffSeconds < 60) return `${diffSeconds}s ago`;
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return isoString;
  }
}

export function formatGps(lat: number, lng: number): string {
  return `${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E`;
}

export function formatConfidence(conf: number): string {
  return `${Math.round(conf * 100)}%`;
}

export function getEffectiveSeverity(pothole: { status: string; severity?: string }): 'NORMAL' | 'MODERATE' | 'HIGH' | 'SEVERE' {
  if (pothole.status === 'REPAIRED') {
    return 'NORMAL';
  }
  if (pothole.status === 'REPAIR IN PROGRESS' || pothole.status === 'WORK IN PROGRESS' || pothole.status === 'ASSIGNED' || pothole.status === 'INSPECTION') {
    return 'MODERATE';
  }
  return 'SEVERE';
}

export function getPotholePhoto(pothole: { status: string; imageUrl?: string; repairedImageUrl?: string }): string {
  if (pothole.status === 'REPAIRED') {
    return '/assets/repaired_safe.jpg';
  }
  if (pothole.status === 'REPAIR IN PROGRESS' || pothole.status === 'WORK IN PROGRESS' || pothole.status === 'ASSIGNED' || pothole.status === 'INSPECTION') {
    return '/assets/work_in_progress.jpg';
  }
  return '/assets/pending_severe.jpg';
}


