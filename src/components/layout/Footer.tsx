import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube } from "lucide-react";

const quickLinks = [
  { href: "/sobre", label: "Sobre Nós" },
  { href: "/servicos", label: "Modalidades" },
  { href: "/equipa", label: "Equipa" },
  { href: "/galeria", label: "Galeria" },
  { href: "/precos", label: "Preços" },
  { href: "/contacto", label: "Contacto" },
];

const services = [
  "Ginástica Acrobática",
  "Iniciação (4-6 anos)",
  "Formação de Base",
  "Competição",
];

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-primary-foreground font-heading font-bold text-lg">IMA</span>
              </div>
              <div>
                <span className="font-heading font-bold text-lg block">Intuitive Movement Academy</span>
                <span className="text-primary-foreground/70 text-xs">Associação Desportiva</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed">
              Clube de ginástica acrobática em Colares, Sintra. Formamos atletas de todas as idades 
              com paixão pelo movimento e excelência desportiva.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Links Rápidos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Modalidades</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-primary-foreground/70">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Contactos</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  Colares<br />
                  2705 Sintra, Portugal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="tel:+351912345678" className="text-primary-foreground/70 hover:text-primary-foreground">
                  +351 912 345 678
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href="mailto:info@movementacademy.pt" className="text-primary-foreground/70 hover:text-primary-foreground">
                  info@movementacademy.pt
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  Seg - Sex: 17:00 - 21:00<br />
                  Sáb: 09:00 - 13:00
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} IMA - Intuitive Movement Academy. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacidade" className="text-primary-foreground/60 hover:text-primary-foreground">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="text-primary-foreground/60 hover:text-primary-foreground">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}