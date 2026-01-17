"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/components/shop/CartContext";
import { SideCart } from "@/components/shop/SideCart";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <CartProvider>
            {children}
            <SideCart />
        </CartProvider>
    );
}
