import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { clearOrder as clearStoredOrder, getOrder, setOrder as storeOrder } from '../lib/order.js';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [order, setOrderState] = useState(() => getOrder());

  const setOrder = useCallback((next) => {
    storeOrder(next);
    setOrderState(next);
  }, []);

  const clearOrder = useCallback(() => {
    clearStoredOrder();
    setOrderState(null);
  }, []);

  const value = useMemo(
    () => ({
      order,
      setOrder,
      clearOrder,
      qty: order && order.qty ? order.qty : 0
    }),
    [order, setOrder, clearOrder]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  return useContext(OrderContext);
}
