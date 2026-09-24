const ORDER_KEY = 'glowfit-order';

export function getOrder() {
  try {
    return JSON.parse(sessionStorage.getItem(ORDER_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setOrder(order) {
  sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
}

export function clearOrder() {
  sessionStorage.removeItem(ORDER_KEY);
}
