import { useAuth } from "@/contexts/AuthContext";
import { useRoles } from "@/hooks/useRoles";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/ui/animated-section";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TrainerDashboard from "@/components/dashboard/TrainerDashboard";
import GuardianDashboard from "@/components/dashboard/GuardianDashboard";
import AthleteDashboard from "@/components/dashboard/AthleteDashboard";
import VisitorDashboard from "@/components/dashboard/VisitorDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isTreinador, isEncarregado, isAtleta, isLoading: rolesLoading } = useRoles();

  const isLoading = authLoading || rolesLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </Layout>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <AnimatedSection>
            <VisitorDashboard />
          </AnimatedSection>
        </div>
      </Layout>
    );
  }

  // Render based on role priority: Admin > Treinador > Encarregado > Atleta > Visitante
  const renderDashboard = () => {
    if (isAdmin) {
      return <AdminDashboard />;
    }
    if (isTreinador) {
      return <TrainerDashboard />;
    }
    if (isEncarregado) {
      return <GuardianDashboard />;
    }
    if (isAtleta) {
      return <AthleteDashboard />;
    }
    return <VisitorDashboard />;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AnimatedSection>{renderDashboard()}</AnimatedSection>
      </div>
    </Layout>
  );
};

export default Dashboard;
