'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  createCart,
  addCartLines,
  updateCartLines,
  removeCartLines,
  updateCartBuyerCountry,
  updateCartDiscountCodes,
  normalizeCheckoutUrl,
  type Cart,
  type CartLine,
} from './shopify';
import { trackAddToCart } from './track';

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
  /** Set on subscription lines — the Shopify selling plan's display name. */
  sellingPlanName?: string;
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
  /** Discount code the shopper claimed (welcome offer); applied to every cart. */
  discountCode: string | null;
  /** The claimed code once Shopify has accepted it for the current cart. */
  appliedDiscountCode: string | null;

  // Actions
  openCart: () => void;
  closeCart: () => void;
  /**
   * `sellingPlanId` makes the line a recurring subscription. Resolves to
   * false when Shopify rejected the line, so callers never show "Added".
   */
  addItem: (variantId: string, quantity?: number, sellingPlanId?: string) => Promise<boolean>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  setCountry: (country: string) => Promise<void>;
  /** Remember a code and apply it to the cart now (or to the next cart created). */
  applyDiscountCode: (code: string) => Promise<void>;
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
    sellingPlanName: node.sellingPlanAllocation?.sellingPlan?.name,
  }));
}

// State every cart mutation refreshes from Shopify's response.
function cartSnapshot(cart: Cart) {
  return {
    items: cartToItems(cart),
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount.amount,
    subtotalCurrency: cart.cost.subtotalAmount.currencyCode,
    appliedDiscountCode: cart.discountCodes?.find((d) => d.applicable)?.code ?? null,
  };
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
      discountCode: null,
      appliedDiscountCode: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: async (variantId: string, quantity = 1, sellingPlanId?: string) => {
        set({ isLoading: true });
        try {
          const { cartId, discountCode } = get();
          // Only send sellingPlanId when there is one — Shopify rejects null.
          const line = sellingPlanId
            ? { merchandiseId: variantId, quantity, sellingPlanId }
            : { merchandiseId: variantId, quantity };

          let cart: Cart | null = null;
          if (cartId) {
            cart = await addCartLines(cartId, [line]);
          }
          // No cart yet, or the persisted one is gone (Shopify drops a cart
          // once its checkout completes, and expires idle carts after ~10
          // days). Either way, start a fresh cart rather than failing silently.
          if (!cart) {
            cart = await createCart([line], discountCode ? [discountCode] : []);
          }

          if (!cart) return false;

          if (cart) {
            const snapshot = cartSnapshot(cart);
            const { items } = snapshot;
            set({
              cartId: cart.id,
              checkoutUrl: normalizeCheckoutUrl(cart.checkoutUrl),
              ...snapshot,
              isOpen: true,
            });

            const added = items.find((i) => i.variantId === variantId);
            if (added) {
              const unitPrice = parseFloat(added.price) / added.quantity;
              trackAddToCart({
                contentId: added.variantId,
                contentName: added.title,
                value: unitPrice * quantity,
                currency: added.currencyCode,
                quantity,
              });
            }
          }
          return true;
        } catch (err) {
          console.error('addItem error:', err);
          return false;
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
          if (cart) set(cartSnapshot(cart));
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
          if (cart) set(cartSnapshot(cart));
        } catch (err) {
          console.error('updateQuantity error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      // Reprice the existing cart when the visitor switches currency.
      setCountry: async (country: string) => {
        const { cartId } = get();
        if (!cartId) return;
        set({ isLoading: true });
        try {
          const cart = await updateCartBuyerCountry(cartId, country);
          if (cart) {
            set({
              checkoutUrl: normalizeCheckoutUrl(cart.checkoutUrl),
              ...cartSnapshot(cart),
            });
          }
        } catch (err) {
          console.error('setCountry error:', err);
        } finally {
          set({ isLoading: false });
        }
      },

      applyDiscountCode: async (code: string) => {
        set({ discountCode: code });
        const { cartId } = get();
        // No cart yet — addItem passes the code when it creates one.
        if (!cartId) return;
        set({ isLoading: true });
        try {
          const cart = await updateCartDiscountCodes(cartId, [code]);
          if (cart) set(cartSnapshot(cart));
        } catch (err) {
          console.error('applyDiscountCode error:', err);
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
          subtotalCurrency: 'GBP',
          appliedDiscountCode: null,
          isOpen: false,
        }),
    }),
    {
      name: 'cliniwhite-cart',
      // Only persist cartId + checkoutUrl + items so we can restore state on refresh
      partialize: (state) => ({
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        items: state.items,
        totalQuantity: state.totalQuantity,
        subtotal: state.subtotal,
        subtotalCurrency: state.subtotalCurrency,
        discountCode: state.discountCode,
        appliedDiscountCode: state.appliedDiscountCode,
      }),
    }
  )
);
