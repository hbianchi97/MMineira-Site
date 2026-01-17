"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    ReactNode,
} from "react";

export interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color?: string;
    imageUrl: string;
    slug: string;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    itemCount: number;
    subtotal: number;
    addItem: (item: Omit<CartItem, "id">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "menina-mineira-cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydrate cart from localStorage
    useEffect(() => {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (storedCart) {
            try {
                setItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Error parsing cart from localStorage:", e);
            }
        }
        setIsHydrated(true);
    }, []);

    // Persist cart to localStorage
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isHydrated]);

    const addItem = useCallback((newItem: Omit<CartItem, "id">) => {
        setItems((prev) => {
            // Check if item already exists with same product, size, and color
            const existingIndex = prev.findIndex(
                (item) =>
                    item.productId === newItem.productId &&
                    item.size === newItem.size &&
                    item.color === newItem.color
            );

            if (existingIndex !== -1) {
                // Update quantity
                const updated = [...prev];
                updated[existingIndex].quantity += newItem.quantity;
                return updated;
            }

            // Add new item
            const id = `${newItem.productId}-${newItem.size}-${newItem.color || "default"}-${Date.now()}`;
            return [...prev, { ...newItem, id }];
        });
        setIsOpen(true);
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(id);
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                isOpen,
                itemCount,
                subtotal,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                openCart,
                closeCart,
                toggleCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
