import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Modalidades" },
  { href: "/equipa", label: "Equipa" },
  { href: "/galeria", label: "Galeria" },
  { href: "/precos", label: "Preços" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-card/95 backdrop-blur-lg shadow-md"
          : "bg-gradient-to-r from-[#247BA0] via-[#1d6a8c] to-[#165a78]"
      )}
    >
      
      <div className={cn(
        "section-container relative z-10 transition-all duration-300",
        isScrolled ? "py-3" : "py-5"
      )}>
        <nav className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md border-2 border-accent/50">
              <span className="text-primary-foreground font-heading font-bold text-xl">IMA</span>
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-heading font-bold text-lg leading-tight transition-colors",
                isScrolled ? "text-foreground" : "text-white"
              )}>
                Intuitive Movement Academy
              </span>
              <span className={cn(
                "text-xs font-medium transition-colors flex items-center gap-1",
                isScrolled ? "text-muted-foreground" : "text-accent"
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Associação Desportiva
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "font-medium text-sm transition-colors relative py-1",
                  location.pathname === link.href
                    ? isScrolled ? "text-primary" : "text-accent"
                    : isScrolled
                    ? "text-foreground/80 hover:text-primary"
                    : "text-white/90 hover:text-accent",
                  location.pathname === link.href &&
                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block flex-shrink-0">
            <Button asChild size="default" className="font-semibold shadow-md hover:shadow-lg transition-shadow px-6 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contacto">Aula Experimental</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className={cn("w-6 h-6", isScrolled ? "text-foreground" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6", isScrolled ? "text-foreground" : "text-white")} />
            )}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-96 mt-4" : "max-h-0"
          )}
        >
          <div className="bg-card rounded-xl p-4 shadow-lg space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "block py-3 px-4 rounded-lg font-medium transition-colors",
                  location.pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="w-full mt-4" size="lg">
              <Link to="/contacto">Aula Experimental</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}