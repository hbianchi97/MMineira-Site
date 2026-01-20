import { Product } from "@prisma/client";

interface LowStockNotificationProps {
    product: Product;
}

export const LowStockNotification: React.FC<LowStockNotificationProps> = ({ product }) => (
    <div>
        <h1>Alerta de Estoque Baixo</h1>
        <p>O produto <strong>{product.name}</strong> está com estoque baixo.</p>
        <p>Estoque atual: <strong>{product.stock}</strong></p>
        <p>Por favor, reponha o estoque o mais rápido possível.</p>
    </div>
);
