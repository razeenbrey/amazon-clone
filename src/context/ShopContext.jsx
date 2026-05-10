import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import rawProducts from '../load/ProductList.json';

const STORAGE_USER = 'amazonClone_user';
const STORAGE_CART = 'amazonClone_cart';
const STORAGE_ORDERS = 'amazonClone_orders';
const STORAGE_QTY = 'amazonClone_quantities';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function normalizeFromJson(rows) {
  return rows.map((p, id) => ({
    id,
    picUrl: p['pic-url'],
    name: p.name,
    price: p.price,
    deliverCost: p['deliver-cost'],
    deliverDate: p['deliver-date'],
    inStock: p['in-stock'],
    baseQuantity: p.quantity,
  }));
}

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const catalog = useMemo(() => normalizeFromJson(rawProducts), []);

  const [quantities, setQuantities] = useState(() =>
    catalog.map((p) => p.baseQuantity)
  );
  const [user, setUserState] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedQty = readJson(STORAGE_QTY, null);
    setQuantities(
      catalog.map((p, i) =>
        typeof storedQty?.[i] === 'number' ? storedQty[i] : p.baseQuantity
      )
    );
    setUserState(readJson(STORAGE_USER, null));
    setCart(readJson(STORAGE_CART, []));
    setOrders(readJson(STORAGE_ORDERS, []));
  }, [catalog]);

  const persistQty = useCallback((next) => {
    localStorage.setItem(STORAGE_QTY, JSON.stringify(next));
    setQuantities(next);
  }, []);

  const products = useMemo(
    () =>
      catalog.map((p, i) => ({
        ...p,
        quantity: quantities[i] ?? p.baseQuantity,
        inStockDisplay: (quantities[i] ?? p.baseQuantity) > 0,
      })),
    [catalog, quantities]
  );

  const getProduct = useCallback(
    (id) => products.find((p) => String(p.id) === String(id)),
    [products]
  );

  const setUser = useCallback((next) => {
    if (!next) {
      localStorage.removeItem(STORAGE_USER);
      setUserState(null);
      return;
    }
    localStorage.setItem(STORAGE_USER, JSON.stringify(next));
    setUserState(next);
  }, []);

  const addToCart = useCallback(
    (productId, amount = 1) => {
      const p = products.find((x) => x.id === productId);
      if (!p || p.quantity <= 0) return { ok: false, reason: 'out_of_stock' };

      const line = cart.find((l) => l.productId === productId);
      const currentQty = line ? line.quantity : 0;
      const nextQty = Math.min(currentQty + amount, p.quantity);

      if (nextQty <= currentQty) return { ok: false, reason: 'max_qty' };

      const next = line
        ? cart.map((l) =>
            l.productId === productId ? { ...l, quantity: nextQty } : l
          )
        : [...cart, { productId, quantity: Math.min(amount, p.quantity) }];

      localStorage.setItem(STORAGE_CART, JSON.stringify(next));
      setCart(next);
      return { ok: true };
    },
    [cart, products]
  );

  const updateCartLine = useCallback(
    (productId, quantity) => {
      const p = products.find((x) => x.id === productId);
      if (!p) return;

      const q = Math.max(0, Math.min(quantity, p.quantity));

      let next;

      if (q === 0) next = cart.filter((l) => l.productId !== productId);
      else {
        const line = cart.find((l) => l.productId === productId);
        next = line
          ? cart.map((l) =>
              l.productId === productId ? { ...l, quantity: q } : l
            )
          : [...cart, { productId, quantity: q }];
      }

      localStorage.setItem(STORAGE_CART, JSON.stringify(next));
      setCart(next);
    },
    [cart, products]
  );

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => {
      const next = prev.filter((l) => l.productId !== productId);
      localStorage.setItem(STORAGE_CART, JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    localStorage.setItem(STORAGE_CART, JSON.stringify([]));
    setCart([]);
  }, []);

  const fulfillOrder = useCallback(
    (lines) => {
      const nextQty = [...quantities];
      for (const { productId, quantity } of lines) {
        const idx = products.findIndex((x) => x.id === productId);
        if (idx < 0) return { ok: false, reason: 'invalid_product' };
        if (nextQty[idx] < quantity) return { ok: false, reason: 'not_enough_stock' };
        nextQty[idx] -= quantity;
      }
      persistQty(nextQty);
      return { ok: true };
    },
    [products, quantities, persistQty]
  );

  const placeOrder = useCallback(
    (lines) => {
      const res = fulfillOrder(lines);
      if (!res.ok) return res;
      const items = lines.map(({ productId, quantity }) => {
        const p = getProduct(productId);
        return {
          productId,
          quantity,
          name: p?.name,
          unitPrice: p?.price,
          deliverCost: p?.deliverCost,
        };
      });
      const subtotal = items.reduce(
        (s, i) => s + i.unitPrice * i.quantity,
        0
      );
      const shipping = items.reduce(
        (s, i) => s + (i.deliverCost || 0) * i.quantity,
        0
      );
      const order = {
        id: `ord_${Date.now()}`,
        createdAt: new Date().toISOString(),
        items,
        subtotal,
        shipping,
        total: subtotal + shipping,
      };
      setOrders((prev) => {
        const next = [order, ...prev];
        localStorage.setItem(STORAGE_ORDERS, JSON.stringify(next));
        return next;
      });
      return { ok: true, order };
    },
    [fulfillOrder, getProduct]
  );

  const checkoutCart = useCallback(() => {
    if (!cart.length) return { ok: false, reason: 'empty' };
    const res = placeOrder(cart);
    if (res.ok) clearCart();
    return res;
  }, [cart, placeOrder, clearCart]);

  const buyNow = useCallback(
    (productId, quantity = 1) => {
      const p = getProduct(productId);
      if (!p || p.quantity <= 0) return { ok: false, reason: 'out_of_stock' };
      const q = Math.min(quantity, p.quantity);
      return placeOrder([{ productId, quantity: q }]);
    },
    [getProduct, placeOrder]
  );

  const cartCount = useMemo(
    () => cart.reduce((n, l) => n + l.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, line) => {
      const p = getProduct(line.productId);
      if (!p) return sum;
      return sum + p.price * line.quantity;
    }, 0);
  }, [cart, getProduct]);

  const value = useMemo(
    () => ({
      products,
      getProduct,
      user,
      setUser,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      updateCartLine,
      removeFromCart,
      clearCart,
      checkoutCart,
      buyNow,
      orders,
    }),
    [
      products,
      getProduct,
      user,
      setUser,
      cart,
      cartCount,
      cartTotal,
      addToCart,
      updateCartLine,
      removeFromCart,
      clearCart,
      checkoutCart,
      buyNow,
      orders,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
}
