import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: number;
  title: string;
  artist: string;
  price: number;
  cover: string;
  audioUrl: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (id: number) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item: CartItem) => {
        const { items } = get();
        if (!items.find((cartItem) => cartItem.id === item.id)) {
          set({ items: [...items, item] });
        }
      },

      removeItem: (id: number) => {
        const { items } = get();
        set({ items: items.filter((item) => item.id !== id) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.length;
      },

      isInCart: (id: number) => {
        const { items } = get();
        return items.some((item) => item.id === id);
      },
    }),
    {
      name: "cart-storage",
    },
  ),
);
