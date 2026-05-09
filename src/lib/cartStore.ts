'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  type Cart,
  type CartLine,
} from './shopify';

export interface CartItem {
  lineId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  handle: string;
  imageUrl?: string;
  imageAlt?: string;
  quantity: number;
  price: string;
  currencyCode: string;
}

interface CartState {
  cartId: string | null;
  checkoutUrl: string | null;
  items: CartItem[];
  totalQuantity: number;
  subtotal: string;
  subtotalCurrency: string;
  isOpen: boolean;
  isLoading: boolean;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
}

function cartToItems(cart: Cart): CartItem[] {
  return cart.lines.edges.map(({ node }: { node: CartLine }) => ({
    lineId: node.id,
    variantId: node.merchandise.id,
    title: node.merchandise.product.title,
    variantTitle: node.merchandise.title,
    handle: node.merchandise.product.handle,
    imageUrl: node.merchandise.image?.url,
    imageAlt: node.merchandise.image?.altText ?? undefined,
    quantity: node.quantity,
    price: node.cost.totalAmount.amount,
    currencyCode: node.cost.totalAmount.currencyCode,
  }));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      checkoutUrl: null,
      items: [],
      totalQuantity: 0,
      subtotal: '0',
      subtotalCurrency: 'GBP',
      isOpen: false,
      isLoading: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: async (variantId: string, quantity = 1) => {
        set({ isLoading: true });
        try {
          const { cartId } = get();
          const line = { merchandiseId: variantId, quantity };

          let cart: Cart | null;
          if (cartId) {
            cart = await addCartLines(cartId, [line]);
          } else {
            cart = await createCart([line]);
          }

          if (cart) {
            set({
              cartId: cart.id,
              checkoutUrl: cart.checkoutUrl,
              items: cartToItems(cart),
              totalQuantity: cart.totalQuantity,
              subtotal: cart.cost.subtotalAmount.amount,
              subtotalCurrency: cart.cost.subtotalAmount.currencyCode,
              isOpen: true,
            });
          }
        } catch (err) {
          console.error('addItem error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (lineId: string) => {
        const { cartId } = get();
        if (!cartId) return;
        set({ isLoading: true });
        try {
          const cart = await removeCartLines(cartId, [lineId]);
          if (cart) {
            set({
              items: cartToItems(cart),
              totalQuantity: cart.totalQuantity,
              subtotal: cart.cost.subtotalAmount.amount,
            });
          }
        } catch (err) {
          console.error('removeItem error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineId: string, quantity: number) => {
        const { cartId } = get();
        if (!cartId) return;
        if (quantity < 1) {
          return get().removeItem(lineId);
        }
        set({ isLoading: true });
        try {
          const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
          if (cart) {
            set({
              items: cartToItems(cart),
              totalQuantity: cart.totalQuantity,
              subtotal: cart.cost.subtotalAmount.amount,
            });
          }
        } catch (err) {
          console.error('updateQuantity error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () =>
        set({
          cartId: null,
          checkoutUrl: null,
          items: [],
          totalQuantity: 0,
          subtotal: '0',
          isOpen: false,
        }),
    }),
    {
      name: 'drwhite-cart',
      // Only persist cartId + checkoutUrl + items so we can restore state on refresh
      partialize: (state) => ({
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        items: state.items,
        totalQuantity: state.totalQuantity,
        subtotal: state.subtotal,
        subtotalCurrency: state.subtotalCurrency,
      }),
    }
  )
);
