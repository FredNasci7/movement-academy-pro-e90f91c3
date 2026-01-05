import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, UserCheck, Calendar, TrendingUp, Loader2, Shield, GraduationCap } from "lucide-react";

import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAthletes: 0,
    recentSignups: 0,
    totalClasses: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!isAdmin) return;

      try {
        // Get total athletes count
        const { count: totalCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Get recent signups (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: recentCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .gte("created_at", sevenDaysAgo.toISOString());

        // Get total classes count
        const { count: classesCount } = await supabase
          .from("classes")
          .select("*", { count: "exact", head: true });

        setStats({
          totalAthletes: totalCount || 0,
          recentSignups: recentCount || 0,
          totalClasses: classesCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <section className="py-16">
        <div className="section-container">
          <AnimatedSection>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Painel de Administração
                </h1>
              </div>
              <p className="text-muted-foreground">
                Gere os atletas e visualiza estatísticas da academia
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total de Atletas
                    </CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {isLoadingStats ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        stats.totalAthletes
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Utilizadores registados
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Novos Registos
                    </CardTitle>
                    <UserCheck className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {isLoadingStats ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        stats.recentSignups
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Últimos 7 dias
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Taxa de Crescimento
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {isLoadingStats ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : stats.totalAthletes > 0 ? (
                        `${Math.round((stats.recentSignups / stats.totalAthletes) * 100)}%`
                      ) : (
                        "0%"
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Crescimento semanal
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Turmas Ativas
                    </CardTitle>
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {isLoadingStats ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        stats.totalClasses
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Turmas criadas
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4">
                  <Button asChild variant="outline">
                    <Link to="/admin/atletas">
                      <Users className="mr-2 h-4 w-4" />
                      Gerir Atletas
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/admin/turmas">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      Gerir Turmas
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/admin/permissoes">
                      <Shield className="mr-2 h-4 w-4" />
                      Gerir Permissões
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/noticias">
                      <Calendar className="mr-2 h-4 w-4" />
                      Ver Notícias
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
