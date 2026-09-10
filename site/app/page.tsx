import { DecisionDashboard } from '@/components/decision-dashboard';
import { getDashboardData } from '@/lib/google-ads-data';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await getDashboardData();
  return <DecisionDashboard data={data} />;
}
