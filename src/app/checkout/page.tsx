"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, CreditCard, Truck, Shield, Check, Store, MapPin } from "lucide-react";
import { useCart } from "@/components/shop/CartContext";
import { useUser } from "@clerk/nextjs";

export default function CheckoutPage() {
    const router = useRouter();
    const { items, subtotal, clearCart } = useCart();
    const { isSignedIn, user } = useUser();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [formData, setFormData] = useState({
        email: user?.emailAddresses?.[0]?.emailAddress || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
        paymentMethod: "pix",
        shippingMethod: "delivery",
    });

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value / 100);
    };

    const shippingCost = formData.shippingMethod === "pickup" ? 0 : (subtotal >= 29900 ? 0 : 1990);
    const total = subtotal + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        await new Promise((resolve) => setTimeout(resolve, 2000));

        setIsProcessing(false);
        setIsComplete(true);
        clearCart();
    };

    if (items.length === 0 && !isComplete) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
                <ShoppingBag className="h-20 w-20 text-muted-foreground/30 mb-6" />
                <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
                <p className="text-muted-foreground mb-6">
                    Adicione produtos para continuar com a compra
                </p>
                <Link
                    href="/"
                    className="gradient-gold text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                    Continuar Comprando
                </Link>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center px-4">
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6">
                    <Check className="h-10 w-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-2 text-green-700">
                    Pedido Confirmado!
                </h1>
                <p className="text-gray-600 mb-2 text-center max-w-md">
                    Obrigado pela sua compra! Você receberá um email com os detalhes do pedido.
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                    Número do pedido: #{Date.now().toString(36).toUpperCase()}
                </p>
                <Link
                    href="/"
                    className="gradient-gold text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
                >
                    Voltar para a Loja
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-amber-700">
                            Menina Mineira
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span>Compra Segura</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar para a loja
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    <div>
                        <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

                        {!isSignedIn && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                <p className="text-amber-800 text-sm">
                                    <Link href="/sign-in" className="font-semibold underline">
                                        Faça login
                                    </Link>{" "}
                                    para uma experiência mais rápida ou continue como convidado.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-amber-600" />
                                    Dados Pessoais
                                </h2>
                                <div className="grid gap-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Nome
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Sobrenome
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="(11) 99999-9999"
                                            required
                                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-amber-600" />
                                    Metodo de Entrega
                                </h2>
                                <div className="grid gap-3 mb-6">
                                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="delivery"
                                            checked={formData.shippingMethod === "delivery"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-amber-600"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-amber-600" />
                                                <span className="font-medium">Entrega em casa</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {subtotal >= 29900 ? "Frete gratis para compras acima de R$ 299" : "Frete: R$ 19,90"}
                                            </p>
                                        </div>
                                        {subtotal >= 29900 ? (
                                            <span className="text-green-600 font-semibold text-sm">Gratis</span>
                                        ) : (
                                            <span className="text-gray-600 font-medium text-sm">R$ 19,90</span>
                                        )}
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                                        <input
                                            type="radio"
                                            name="shippingMethod"
                                            value="pickup"
                                            checked={formData.shippingMethod === "pickup"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-amber-600"
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Store className="h-4 w-4 text-amber-600" />
                                                <span className="font-medium">Retirar na loja</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Rua das Flores, 123 - Centro, Rio de Janeiro
                                            </p>
                                        </div>
                                        <span className="text-green-600 font-semibold text-sm">Gratis</span>
                                    </label>
                                </div>
                            </div>

                            {formData.shippingMethod === "delivery" && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-amber-600" />
                                    Endereco de Entrega
                                </h2>
                                <div className="grid gap-4">
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-1">
                                            <label className="block text-sm font-medium mb-1">
                                                CEP
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                placeholder="00000-000"
                                                required={formData.shippingMethod === "delivery"}
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-4 gap-4">
                                        <div className="sm:col-span-3">
                                            <label className="block text-sm font-medium mb-1">
                                                Endereço
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Número
                                            </label>
                                            <input
                                                type="text"
                                                name="number"
                                                value={formData.number}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Complemento
                                        </label>
                                        <input
                                            type="text"
                                            name="complement"
                                            value={formData.complement}
                                            onChange={handleInputChange}
                                            placeholder="Apto, bloco, etc."
                                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                        />
                                    </div>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Bairro
                                            </label>
                                            <input
                                                type="text"
                                                name="neighborhood"
                                                value={formData.neighborhood}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Cidade
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Estado
                                            </label>
                                            <select
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                            >
                                                <option value="">Selecione</option>
                                                <option value="AC">Acre</option>
                                                <option value="AL">Alagoas</option>
                                                <option value="AP">Amapá</option>
                                                <option value="AM">Amazonas</option>
                                                <option value="BA">Bahia</option>
                                                <option value="CE">Ceará</option>
                                                <option value="DF">Distrito Federal</option>
                                                <option value="ES">Espírito Santo</option>
                                                <option value="GO">Goiás</option>
                                                <option value="MA">Maranhão</option>
                                                <option value="MT">Mato Grosso</option>
                                                <option value="MS">Mato Grosso do Sul</option>
                                                <option value="MG">Minas Gerais</option>
                                                <option value="PA">Pará</option>
                                                <option value="PB">Paraíba</option>
                                                <option value="PR">Paraná</option>
                                                <option value="PE">Pernambuco</option>
                                                <option value="PI">Piauí</option>
                                                <option value="RJ">Rio de Janeiro</option>
                                                <option value="RN">Rio Grande do Norte</option>
                                                <option value="RS">Rio Grande do Sul</option>
                                                <option value="RO">Rondônia</option>
                                                <option value="RR">Roraima</option>
                                                <option value="SC">Santa Catarina</option>
                                                <option value="SP">São Paulo</option>
                                                <option value="SE">Sergipe</option>
                                                <option value="TO">Tocantins</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}

                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-amber-600" />
                                    Forma de Pagamento
                                </h2>
                                <div className="grid gap-3">
                                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="pix"
                                            checked={formData.paymentMethod === "pix"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-amber-600"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium">PIX</span>
                                            <p className="text-sm text-muted-foreground">
                                                Pagamento instantâneo com 10% de desconto
                                            </p>
                                        </div>
                                        <span className="text-green-600 font-semibold text-sm">
                                            -10%
                                        </span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="credit"
                                            checked={formData.paymentMethod === "credit"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-amber-600"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium">Cartão de Crédito</span>
                                            <p className="text-sm text-muted-foreground">
                                                Em até 12x sem juros
                                            </p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary/50 transition has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="boleto"
                                            checked={formData.paymentMethod === "boleto"}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 text-amber-600"
                                        />
                                        <div className="flex-1">
                                            <span className="font-medium">Boleto Bancário</span>
                                            <p className="text-sm text-muted-foreground">
                                                Vencimento em 3 dias úteis
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="w-full gradient-gold text-white py-4 rounded-full font-semibold text-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    <>Finalizar Pedido - {formatPrice(formData.paymentMethod === "pix" ? total * 0.9 : total)}</>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Tam: {item.size}
                                                {item.color && ` | Cor: ${item.color}`}
                                            </p>
                                            <p className="font-semibold text-sm mt-1">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-border pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Frete</span>
                                    <span className={shippingCost === 0 ? "text-green-600" : ""}>
                                        {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
                                    </span>
                                </div>
                                {formData.paymentMethod === "pix" && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Desconto PIX (10%)</span>
                                        <span>-{formatPrice(total * 0.1)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                                    <span>Total</span>
                                    <span className="text-amber-700">
                                        {formatPrice(
                                            formData.paymentMethod === "pix" ? total * 0.9 : total
                                        )}
                                    </span>
                                </div>
                            </div>

                            {shippingCost > 0 && formData.shippingMethod === "delivery" && (
                                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                                    <p className="text-sm text-amber-800">
                                        Falta{" "}
                                        <span className="font-semibold">
                                            {formatPrice(29900 - subtotal)}
                                        </span>{" "}
                                        para frete gratis!
                                    </p>
                                </div>
                            )}
                            {formData.shippingMethod === "pickup" && (
                                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-700">
                                        Voce escolheu retirar na loja. Frete gratis!
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Shield className="h-4 w-4" />
                                <span>Compra Segura</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Truck className="h-4 w-4" />
                                <span>Entrega Rápida</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
