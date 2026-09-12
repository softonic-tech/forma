const ORDER_KEY = 'forma-order';

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
