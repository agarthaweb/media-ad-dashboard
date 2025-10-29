"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { useDashboardStore } from "@/store/useDashboardStore"

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  trend?: number
  color: "blue" | "green" | "purple"
}

function StatCard({ label, value, subtext, trend, color }: StatCardProps) {
  const colorClasses = {
    blue: "border-t-[#3B82F6]",
    green: "border-t-[#10B981]",
    purple: "border-t-[#8B5CF6]",
  }

  const valueColorClasses = {
    blue: "text-[#3B82F6]",
    green: "text-[#10B981]",
    purple: "text-[#8B5CF6]",
  }

  return (
    <Card className={`p-8 border-t-4 ${colorClasses[color]} shadow-sm`}>
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className={`text-5xl font-bold leading-none ${valueColorClasses[color]}`}>{value}</p>
        {(subtext || trend !== undefined) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {trend !== undefined && trend > 0 && (
              <span className="flex items-center gap-1 text-success">
                <TrendingUp className="h-3 w-3" />+{trend}%
              </span>
            )}
            {subtext && <span>{subtext}</span>}
          </div>
        )}
      </div>
    </Card>
  )
}

export function HeroStats() {
  // Get real dashboard stats from store
  const stats = useDashboardStore(state => state.dashboardStats)
  const hasData = useDashboardStore(state => state.rawCSVData !== null)
  const selectedCampaign = useDashboardStore(state => state.selectedCampaign)
  const campaigns = useDashboardStore(state => state.campaigns)
  
  // Format the campaign name for display
  const getCampaignSubtext = () => {
    if (!selectedCampaign || selectedCampaign === 'all') {
      return 'across all campaigns'
    }
    const campaign = campaigns.find(c => c.id === selectedCampaign)
    return campaign ? `for ${campaign.name}` : 'for selected campaign'
  }
  
  // Show placeholder if no data
  if (!hasData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Impressions" value="—" subtext="Upload CSV to begin" color="blue" />
        <StatCard label="Total Spend" value="—" subtext="Upload CSV to begin" color="green" />
        <StatCard label="Average CPM" value="—" subtext="Upload CSV to begin" color="purple" />
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        label="Total Impressions" 
        value={stats.totalImpressions.toLocaleString()} 
        subtext={getCampaignSubtext()}
        color="blue" 
      />
      <StatCard 
        label="Total Spend" 
        value={`$${stats.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        subtext={getCampaignSubtext()}
        color="green" 
      />
      <StatCard 
        label="Average CPM" 
        value={`$${stats.averageCPM.toFixed(2)}`} 
        subtext={getCampaignSubtext()}
        color="purple" 
      />
    </div>
  )
}
