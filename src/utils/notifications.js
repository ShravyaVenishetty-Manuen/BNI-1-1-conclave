export function getNotifications() {
  const stored = localStorage.getItem('bni_notifications');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse notifications from localStorage", e);
    }
  }
  
  // Seed initial realistic notifications if none exist
  const initial = [];
  localStorage.setItem('bni_notifications', JSON.stringify(initial));
  return initial;
}

export function addNotification(title, desc, type = 'info') {
  const list = getNotifications();
  const newItem = {
    id: Date.now(),
    title,
    desc,
    time: 'Just now',
    type,
    unread: true
  };
  localStorage.setItem('bni_notifications', JSON.stringify([newItem, ...list]));
  
  // Dispatch storage event so other components or tabs update instantly
  window.dispatchEvent(new Event('storage'));
}
