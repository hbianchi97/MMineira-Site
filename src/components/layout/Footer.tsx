import Link from "next/link";
import { Instagram, Phone, MapPin, Mail } from "lucide-react";
import { site } from "@/lib/brand-config";

const footerLinks = {
    shop: [
        { name: "Biquínis", href: "/categoria/biquinis" },
        { name: "Maiôs", href: "/categoria/maios" },
        { name: "Saídas de Praia", href: "/categoria/saidas-de-praia" },
        { name: "Novidades", href: "/novidades" },
    ],
    help: [
        { name: "Trocas e Devoluções", href: "/trocas-devolucoes" },
        { name: "Formas de Pagamento", href: "/pagamento" },
        { name: "Política de Privacidade", href: "/privacidade" },
        { name: "Termos de Uso", href: "/termos" },
    ],
};

export function Footer() {
    return (
        <footer className="border-t border-border bg-secondary/30">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gradient-gold">
                            {site.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Moda praia exclusiva do Rio de Janeiro. Estampas
                            únicas para você brilhar na praia e na piscina.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href={site.socials.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href={site.socials.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-primary/10 p-2 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                                aria-label="WhatsApp"
                            >
                                <Phone className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                            Loja
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Links */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                            Ajuda
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.help.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
                            Contato
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                <span>{site.support.address}</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                                <a
                                    href={`tel:${site.support.phone?.replace(/\D/g, "")}`}
                                    className="hover:text-primary"
                                >
                                    {site.support.phone}
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                                <a
                                    href={`mailto:${site.support.email}`}
                                    className="hover:text-primary"
                                >
                                    {site.support.email}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 border-t border-border pt-8">
                    <p className="text-center text-sm text-muted-foreground">
                        © {new Date().getFullYear()} {site.name}. Todos os
                        direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
