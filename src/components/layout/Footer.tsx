import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube, ExternalLink } from "lucide-react";
import logoIma from "@/assets/logo-ima.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={logoIma}
                  alt="IMA - Intuitive Movement Academy"
                  style={{ transform: 'perspective(500px) rotateY(-2deg)' }}
                  className="h-14 w-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.3))_drop-shadow(2px_4px_6px_rgba(0,0,0,0.2))] object-contain"
                />
              </div>
              <div>
                <span className="font-heading font-bold text-lg block">Intuitive Movement Academy</span>
                <span className="text-primary-foreground/70 text-xs">Associação Desportiva</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed">
              Move-te de forma consciente, intuitiva e liberta o teu potencial.
              <br />
              <span className="text-primary-foreground/50 text-sm">Movement Academy, 2021</span>
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

          {/* Google Maps */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Localização</h3>
            <div className="rounded-lg overflow-hidden h-48 bg-muted/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3107.5!2d-9.4463!3d38.7978!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1ecf2a3b4c5d6e7%3A0x1234567890abcdef!2sEscola%20B%C3%A1sica%20Sarrazola!5e0!3m2!1spt-PT!2spt!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização IMA - Escola Básica Sarrazola"
                className="grayscale invert-[0.92] contrast-[0.83]"
              />
            </div>
            <a
              href="https://www.google.com/maps/search/Escola+Básica+Sarrazola+Colares+Sintra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm mt-3 transition-colors"
            >
              Ver no Google Maps
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-6">Contactos</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70">
                  Escola Básica Sarrazola<br />
                  2705-352 Colares<br />
                  Sintra, Portugal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+351916799255"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  +351 916 799 255
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@movementacademy.pt"
                  className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
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
              <Link to="/privacidade" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
