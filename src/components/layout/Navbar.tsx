import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut, ChevronDown, Shield, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar } from "lucide-react";
const navLinks = [{
  href: "/",
  label: "Início"
}, {
  href: "/quem-somos",
  label: "Quem Somos"
}, {
  href: "/modalidades",
  label: "Modalidades"
}, {
  href: "/precos",
  label: "Preços"
}, {
  href: "/noticias",
  label: "Notícias"
}, {
  href: "/contacto",
  label: "Contacto"
}];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();
  const {
    isAdmin
  } = useAdmin();
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
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  return <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", isScrolled ? "bg-card/95 backdrop-blur-lg shadow-md" : "bg-gradient-to-r from-[#247BA0] via-[#1d6a8c] to-[#165a78]")}>
      
      <div className={cn("section-container relative z-10 transition-all duration-300", isScrolled ? "py-3" : "py-5")}>
        <nav className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <img src="/assets/logo-ima.png" alt="IMA - Intuitive Movement Academy" className="w-14 h-14 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-transform duration-300 object-cover" style={{
              filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.2)) drop-shadow(4px 4px 6px rgba(0,0,0,0.25))'
            }} />
            </div>
            <div className="flex flex-col">
              <span className={cn("font-heading font-bold text-lg leading-tight transition-colors", isScrolled ? "text-foreground" : "text-white")}>
                Intuitive Movement Academy
              </span>
              <span className={cn("text-xs font-medium transition-colors flex items-center gap-1", isScrolled ? "text-muted-foreground" : "text-accent")}>
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                Associação Desportiva
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => <Link key={link.href} to={link.href} className={cn("font-medium text-sm transition-colors relative py-1", location.pathname === link.href ? isScrolled ? "text-primary" : "text-accent" : isScrolled ? "text-foreground/80 hover:text-primary" : "text-white/90 hover:text-accent", location.pathname === link.href && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full")}>
                {link.label}
              </Link>)}
          </div>

          {/* CTA & Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={cn("font-medium gap-2", isScrolled ? "border-border" : "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white")}>
                    <User className="h-4 w-4" />
                    A Minha Conta
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      O Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/agenda" className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      A Minha Agenda
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer text-primary">
                          <Shield className="mr-2 h-4 w-4" />
                          Administração
                        </Link>
                      </DropdownMenuItem>
                    </>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Terminar Sessão
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button asChild variant="outline" className={cn("font-medium", isScrolled ? "border-border" : "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white")}>
                <Link to="/auth">Entrar</Link>
              </Button>}
            <Button asChild size="default" className="font-semibold shadow-md hover:shadow-lg transition-shadow px-6 bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/aula-experimental">Aula Experimental</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2" aria-label="Toggle menu">
            {isOpen ? <X className={cn("w-6 h-6", isScrolled ? "text-foreground" : "text-white")} /> : <Menu className={cn("w-6 h-6", isScrolled ? "text-foreground" : "text-white")} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div className={cn("lg:hidden overflow-hidden transition-all duration-300", isOpen ? "max-h-[600px] mt-4" : "max-h-0")}>
          <div className="bg-card rounded-xl p-4 shadow-lg space-y-2">
            {navLinks.map(link => <Link key={link.href} to={link.href} className={cn("block py-3 px-4 rounded-lg font-medium transition-colors", location.pathname === link.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted")}>
                {link.label}
              </Link>)}
            
            <div className="border-t border-border pt-2 mt-2 space-y-2">
              {user ? <>
                  <Link to="/dashboard" className="block py-3 px-4 rounded-lg font-medium text-foreground hover:bg-muted">
                    <LayoutDashboard className="inline-block mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link to="/perfil" className="block py-3 px-4 rounded-lg font-medium text-foreground hover:bg-muted">
                    <User className="inline-block mr-2 h-4 w-4" />
                    O Meu Perfil
                  </Link>
                  <Link to="/agenda" className="block py-3 px-4 rounded-lg font-medium text-foreground hover:bg-muted">
                    <Calendar className="inline-block mr-2 h-4 w-4" />
                    A Minha Agenda
                  </Link>
                  {isAdmin && <Link to="/admin" className="block py-3 px-4 rounded-lg font-medium text-primary hover:bg-primary/10">
                      <Shield className="inline-block mr-2 h-4 w-4" />
                      Administração
                    </Link>}
                  <button onClick={handleSignOut} className="w-full text-left py-3 px-4 rounded-lg font-medium text-destructive hover:bg-destructive/10">
                    <LogOut className="inline-block mr-2 h-4 w-4" />
                    Terminar Sessão
                  </button>
                </> : <Link to="/auth" className="block py-3 px-4 rounded-lg font-medium text-foreground hover:bg-muted">
                  <User className="inline-block mr-2 h-4 w-4" />
                  Entrar / Registar
                </Link>}
            </div>
            
            <Button asChild className="w-full mt-4" size="lg">
              <Link to="/aula-experimental">Aula Experimental</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>;
}