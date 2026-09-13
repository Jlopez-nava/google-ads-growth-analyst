'use client';

import {
  Activity, AlertTriangle, CheckCircle2, CircleDollarSign,
  Gauge, Search, Target, TrendingUp,
} from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip as RechartsTooltip, XAxis, YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DashboardData } from '@/lib/google-ads-data';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const whole = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

function pct(value: number | null, digits = 1) {
  return value == null ? '—' : `${(value * 100).toFixed(digits)}%`;
}

function dateLabel(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#8b919d]">{children}</p>;
}

function MetricCell({ label, value, detail, color }: { label: string; value: string; detail: string; color: string }) {
  return (
    <div className="relative min-h-[128px] border-b border-r border-[#e1e4ea] bg-white px-5 py-5 last:border-r-0 lg:border-b-0">
      <span className={`absolute inset-x-0 top-0 h-[3px] ${color}`} />
      <FieldLabel>{label}</FieldLabel>
      <p className={`mt-3 text-[1.45rem] font-semibold tracking-[-0.03em] ${color.replace('bg-', 'text-')}`}>{value}</p>
      <p className="mt-1.5 text-xs text-[#9aa0aa]">{detail}</p>
    </div>
  );
}

function ChartCard({ title, field, children }: { title: string; field: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-xl border-[#dde1e8] bg-white shadow-[0_1px_3px_rgba(25,34,50,.04)]">
      <CardHeader className="pb-2">
        <CardTitle className="font-mono text-[13px] uppercase tracking-[0.12em] text-[#555d69]">{title}</CardTitle>
        <CardDescription className="font-mono text-[10px] tracking-wide text-[#a0a6b0]">field: {field}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function DecisionCard({ icon: Icon, label, title, body, tone }: {
  icon: typeof Activity; label: string; title: string; body: string; tone: string;
}) {
  return (
    <Card className="border-[#e1e4ea] bg-white shadow-none">
      <CardContent className="p-5">
        <div className={`inline-flex rounded-lg p-2.5 ${tone}`}><Icon className="h-4 w-4" /></div>
        <FieldLabel>{label}</FieldLabel>
        <h3 className="mt-2 font-semibold tracking-tight text-[#242932]">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#747b87]">{body}</p>
      </CardContent>
    </Card>
  );
}

export function DecisionDashboard({ data }: { data: DashboardData }) {
  const cpa = data.current.conversions ? data.current.cost / data.current.conversions : null;
  const ctr = data.current.impressions ? data.current.clicks / data.current.impressions : 0;
  const cpc = data.current.clicks ? data.current.cost / data.current.clicks : 0;
  const activeCampaigns = data.campaigns.filter((campaign) => campaign.status === 'ENABLED').length;
  const campaign = data.campaigns[0];
  const reviewSpend = data.searchTerms.filter((row) => row.conversions === 0).reduce((sum, row) => sum + row.cost, 0);
  const tickInterval = Math.max(0, Math.ceil(data.daily.length / 7) - 1);

  return (
    <main className="min-h-screen bg-[#f5f6fa] text-[#242932]">
      <section className="border-b border-[#dde1e8] bg-white">
        <div className="mx-auto max-w-[1500px] px-5 pt-8 sm:px-8 lg:px-12 lg:pt-10">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="flex items-center gap-4">
              <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[conic-gradient(#4285f4_0_25%,#34a853_25%_50%,#fbbc05_50%_75%,#ea4335_75%)]">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-lg font-bold text-[#4285f4]">G</span>
              </div>
              <div>
                <FieldLabel>Google Ads · Decision Intelligence</FieldLabel>
                <h1 className="mt-1.5 text-3xl font-semibold tracking-[-0.035em] sm:text-[2.15rem]">Ads Performance Report</h1>
              </div>
            </div>

            <div className="text-left lg:text-right">
              <FieldLabel>Account · Period</FieldLabel>
              <p className="mt-1 text-sm font-semibold">{data.account.name} · {data.account.customerId.replace(/(\d{3})(\d{3})(\d{4})/, '$1–$2–$3')}</p>
              <p className="mt-1 font-mono text-xs text-[#4285f4]">{dateLabel(data.period.start)} – {dateLabel(data.period.end)} · 30 days</p>
              <div className="mt-3 flex flex-wrap gap-2 lg:justify-end">
                <Badge variant="outline" className="border-[#c9dcfa] bg-[#edf4ff] px-3 py-1 text-[#3978d5]">spend&nbsp; <strong>{money.format(data.current.cost)}</strong></Badge>
                <Badge variant="outline" className="border-[#cbe8d3] bg-[#eef9f1] px-3 py-1 text-[#29984c]">conversions&nbsp; <strong>{data.current.conversions.toFixed(1)}</strong></Badge>
              </div>
            </div>
          </div>

          <div className="mt-8 grid overflow-hidden border border-[#e1e4ea] sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <MetricCell label="Total spend" value={money.format(data.current.cost)} detail="30-day spend" color="bg-[#4285f4]" />
            <MetricCell label="Impressions" value={whole.format(data.current.impressions)} detail="eligible views" color="bg-[#73808f]" />
            <MetricCell label="Clicks" value={whole.format(data.current.clicks)} detail={`CTR ${pct(ctr)}`} color="bg-[#4285f4]" />
            <MetricCell label="Avg CPC" value={money.format(cpc)} detail="blended" color="bg-[#6c63c7]" />
            <MetricCell label="Conversions" value={data.current.conversions.toFixed(1)} detail="all types" color="bg-[#34a853]" />
            <MetricCell label="Cost / conv." value={cpa == null ? '—' : money.format(cpa)} detail="blended CPA" color="bg-[#299b4c]" />
            <MetricCell label="Active campaigns" value={String(activeCampaigns)} detail={`of ${data.campaigns.length} total`} color="bg-[#159b93]" />
            <MetricCell label="Avg daily spend" value={money.format(data.current.cost / 30)} detail="per day" color="bg-[#e8ad08]" />
          </div>
        </div>
      </section>

      <Tabs defaultValue="overview" className="gap-0">
        <div className="sticky top-0 z-30 border-b border-[#dfe2e8] bg-white/95 shadow-[0_2px_5px_rgba(28,35,48,.04)] backdrop-blur">
          <div className="mx-auto max-w-[1500px] overflow-x-auto px-5 sm:px-8 lg:px-12">
            <TabsList variant="line" className="report-tabs h-[58px] min-w-max gap-2 p-0">
              {[
                ['overview', 'Overview'], ['daily', 'Daily Trend'], ['campaigns', 'Campaigns'],
                ['intent', 'Search Intent'], ['decisions', 'Decision Brief'],
              ].map(([value, label]) => <TabsTrigger key={value} value={value} className="h-[58px] min-w-[118px] rounded-none px-5 text-sm data-active:bg-[#4285f4] data-active:text-white data-active:after:opacity-0">{label}</TabsTrigger>)}
            </TabsList>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title={`Daily spend · ${dateLabel(data.period.start)} – ${dateLabel(data.period.end)}`} field="cost · snapshot_date">
                <div className="h-[310px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.daily} margin={{ left: -12, right: 14, top: 18, bottom: 4 }}><CartesianGrid stroke="#e8ebf0" strokeDasharray="4 4"/><XAxis dataKey="label" interval={tickInterval} tickLine={false} axisLine={false} tick={{ fill: '#969da8', fontSize: 10, fontFamily: 'monospace' }}/><YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} tick={{ fill: '#969da8', fontSize: 10, fontFamily: 'monospace' }}/><RechartsTooltip contentStyle={{ borderRadius: 8, borderColor: '#dfe3e9', fontSize: 12 }} formatter={(value) => money.format(Number(value))}/><Line type="monotone" dataKey="cost" name="Spend" stroke="#4285f4" strokeWidth={3} dot={{ r: 2.5, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 5 }}/></LineChart></ResponsiveContainer></div>
              </ChartCard>

              <ChartCard title="Daily conversions" field="conversions · snapshot_date">
                <div className="h-[310px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.daily} margin={{ left: -22, right: 14, top: 18, bottom: 4 }}><CartesianGrid stroke="#e8ebf0" strokeDasharray="4 4"/><XAxis dataKey="label" interval={tickInterval} tickLine={false} axisLine={false} tick={{ fill: '#969da8', fontSize: 10, fontFamily: 'monospace' }}/><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#969da8', fontSize: 10, fontFamily: 'monospace' }}/><RechartsTooltip contentStyle={{ borderRadius: 8, borderColor: '#dfe3e9', fontSize: 12 }}/><Bar dataKey="conversions" name="Conversions" fill="#9bd0a9" radius={[5,5,0,0]} maxBarSize={24}/></BarChart></ResponsiveContainer></div>
              </ChartCard>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Card className="border-t-[3px] border-t-[#6c63c7]"><CardContent className="p-6"><FieldLabel>CTR</FieldLabel><p className="mt-5 text-3xl font-semibold text-[#6c63c7]">{pct(ctr, 2)}</p><p className="mt-2 text-xs text-[#9aa0aa]">field: clicks / impressions</p></CardContent></Card>
              <Card className="border-t-[3px] border-t-[#e8ad08]"><CardContent className="p-6"><FieldLabel>Avg CPC</FieldLabel><p className="mt-5 text-3xl font-semibold text-[#d49c00]">{money.format(cpc)}</p><p className="mt-2 text-xs text-[#9aa0aa]">field: spend / clicks</p></CardContent></Card>
              <Card className="border-t-[3px] border-t-[#ea4335]"><CardContent className="p-6"><FieldLabel>Cost / conv.</FieldLabel><p className="mt-5 text-3xl font-semibold text-[#d63a2e]">{cpa == null ? '—' : money.format(cpa)}</p><p className="mt-2 text-xs text-[#9aa0aa]">field: spend / conversions</p></CardContent></Card>
            </div>

            <Card className="border-[#dfe3e9] bg-white shadow-none">
              <CardHeader className="border-b border-[#eceef2]"><div className="flex flex-wrap items-center justify-between gap-3"><div><FieldLabel>Executive decision brief</FieldLabel><CardTitle className="mt-2 text-xl">Protect efficiency, then scale deliberately.</CardTitle></div><Badge variant="outline" className="border-[#cbe8d3] bg-[#eef9f1] text-[#237f40]"><CheckCircle2 className="mr-1.5 h-3.5 w-3.5"/> Stronger signal · {data.current.conversions} conversions</Badge></div></CardHeader>
              <CardContent className="grid gap-5 p-6 lg:grid-cols-3">
                <DecisionCard icon={Search} label="Protect efficiency" title="Tighten search intent" body={`${money.format(reviewSpend)} across the visible top search terms produced no conversions. Review low-intent template and education themes.`} tone="bg-[#fff0ee] text-[#d63a2e]"/>
                <DecisionCard icon={Gauge} label="Recover visibility" title="Improve rank before budget" body={`${pct(campaign?.rankLostShare ?? null)} of Search impression share was lost to rank on average—materially more than the budget constraint.`} tone="bg-[#fff8e8] text-[#b17f00]"/>
                <DecisionCard icon={CircleDollarSign} label="Improve measurement" title="Validate value quality" body="Conversion value is available. Confirm that it reflects qualified pipeline—not only form completions—before using ROAS to scale." tone="bg-[#edf4ff] text-[#3978d5]"/>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="Daily spend" field="cost · snapshot_date"><div className="h-[380px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.daily} margin={{ left: -10, right: 14, top: 18 }}><CartesianGrid stroke="#e8ebf0" strokeDasharray="4 4"/><XAxis dataKey="label" interval={tickInterval} tickLine={false} axisLine={false} tick={{ fill: '#969da8', fontSize: 10 }}/><YAxis tickFormatter={(value) => `$${value}`} tickLine={false} axisLine={false} tick={{ fill: '#969da8', fontSize: 10 }}/><RechartsTooltip formatter={(value) => money.format(Number(value))}/><Line type="monotone" dataKey="cost" stroke="#4285f4" strokeWidth={3}/></LineChart></ResponsiveContainer></div></ChartCard>
              <ChartCard title="Daily clicks" field="clicks · snapshot_date"><div className="h-[380px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.daily} margin={{ left: -20, right: 14, top: 18 }}><CartesianGrid stroke="#e8ebf0" strokeDasharray="4 4"/><XAxis dataKey="label" interval={tickInterval} tickLine={false} axisLine={false} tick={{ fill: '#969da8', fontSize: 10 }}/><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: '#969da8', fontSize: 10 }}/><RechartsTooltip/><Bar dataKey="clicks" fill="#7ba9ee" radius={[4,4,0,0]} maxBarSize={24}/></BarChart></ResponsiveContainer></div></ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card className="border-[#dfe3e9] bg-white shadow-none"><CardHeader><FieldLabel>Campaign portfolio</FieldLabel><CardTitle className="mt-2">Budget, delivery and efficiency</CardTitle><CardDescription>Fictional campaign data for a safe public demonstration. Reporting remains read-only.</CardDescription></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Campaign</TableHead><TableHead>Status</TableHead><TableHead>Strategy</TableHead><TableHead className="text-right">Budget / day</TableHead><TableHead className="text-right">Spend</TableHead><TableHead className="text-right">Clicks</TableHead><TableHead className="text-right">Conv.</TableHead><TableHead className="text-right">CPA</TableHead><TableHead className="text-right">Search IS</TableHead></TableRow></TableHeader><TableBody>{data.campaigns.map((row) => <TableRow key={row.id}><TableCell><p className="font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.channel}</p></TableCell><TableCell><Badge variant="outline" className={row.status === 'ENABLED' ? 'border-[#cbe8d3] bg-[#eef9f1] text-[#29984c]' : ''}>{row.status}</Badge></TableCell><TableCell className="text-xs">{row.bidding.replaceAll('_',' ')}</TableCell><TableCell className="text-right">{money.format(row.dailyBudget)}</TableCell><TableCell className="text-right font-medium">{money.format(row.cost)}</TableCell><TableCell className="text-right">{row.clicks}</TableCell><TableCell className="text-right">{row.conversions}</TableCell><TableCell className="text-right">{row.cpa == null ? '—' : money.format(row.cpa)}</TableCell><TableCell className="text-right">{pct(row.impressionShare)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
          </TabsContent>

          <TabsContent value="intent" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
              <Card className="border-[#dfe3e9] bg-white shadow-none"><CardHeader><FieldLabel>Search-term review</FieldLabel><CardTitle className="mt-2">Highest-spend queries</CardTitle><CardDescription>Signals for human review only—nothing is changed automatically.</CardDescription></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Search term</TableHead><TableHead>Match</TableHead><TableHead className="text-right">Clicks</TableHead><TableHead className="text-right">Spend</TableHead><TableHead className="text-right">Conv.</TableHead><TableHead>Signal</TableHead></TableRow></TableHeader><TableBody>{data.searchTerms.map((row) => <TableRow key={`${row.term}-${row.matchType}`}><TableCell className="max-w-[320px] font-medium">{row.term}</TableCell><TableCell><Badge variant="secondary">{row.matchType.replace('NEAR_','')}</Badge></TableCell><TableCell className="text-right">{row.clicks}</TableCell><TableCell className="text-right">{money.format(row.cost)}</TableCell><TableCell className="text-right">{row.conversions}</TableCell><TableCell>{row.conversions > 0 ? <span className="inline-flex items-center gap-1 text-xs font-medium text-[#29984c]"><CheckCircle2 className="h-3.5 w-3.5"/> Converted</span> : <span className="inline-flex items-center gap-1 text-xs font-medium text-[#d63a2e]"><AlertTriangle className="h-3.5 w-3.5"/> Review</span>}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
              <ChartCard title="Keyword spend" field="cost · keyword_text"><div className="h-[410px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.keywords.slice(0,7)} layout="vertical" margin={{ left: 18, right: 24 }}><CartesianGrid stroke="#e8ebf0" strokeDasharray="4 4" horizontal={false}/><XAxis type="number" tickFormatter={(value) => `$${value}`} tickLine={false} axisLine={false} tick={{ fill: '#969da8', fontSize: 10 }}/><YAxis type="category" dataKey="keyword" width={132} tickLine={false} axisLine={false} tick={{ fill: '#747b87', fontSize: 10 }}/><RechartsTooltip formatter={(value) => money.format(Number(value))}/><Bar dataKey="cost" fill="#4285f4" radius={[0,5,5,0]} maxBarSize={25}/></BarChart></ResponsiveContainer></div></ChartCard>
            </div>
          </TabsContent>

          <TabsContent value="decisions" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
              <Card className="border-[#dfe3e9] bg-white shadow-none"><CardHeader><FieldLabel>Recommended posture</FieldLabel><CardTitle className="mt-2 text-2xl">Scale the proven core. Repair weaker intent.</CardTitle><CardDescription>Move budget toward the strongest campaign only after validating pipeline quality and query control.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-3"><div className="rounded-lg border border-[#cbe8d3] bg-[#f4fbf6] p-4"><FieldLabel>Scale</FieldLabel><p className="mt-2 font-semibold text-[#29984c]">Test</p></div><div className="rounded-lg border border-[#cbe8d3] bg-[#f4fbf6] p-4"><FieldLabel>Protect</FieldLabel><p className="mt-2 font-semibold text-[#29984c]">Now</p></div><div className="rounded-lg border border-[#f1dcaa] bg-[#fffaf0] p-4"><FieldLabel>Measure</FieldLabel><p className="mt-2 font-semibold text-[#a77900]">Validate</p></div></CardContent></Card>
              <Card className="border-[#cbe8d3] bg-[#f4fbf6] shadow-none"><CardHeader><div className="flex items-center gap-2 text-[#237f40]"><CheckCircle2 className="h-4 w-4"/><CardTitle className="text-base">Decision confidence: medium</CardTitle></div><CardDescription>{data.current.conversions} conversions provide a useful directional signal, pending pipeline-quality validation.</CardDescription></CardHeader><CardContent><Progress value={68} className="[&_[data-slot=progress-track]]:h-2 [&_[data-slot=progress-indicator]]:bg-[#29984c]"/><p className="mt-3 text-xs leading-5 text-[#4b7357]">Use controlled budget tests and monitor qualified conversion rate, not lead volume alone.</p></CardContent></Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <DecisionCard icon={Search} label="Priority 1" title="Block or narrow irrelevant intent" body={`${money.format(reviewSpend)} of visible high-spend queries had zero conversions. Start with free-template and broad education themes.`} tone="bg-[#fff0ee] text-[#d63a2e]"/>
              <DecisionCard icon={TrendingUp} label="Priority 2" title="Improve ad rank and relevance" body="Rank loss is the largest visibility issue. Tighten ad-group themes, align ad copy to query intent and review landing-page experience." tone="bg-[#fff8e8] text-[#b17f00]"/>
              <DecisionCard icon={Target} label="Priority 3" title="Make conversions economically useful" body="Validate that CRM values represent qualified pipeline or revenue before adopting value-based bidding." tone="bg-[#eef9f1] text-[#29984c]"/>
            </div>

            <Card className="border-[#dfe3e9] bg-white shadow-none"><CardHeader><FieldLabel>Search visibility</FieldLabel><CardTitle className="mt-2">Where eligible impressions are being lost</CardTitle></CardHeader><CardContent className="grid gap-6 md:grid-cols-3">{[
              ['Captured', campaign?.impressionShare ?? 0, '#4285f4'], ['Lost to budget', campaign?.budgetLostShare ?? 0, '#e8ad08'], ['Lost to rank', campaign?.rankLostShare ?? 0, '#ea4335'],
            ].map(([label, value, color]) => <div key={String(label)}><div className="mb-2 flex items-center justify-between text-sm"><span>{label}</span><strong>{pct(Number(value))}</strong></div><div className="h-2 overflow-hidden rounded-full bg-[#edf0f4]"><div className="h-full rounded-full" style={{ width: `${Math.min(100, Number(value) * 100)}%`, backgroundColor: String(color) }}/></div></div>)}</CardContent></Card>
          </TabsContent>

        </div>
      </Tabs>

      <footer className="border-t border-[#dde1e8] bg-white"><div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-5 py-6 text-xs text-[#8d949f] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12"><p>{data.account.currency} · {data.account.timeZone} · data through {data.period.end}</p><p>Fictional demo snapshot · recommendations only</p></div></footer>
    </main>
  );
}
