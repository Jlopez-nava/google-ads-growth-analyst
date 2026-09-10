export type DashboardData = {
  generatedAt: string;
  source: 'snapshot';
  account: { customerId: string; name: string; currency: string; timeZone: string };
  period: { start: string; end: string; label: string };
  current: { impressions: number; clicks: number; cost: number; conversions: number; conversionValue: number };
  prior: { impressions: number; clicks: number; cost: number; conversions: number; conversionValue: number };
  daily: Array<{ date: string; label: string; impressions: number; clicks: number; cost: number; conversions: number }>;
  weekly: Array<{ week: string; impressions: number; clicks: number; cost: number; conversions: number }>;
  campaigns: Array<{
    id: string; name: string; status: string; channel: string; bidding: string; dailyBudget: number;
    impressions: number; clicks: number; cost: number; conversions: number; ctr: number; cpc: number;
    cpa: number | null; impressionShare: number | null; budgetLostShare: number | null; rankLostShare: number | null;
  }>;
  searchTerms: Array<{
    term: string; matchType: string; status: string; impressions: number; clicks: number; cost: number; conversions: number;
  }>;
  keywords: Array<{
    keyword: string; matchType: string; status: string; qualityScore: number | null; impressions: number;
    clicks: number; cost: number; conversions: number; cpa: number | null;
  }>;
};

export const snapshotData: DashboardData = {
  generatedAt: '2026-09-01T17:30:00.000Z',
  source: 'snapshot',
  account: { customerId: 'FICTIONAL', name: 'Acme Growth — Demo', currency: 'USD', timeZone: 'America/Los_Angeles' },
  period: { start: '2026-08-02', end: '2026-08-31', label: 'Last 30 days' },
  current: { impressions: 28400, clicks: 1267, cost: 8462.15, conversions: 94, conversionValue: 22480 },
  prior: { impressions: 26120, clicks: 1104, cost: 7925.40, conversions: 76, conversionValue: 18430 },
  daily: [
    ['2026-08-02', 810, 31, 218, 2], ['2026-08-03', 920, 39, 251, 3],
    ['2026-08-04', 1010, 45, 286, 4], ['2026-08-05', 970, 42, 275, 3],
    ['2026-08-06', 1080, 49, 319, 4], ['2026-08-07', 990, 44, 302, 3],
    ['2026-08-08', 760, 30, 224, 2], ['2026-08-09', 740, 29, 210, 2],
    ['2026-08-10', 930, 40, 268, 3], ['2026-08-11', 1040, 47, 311, 4],
    ['2026-08-12', 1110, 53, 348, 5], ['2026-08-13', 1020, 46, 315, 4],
    ['2026-08-14', 980, 43, 296, 3], ['2026-08-15', 780, 32, 229, 2],
    ['2026-08-16', 800, 34, 236, 2], ['2026-08-17', 950, 41, 279, 3],
    ['2026-08-18', 1070, 50, 327, 4], ['2026-08-19', 1140, 56, 365, 5],
    ['2026-08-20', 1060, 49, 338, 4], ['2026-08-21', 1030, 47, 322, 4],
    ['2026-08-22', 820, 35, 245, 2], ['2026-08-23', 790, 33, 238, 2],
    ['2026-08-24', 990, 44, 295, 3], ['2026-08-25', 1090, 51, 342, 4],
    ['2026-08-26', 1180, 58, 381, 5], ['2026-08-27', 1120, 53, 354, 4],
    ['2026-08-28', 1080, 49, 336, 4], ['2026-08-29', 850, 36, 252, 2],
    ['2026-08-30', 830, 35, 247, 2], ['2026-08-31', 1020, 49, 319.15, 4],
  ].map(([date, impressions, clicks, cost, conversions]) => ({
    date: String(date),
    label: new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', timeZone: 'UTC' }),
    impressions: Number(impressions), clicks: Number(clicks), cost: Number(cost), conversions: Number(conversions),
  })),
  weekly: [
    { week: 'Aug 2', impressions: 6540, clicks: 280, cost: 1875, conversions: 21 },
    { week: 'Aug 9', impressions: 6620, clicks: 290, cost: 1977, conversions: 23 },
    { week: 'Aug 16', impressions: 6860, clicks: 312, cost: 2112, conversions: 26 },
    { week: 'Aug 23', impressions: 7100, clicks: 335, cost: 2248.15, conversions: 24 },
  ],
  campaigns: [
    { id: 'demo-1', name: 'High Intent — Core Product', status: 'ENABLED', channel: 'SEARCH', bidding: 'MAXIMIZE_CONVERSIONS', dailyBudget: 220, impressions: 14600, clicks: 712, cost: 4620, conversions: 61, ctr: 0.0488, cpc: 6.49, cpa: 75.74, impressionShare: 0.46, budgetLostShare: 0.14, rankLostShare: 0.40 },
    { id: 'demo-2', name: 'Competitor Alternatives', status: 'ENABLED', channel: 'SEARCH', bidding: 'TARGET_CPA', dailyBudget: 125, impressions: 8100, clicks: 318, cost: 2180.15, conversions: 21, ctr: 0.0393, cpc: 6.86, cpa: 103.82, impressionShare: 0.32, budgetLostShare: 0.11, rankLostShare: 0.57 },
    { id: 'demo-3', name: 'Category Education', status: 'ENABLED', channel: 'SEARCH', bidding: 'MAXIMIZE_CLICKS', dailyBudget: 85, impressions: 5700, clicks: 237, cost: 1662, conversions: 12, ctr: 0.0416, cpc: 7.01, cpa: 138.50, impressionShare: 0.27, budgetLostShare: 0.09, rankLostShare: 0.64 },
  ],
  searchTerms: [
    { term: 'b2b workflow automation platform', matchType: 'PHRASE', status: 'NONE', impressions: 460, clicks: 38, cost: 284, conversions: 7 },
    { term: 'free marketing workflow template', matchType: 'BROAD', status: 'NONE', impressions: 590, clicks: 44, cost: 246, conversions: 0 },
    { term: 'enterprise task management software', matchType: 'PHRASE', status: 'NONE', impressions: 330, clicks: 21, cost: 188, conversions: 3 },
    { term: 'acme growth pricing', matchType: 'EXACT', status: 'NONE', impressions: 270, clicks: 48, cost: 162, conversions: 12 },
  ],
  keywords: [
    { keyword: 'workflow automation software', matchType: 'PHRASE', status: 'ENABLED', qualityScore: 8, impressions: 7800, clicks: 402, cost: 2640, conversions: 38, cpa: 69.47 },
    { keyword: 'marketing operations platform', matchType: 'EXACT', status: 'ENABLED', qualityScore: 7, impressions: 5100, clicks: 263, cost: 1794, conversions: 24, cpa: 74.75 },
    { keyword: 'free workflow templates', matchType: 'BROAD', status: 'PAUSED', qualityScore: 4, impressions: 4100, clicks: 188, cost: 1240, conversions: 2, cpa: 620 },
    { keyword: 'b2b automation tool', matchType: 'PHRASE', status: 'ENABLED', qualityScore: 6, impressions: 3900, clicks: 171, cost: 1165, conversions: 11, cpa: 105.91 },
  ],
};

export async function getDashboardData(): Promise<DashboardData> {
  return snapshotData;
}
