import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  trackId: string;
  trackName: string;
  artist: string;
  licenseType: string;
  price: number;
  stripePriceId: string;
  coverUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (trackId: string, licenseType: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          if (
            state.items.some(
              (i) =>
                i.trackId === item.trackId &&
                i.licenseType === item.licenseType,
            )
          ) {
            return state;
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (trackId, licenseType) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.trackId === trackId && i.licenseType === licenseType),
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage", // unique name for localStorage key
    },
  ),
);
