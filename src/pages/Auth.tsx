import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowLeft, CheckCircle } from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A password deve ter pelo menos 6 caracteres"),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100, "O nome é demasiado longo"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A password deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As passwords não coincidem",
  path: ["confirmPassword"],
});

const resetRequestSchema = z.object({
  email: z.string().email("Email inválido"),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, "A password deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As passwords não coincidem",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ResetRequestFormData = z.infer<typeof resetRequestSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type AuthView = "login" | "signup" | "reset-request" | "reset-password";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [view, setView] = useState<AuthView>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const { signIn, signUp, user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if this is a password recovery redirect
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "recovery" && session) {
      setView("reset-password");
    }
  }, [searchParams, session]);

  // Redirect if already logged in (but not during password reset)
  useEffect(() => {
    if (user && view !== "reset-password" && !searchParams.get("type")) {
      navigate("/");
    }
  }, [user, view, searchParams, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetRequestForm = useForm<ResetRequestFormData>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsSubmitting(true);
    const { error } = await signIn(data.email, data.password);
    setIsSubmitting(false);

    if (error) {
      let message = "Ocorreu um erro ao iniciar sessão";
      if (error.message.includes("Invalid login credentials")) {
        message = "Email ou password incorretos";
      } else if (error.message.includes("Email not confirmed")) {
        message = "Por favor, confirma o teu email antes de iniciar sessão";
      }
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    } else {
      toast({
        title: "Bem-vindo!",
        description: "Sessão iniciada com sucesso",
      });
      navigate("/");
    }
  };

  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    const { error } = await signUp(data.email, data.password, data.fullName);
    setIsSubmitting(false);

    if (error) {
      let message = "Ocorreu um erro ao criar a conta";
      if (error.message.includes("User already registered")) {
        message = "Este email já está registado. Tenta iniciar sessão.";
      } else if (error.message.includes("Password should be")) {
        message = "A password não cumpre os requisitos de segurança";
      }
      toast({
        variant: "destructive",
        title: "Erro",
        description: message,
      });
    } else {
      toast({
        title: "Conta criada!",
        description: "A tua conta foi criada com sucesso. Bem-vindo à IMA!",
      });
      navigate("/");
    }
  };

  const handleResetRequest = async (data: ResetRequestFormData) => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth?type=recovery`,
    });
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação. Tenta novamente.",
      });
    } else {
      setResetEmailSent(true);
    }
  };

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });
    setIsSubmitting(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível alterar a password. Tenta novamente.",
      });
    } else {
      setPasswordResetSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  const renderHeader = () => {
    switch (view) {
      case "login":
        return {
          title: "Bem-vindo de volta",
          subtitle: "Entra na tua conta IMA",
        };
      case "signup":
        return {
          title: "Cria a tua conta",
          subtitle: "Junta-te à Intuitive Movement Academy®",
        };
      case "reset-request":
        return {
          title: "Recuperar password",
          subtitle: "Vamos enviar-te um link para redefinir a password",
        };
      case "reset-password":
        return {
          title: "Nova password",
          subtitle: "Define uma nova password para a tua conta",
        };
    }
  };

  const header = renderHeader();

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-16 pt-32">
        <div className="section-container">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border/50 shadow-xl p-8"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                  {header.title}
                </h1>
                <p className="text-muted-foreground">{header.subtitle}</p>
              </div>

              {/* Toggle - only show for login/signup */}
              {(view === "login" || view === "signup") && (
                <div className="flex bg-muted rounded-lg p-1 mb-8">
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      view === "login"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Entrar
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("signup")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                      view === "signup"
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Registar
                  </button>
                </div>
              )}

              {/* Back button for reset views */}
              {(view === "reset-request" && !resetEmailSent) && (
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao login
                </button>
              )}

              <AnimatePresence mode="wait">
                {view === "login" && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-6">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="o.teu@email.com"
                                    className="pl-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <button
                          type="button"
                          onClick={() => setView("reset-request")}
                          className="text-sm text-primary hover:underline"
                        >
                          Esqueceste a password?
                        </button>

                        <Button
                          type="submit"
                          className="w-full"
                          variant="gold"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              A entrar...
                            </>
                          ) : (
                            "Entrar"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}

                {view === "signup" && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...signupForm}>
                      <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-5">
                        <FormField
                          control={signupForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type="text"
                                    placeholder="O teu nome"
                                    className="pl-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signupForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="o.teu@email.com"
                                    className="pl-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signupForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Mínimo 6 caracteres"
                                    className="pl-10 pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={signupForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirmar Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repete a password"
                                    className="pl-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full"
                          variant="gold"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              A criar conta...
                            </>
                          ) : (
                            "Criar Conta"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}

                {view === "reset-request" && (
                  <motion.div
                    key="reset-request"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {resetEmailSent ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Mail className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Email enviado!
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Verifica a tua caixa de entrada e clica no link para redefinir a password.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setView("login");
                            setResetEmailSent(false);
                          }}
                        >
                          Voltar ao login
                        </Button>
                      </div>
                    ) : (
                      <Form {...resetRequestForm}>
                        <form onSubmit={resetRequestForm.handleSubmit(handleResetRequest)} className="space-y-6">
                          <FormField
                            control={resetRequestForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      type="email"
                                      placeholder="o.teu@email.com"
                                      className="pl-10"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full"
                            variant="gold"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                A enviar...
                              </>
                            ) : (
                              "Enviar link de recuperação"
                            )}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </motion.div>
                )}

                {view === "reset-password" && (
                  <motion.div
                    key="reset-password"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {passwordResetSuccess ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Password alterada!
                        </h3>
                        <p className="text-muted-foreground">
                          A redirecionar para a página inicial...
                        </p>
                      </div>
                    ) : (
                      <Form {...resetPasswordForm}>
                        <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-6">
                          <FormField
                            control={resetPasswordForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nova Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Mínimo 6 caracteres"
                                      className="pl-10 pr-10"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                      ) : (
                                        <Eye className="h-4 w-4" />
                                      )}
                                    </button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={resetPasswordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmar Nova Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      {...field}
                                      type={showPassword ? "text" : "password"}
                                      placeholder="Repete a password"
                                      className="pl-10"
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            className="w-full"
                            variant="gold"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                A alterar...
                              </>
                            ) : (
                              "Alterar Password"
                            )}
                          </Button>
                        </form>
                      </Form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer */}
              {(view === "login" || view === "signup") && (
                <p className="text-center text-xs text-muted-foreground mt-6">
                  Ao criar uma conta, concordas com os nossos Termos de Uso e Política de Privacidade.
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
