import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CatalogProduct } from "@/types/catalog";

export interface CartItem {
  product_id: number;
  quantity: number;
  name: string;
  price: string;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: CatalogProduct, quantity?: number) => void;
  buyNow: (product: CatalogProduct, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = "alpuz-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    saveCart(next);
  }, []);

  const addItem = useCallback(
    (product: CatalogProduct, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.product_id === product.id);
        let next: CartItem[];
        if (existing) {
          next = prev.map((i) =>
            i.product_id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        } else {
          next = [
            ...prev,
            {
              product_id: product.id,
              quantity,
              name: product.name,
              price: product.price,
              image: product.images?.[0]?.src,
            },
          ];
        }
        saveCart(next);
        return next;
      });
    },
    []
  );

  const buyNow = useCallback((product: CatalogProduct, quantity = 1) => {
    const next = [
      {
        product_id: product.id,
        quantity,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.src,
      },
    ];
    persist(next);
  }, [persist]);

  const removeItem = useCallback((productId: number) => {
    persist(items.filter((i) => i.product_id !== productId));
  }, [items, persist]);

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }
      setItems((prev) => {
        const next = prev.map((i) =>
          i.product_id === productId ? { ...i, quantity } : i
        );
        saveCart(next);
        return next;
      });
    },
    [removeItem]
  );

  const clearCart = useCallback(() => persist([]), [persist]);

  const itemCount = useMemo(
    () => items.reduce((n, i) => n + i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem,
      buyNow,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
    }),
    [items, addItem, buyNow, removeItem, updateQuantity, clearCart, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
