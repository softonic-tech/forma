import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CATALOG, COLORS } from '../data/catalog.js';
import { config } from '../data/config.js';
import { api } from '../lib/api.js';

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [settings, setSettings] = useState(config);
  const [products, setProducts] = useState(CATALOG);
  const [colors, setColors] = useState(COLORS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api('/api/settings').catch(() => null),
      api('/api/products').catch(() => null),
      api('/api/colors').catch(() => null)
    ]).then(([nextSettings, nextProducts, nextColors]) => {
      if (cancelled) return;
      if (nextSettings) setSettings({ ...config, ...nextSettings });
      if (Array.isArray(nextProducts) && nextProducts.length) setProducts(nextProducts);
      if (Array.isArray(nextColors) && nextColors.length) setColors(nextColors);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ settings, products, colors, ready }),
    [settings, products, colors, ready]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
