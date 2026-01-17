"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-amber-700">
                            Menina Mineira
                        </h1>
                    </Link>
                    <p className="text-gray-600 mt-2">
                        Entre na sua conta para continuar
                    </p>
                </div>

                <div className="flex justify-center">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: "mx-auto",
                                card: "shadow-xl border border-amber-100 rounded-2xl",
                                headerTitle: "text-amber-800",
                                headerSubtitle: "text-gray-600",
                                formButtonPrimary:
                                    "bg-amber-600 hover:bg-amber-700 text-white",
                                footerActionLink: "text-amber-600 hover:text-amber-700",
                                formFieldInput:
                                    "border-amber-200 focus:border-amber-500 focus:ring-amber-500",
                            },
                            variables: {
                                colorPrimary: "#d97706",
                            },
                        }}
                        fallbackRedirectUrl="/"
                        signUpUrl="/sign-up"
                    />
                </div>

                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-amber-600 text-sm"
                    >
                        ← Voltar para a loja
                    </Link>
                </div>
            </div>
        </div>
    );
}
