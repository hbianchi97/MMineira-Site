import { Product } from "@prisma/client";
import * as React from 'react';

interface LowStockNotificationProps {
    product: Product;
    threshold: number;
}

export const LowStockNotification: React.FC<LowStockNotificationProps> = ({ product, threshold }) => (
    <div style={{
        fontFamily: 'sans-serif',
        color: '#333',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #eee',
        borderRadius: '8px'
    }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1 style={{ color: '#e11d48', fontSize: '24px', marginBottom: '10px' }}>🚨 Alerta de Estoque Crítico</h1>
            <p style={{ fontSize: '16px', color: '#666' }}>Um produto atingiu o nível de estoque mínimo configurado.</p>
        </div>

        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', marginTop: '0' }}>{product.name}</h2>
            <p style={{ margin: '5px 0' }}><strong>SKU/Slug:</strong> {product.slug}</p>
            <p style={{ margin: '5px 0' }}><strong>Estoque Atual:</strong> <span style={{ color: '#e11d48', fontWeight: 'bold' }}>{product.stock} unidades</span></p>
            <p style={{ margin: '5px 0' }}><strong>Limite de Alerta:</strong> {threshold} unidades</p>
        </div>

        <div style={{ textAlign: 'center' }}>
            <a href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/products/${product.id}`} style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
                display: 'inline-block'
            }}>
                Gerenciar Produto
            </a>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />

        <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>
            Este é um e-mail automático do sistema Menina Mineira.
        </p>
    </div>
);
