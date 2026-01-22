"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, CreditCard, Truck, Shield, Check, Store, MapPin, Info } from "lucide-react";
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
        cpf: "",
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        paymentMethod: "pix",
        shippingMethod: "delivery",
    });
    const [isLoadingZip, setIsLoadingZip] = useState(false);

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value / 100);
    };

    const formatCPF = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})/, "$1-$2")
            .replace(/(-\d{2})\d+?$/, "$1");
    };

    const formatPhone = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    };

    const formatCEP = (value: string) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{3})\d+?$/, "$1");
    };

    const shippingCost = formData.shippingMethod === "pickup" ? 0 : (subtotal >= 29900 ? 0 : 1990);
    const total = subtotal + shippingCost;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "cpf") formattedValue = formatCPF(value);
        if (name === "phone") formattedValue = formatPhone(value);
        if (name === "zipCode") formattedValue = formatCEP(value);

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));

        if (name === "zipCode" && value.replace(/\D/g, "").length === 8) {
            handleZipCodeLookup(value.replace(/\D/g, ""));
        }
    };

    const handleZipCodeLookup = async (zip: string) => {
        setIsLoadingZip(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${zip}/json/`);
            const data = await response.json();
            if (!data.erro) {
                setFormData((prev) => ({
                    ...prev,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf,
                }));
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        } finally {
            setIsLoadingZip(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit button clicked. Form data:", formData);

        // Basic validation
        if (formData.cpf.replace(/\D/g, "").length !== 11) {
            console.warn("Validation failed: Invalid CPF", formData.cpf);
            alert("Por favor, insira um CPF válido.");
            return;
        }

        setIsProcessing(true);
        console.log("Starting checkout API call...");

        try {
            const payload = {
                items: items,
                customer: {
                    ...formData,
                    name: `${formData.firstName} ${formData.lastName}`,
                    address: {
                        cep: formData.zipCode,
                        street: formData.street,
                        number: formData.number,
                        complement: formData.complement,
                        neighborhood: formData.neighborhood,
                        city: formData.city,
                        state: formData.state,
                    }
                },
                shippingMethod: formData.shippingMethod,
                paymentMethod: formData.paymentMethod,
                totals: {
                    subtotal,
                    shipping: shippingCost,
                    discount: formData.paymentMethod === "pix" ? Math.round(total * 0.1) : 0,
                    total: formData.paymentMethod === "pix" ? Math.round(total * 0.9) : total,
                }
            };
            console.log("Payload being sent:", payload);

            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("HTTP Error Response:", errorText);
                throw new Error(`Falha ao processar o checkout: ${response.status}`);
            }

            const data = await response.json();
            console.log("Checkout API JSON Response:", data);

            if (data.success) {
                setIsComplete(true);
                clearCart();
                window.scrollTo(0, 0);
            } else {
                console.error("Checkout Business Logic Error:", data.error);
                alert(data.error || "Ocorreu um erro ao processar seu pedido.");
            }
        } catch (error) {
            console.error("Detailed Checkout Catch Error:", error);
            alert("Erro ao processar o checkout. Por favor, tente novamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0 && !isComplete) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
                <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h1>
                <p className="text-muted-foreground mb-8 text-center max-w-xs">
                    Adicione alguns de nossos biquínis exclusivos para continuar.
                </p>
                <Link
                    href="/"
                    className="gradient-gold text-white px-10 py-4 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all active:scale-95"
                >
                    Explorar Coleção
                </Link>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
                <div className="max-w-md w-full text-center">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-8 mx-auto animate-bounce-short">
                        <Check className="h-12 w-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">
                        Pedido Confirmado!
                    </h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Arrasou na escolha! ✨ Recebemos seu pedido e já estamos preparando tudo com muito carinho. Você receberá os detalhes por e-mail em instantes.
                    </p>

                    <div className="bg-secondary/50 rounded-2xl p-6 mb-8 border border-border">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
                            Número do pedido
                        </p>
                        <p className="text-xl font-mono font-bold text-primary">
                            #{Date.now().toString(36).toUpperCase()}
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-block w-full gradient-gold text-white px-8 py-4 rounded-full font-semibold shadow-gold hover:shadow-gold-lg transition-all active:scale-95"
                    >
                        Voltar para a Loja
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Header Simples */}
            <header className="bg-white border-b border-border sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text gradient-gold">
                            MM
                        </Link>
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-green-600 uppercase tracking-widest">
                                <Shield className="h-4 w-4" />
                                <span>Ambiente Seguro</span>
                            </div>
                            <button onClick={() => router.back()} className="text-sm font-medium hover:text-primary transition-colors">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid lg:grid-cols-12 gap-8 xl:gap-12">
                    {/* Coluna do Formulário */}
                    <div className="lg:col-span-7 xl:col-span-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-8 w-1 bg-primary rounded-full" />
                            <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
                        </div>

                        {!isSignedIn && (
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8 flex gap-4 items-start">
                                <div className="bg-amber-100 p-2 rounded-lg">
                                    <Info className="h-5 w-5 text-amber-700" />
                                </div>
                                <div>
                                    <p className="text-amber-900 font-medium">Você está comprando como convidado</p>
                                    <p className="text-amber-800/80 text-sm mt-0.5">
                                        <Link href="/sign-in" className="font-bold underline decoration-2 underline-offset-2">
                                            Entre na sua conta
                                        </Link>{" "}
                                        para salvar seus dados e acompanhar pedidos.
                                    </p>
                                </div>
                            </div>
                        )}

                                                                            {/* Dados Pessoais */}                                                    <section className="bg-white border border-border rounded-3xl p-8 shadow-sm">
                                                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">1</span>
                                                            Dados Pessoais
                                                        </h2>
                                                        <div className="grid gap-5">
                                                            <div className="grid sm:grid-cols-2 gap-5">
                                                                <div className="space-y-2">
                                                                    <label className="text-sm font-semibold text-gray-700 ml-1">Nome</label>
                                                                    <input
                                                                        type="text"
                                                                        name="firstName"
                                                                        placeholder="Sua nome"
                                                                        value={formData.firstName}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-sm font-semibold text-gray-700 ml-1">Sobrenome</label>
                                                                    <input
                                                                        type="text"
                                                                        name="lastName"
                                                                        placeholder="Seu sobrenome"
                                                                        value={formData.lastName}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="grid sm:grid-cols-2 gap-5">
                                                                <div className="space-y-2">
                                                                    <label className="text-sm font-semibold text-gray-700 ml-1">E-mail</label>
                                                                    <input
                                                                        type="email"
                                                                        name="email"
                                                                        placeholder="exemplo@email.com"
                                                                        value={formData.email}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-sm font-semibold text-gray-700 ml-1">Telefone / WhatsApp</label>
                                                                    <input
                                                                        type="tel"
                                                                        name="phone"
                                                                        placeholder="(00) 00000-0000"
                                                                        value={formData.phone}
                                                                        onChange={handleInputChange}
                                                                        required
                                                                        className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-semibold text-gray-700 ml-1">CPF</label>
                                                                <input
                                                                    type="text"
                                                                    name="cpf"
                                                                    placeholder="000.000.000-00"
                                                                    value={formData.cpf}
                                                                    onChange={handleInputChange}
                                                                    required
                                                                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    </section>
                        
                                                    {/* Entrega */}
                                                    <section className="bg-white border border-border rounded-3xl p-8 shadow-sm">
                                                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">2</span>
                                                            Entrega
                                                        </h2>
                        
                                                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                                            <label className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.shippingMethod === "delivery" ? "border-primary bg-primary/5 shadow-md" : "border-gray-100 hover:border-gray-200"}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="shippingMethod"
                                                                    value="delivery"
                                                                    checked={formData.shippingMethod === "delivery"}
                                                                    onChange={handleInputChange}
                                                                    className="sr-only"
                                                                />
                                                                <MapPin className={`h-6 w-6 mb-3 ${formData.shippingMethod === "delivery" ? "text-primary" : "text-gray-400"}`} />
                                                                <span className="font-bold text-gray-900">Receber em casa</span>
                                                                <span className="text-sm text-gray-500 mt-1">
                                                                    {subtotal >= 29900 ? "Frete Grátis" : "Frete: R$ 19,90"}
                                                                </span>
                                                                {formData.shippingMethod === "delivery" && <div className="absolute top-4 right-4"><Check className="h-5 w-5 text-primary" /></div>}
                                                            </label>
                        
                                                            <label className={`relative flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.shippingMethod === "pickup" ? "border-primary bg-primary/5 shadow-md" : "border-gray-100 hover:border-gray-200"}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="shippingMethod"
                                                                    value="pickup"
                                                                    checked={formData.shippingMethod === "pickup"}
                                                                    onChange={handleInputChange}
                                                                    className="sr-only"
                                                                />
                                                                <Store className={`h-6 w-6 mb-3 ${formData.shippingMethod === "pickup" ? "text-primary" : "text-gray-400"}`} />
                                                                <span className="font-bold text-gray-900">Retirar na Loja</span>
                                                                <span className="text-sm text-gray-500 mt-1 leading-tight">São Conrado, RJ</span>
                                                                {formData.shippingMethod === "pickup" && <div className="absolute top-4 right-4"><Check className="h-5 w-5 text-primary" /></div>}
                                                            </label>
                                                        </div>
                        
                                                        {formData.shippingMethod === "delivery" && (
                                                            <div className="grid gap-5 animate-in fade-in slide-in-from-top-4 duration-300">
                                                                <div className="grid sm:grid-cols-3 gap-5">
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-semibold text-gray-700 ml-1">CEP</label>
                                                                        <div className="relative">
                                                                            <input
                                                                                type="text"
                                                                                name="zipCode"
                                                                                placeholder="00000-000"
                                                                                value={formData.zipCode}
                                                                                onChange={handleInputChange}
                                                                                required={formData.shippingMethod === "delivery"}
                                                                                className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                            />
                                                                            {isLoadingZip && (
                                                                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                                                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="grid sm:grid-cols-4 gap-5">
                                                                    <div className="sm:col-span-3 space-y-2">
                                                                        <label className="text-sm font-semibold text-gray-700 ml-1">Endereço</label>
                                                                        <input
                                                                            type="text"
                                                                            name="street"
                                                                            value={formData.street}
                                                                            onChange={handleInputChange}
                                                                            required
                                                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-semibold text-gray-700 ml-1">Número</label>
                                                                        <input
                                                                            type="text"
                                                                            name="number"
                                                                            value={formData.number}
                                                                            onChange={handleInputChange}
                                                                            required
                                                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="grid sm:grid-cols-2 gap-5">
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-semibold text-gray-700 ml-1">Complemento</label>
                                                                        <input
                                                                            type="text"
                                                                            name="complement"
                                                                            placeholder="Apto, bloco, etc."
                                                                            value={formData.complement}
                                                                            onChange={handleInputChange}
                                                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-semibold text-gray-700 ml-1">Bairro</label>
                                                                        <input
                                                                            type="text"
                                                                            name="neighborhood"
                                                                            value={formData.neighborhood}
                                                                            onChange={handleInputChange}
                                                                            required
                                                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="grid sm:grid-cols-2 gap-5">
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-semibold text-gray-700 ml-1">Cidade</label>
                                                                        <input
                                                                            type="text"
                                                                            name="city"
                                                                            value={formData.city}
                                                                            onChange={handleInputChange}
                                                                            required
                                                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-semibold text-gray-700 ml-1">Estado</label>
                                                                        <select
                                                                            name="state"
                                                                            value={formData.state}
                                                                            onChange={handleInputChange}
                                                                            required
                                                                            className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none"
                                                                        >
                                                                            <option value="">Selecione</option>
                                                                            {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map(uf => (
                                                                                <option key={uf} value={uf}>{uf}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </section>
                        
                                                    {/* Pagamento */}
                                                    <section className="bg-white border border-border rounded-3xl p-8 shadow-sm">
                                                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm">3</span>
                                                            Pagamento
                                                        </h2>
                        
                                                        <div className="space-y-3">
                                                            <label className={`relative flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === "pix" ? "border-primary bg-primary/5 shadow-md" : "border-gray-100 hover:border-gray-200"}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="paymentMethod"
                                                                    value="pix"
                                                                    checked={formData.paymentMethod === "pix"}
                                                                    onChange={handleInputChange}
                                                                    className="sr-only"
                                                                />
                                                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                                                    <span className="text-green-600 font-bold text-xs">PIX</span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <span className="font-bold text-gray-900 block font-heading">PIX Instantâneo</span>
                                                                    <span className="text-sm text-green-600 font-semibold tracking-tight">Ganhe 10% de desconto adicional</span>
                                                                </div>
                                                                {formData.paymentMethod === "pix" && <Check className="h-6 w-6 text-primary" />}
                                                            </label>
                        
                                                            <label className={`relative flex items-center gap-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === "credit" ? "border-primary bg-primary/5 shadow-md" : "border-gray-100 hover:border-ray-200"}`}>
                                                                <input
                                                                    type="radio"
                                                                    name="paymentMethod"
                                                                    value="credit"
                                                                    checked={formData.paymentMethod === "credit"}
                                                                    onChange={handleInputChange}
                                                                    className="sr-only"
                                                                />
                                                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                                                    <CreditCard className="h-6 w-6" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <span className="font-bold text-gray-900 block font-heading">Cartão de Crédito</span>
                                                                    <span className="text-sm text-gray-500">Parcele em até 12x sem juros no cartão</span>
                                                                </div>
                                                                {formData.paymentMethod === "credit" && <Check className="h-6 w-6 text-primary" />}
                                                            </label>
                                                        </div>
                                                                                                        </section>
                                                                                                </div>
                                                                                                </div>
                                                                            
                                                                                                {/* Resumo (Desktop Sticky) */}
                                            <div className="lg:col-span-5 xl:col-span-4">
                                                <div className="lg:sticky lg:top-28 space-y-6">
                                                    <div className="bg-white border border-border rounded-[2.5rem] p-8 shadow-xl shadow-gray-100 overflow-hidden relative">
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8" />
                        
                                                        <h2 className="text-xl font-bold mb-6">Resumo</h2>
                        
                                                        <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                                            {items.map((item) => (
                                                                <div key={`${item.id}-${item.size}`} className="flex gap-4 group">
                                                                    <div className="relative w-20 h-24 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                                                                        <Image
                                                                            src={item.imageUrl}
                                                                            alt={item.name}
                                                                            fill
                                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                        />
                                                                        <div className="absolute top-2 right-2 w-6 h-6 bg-white shadow-md text-primary text-xs font-bold rounded-lg flex items-center justify-center">
                                                                            {item.quantity}
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                                                        <p className="font-bold text-gray-900 text-sm leading-tight truncate">
                                                                            {item.name}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                                                                            TAM {item.size} {item.color && ` • ${item.color}`}
                                                                        </p>
                                                                        <p className="font-bold text-primary mt-2">
                                                                            {formatPrice(item.price * item.quantity)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                        
                                                        <div className="space-y-3 pt-6 border-t border-dashed border-gray-200">
                                                            <div className="flex justify-between text-sm text-gray-500">
                                                                <span>Subtotal</span>
                                                                <span className="font-medium">{formatPrice(subtotal)}</span>
                                                            </div>
                                                            <div className="flex justify-between text-sm text-gray-500">
                                                                <span>Frete</span>
                                                                <span className={`font-medium ${shippingCost === 0 ? "text-green-600" : ""}`}>
                                                                    {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
                                                                </span>
                                                            </div>
                                                            {formData.paymentMethod === "pix" && (
                                                                <div className="flex justify-between text-sm text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 mt-2">
                                                                    <span className="font-medium">Desconto PIX (10%)</span>
                                                                    <span className="font-bold">-{formatPrice(total * 0.1)}</span>
                                                                </div>
                                                            )}
                                                            <div className="flex justify-between items-end pt-5 mt-2">
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total</p>
                                                                    <p className="text-3xl font-black tracking-tighter text-gray-900 leading-none">
                                                                        {formatPrice(formData.paymentMethod === "pix" ? total * 0.9 : total)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                        
                                                        <button
                                                            type="submit"
                                                            disabled={isProcessing}
                                                            className="w-full mt-8 gradient-gold text-white py-5 rounded-2xl font-bold text-lg shadow-gold hover:shadow-gold-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                                        >
                                                            {isProcessing ? (
                                                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                "Confirmar Compra"
                                                            )}
                                                        </button>
                                                    </div>
                        
                                                    {/* Trust Badges */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-white border border-border p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                                                            <Shield className="h-6 w-6 text-green-600" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Pagamento Seguro</span>
                                                        </div>
                                                        <div className="bg-white border border-border p-4 rounded-2xl flex flex-col items-center text-center gap-2">
                                                            <Truck className="h-6 w-6 text-primary" />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Entrega Garantida</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
