"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { useDashboardStore } from "@/store/useDashboardStore"
import { sortPublishers } from "@/lib/data-processor"
import type { SortField, SortDirection } from "@/lib/types"

// Helper functions for formatting
function formatNumber(num: number): string {
  return num.toLocaleString("en-US")
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`
}

export function PublisherTable() {
  const [sortField, setSortField] = useState<SortField>("rank")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")

  // Get real data from store using selector hooks
  const { processedData, hasData } = useDashboardStore(state => {
    const activeDataset = state.getActiveDataset()
    return {
      processedData: activeDataset?.processedData || [],
      hasData: state.datasets.length > 0
    }
  })

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Sort the data
  const sortedData = sortPublishers(processedData, sortField, sortDirection)

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="h-4 w-4 text-primary" />
    )
  }
  
  // Show empty state if no data
  if (!hasData || processedData.length === 0) {
    return (
      <Card className="shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-2xl font-semibold text-foreground">Top 25 Publishers</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload a CSV file to see publisher data</p>
        </div>
        <div className="p-12 text-center text-muted-foreground">
          <p className="text-sm">No data available</p>
          <p className="text-xs mt-1">Click "Upload CSV" to get started</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-semibold text-foreground">Top 25 Publishers</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Showing {sortedData.length} {sortedData.length === 1 ? 'publisher' : 'publishers'} • Click column headers to sort
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("rank")}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  Rank
                  <SortIcon field="rank" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort("publisher")}
                  className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
                >
                  Publisher
                  <SortIcon field="publisher" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("impressions")}
                  className="flex items-center justify-end gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  Impressions
                  <SortIcon field="impressions" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("spend")}
                  className="flex items-center justify-end gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  Spend
                  <SortIcon field="spend" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("cpm")}
                  className="flex items-center justify-end gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  CPM
                  <SortIcon field="cpm" />
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <button
                  onClick={() => handleSort("spendPercentage")}
                  className="flex items-center justify-end gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors ml-auto"
                >
                  % Spend
                  <SortIcon field="spendPercentage" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((publisher) => (
              <tr key={publisher.publisher + publisher.rank} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-4 py-4">
                  <span className={`text-sm ${publisher.rank <= 3 ? "font-bold text-foreground" : "text-body"}`}>
                    {publisher.rank <= 3 && (
                      <span className="mr-1">
                        {publisher.rank === 1 && "🥇"}
                        {publisher.rank === 2 && "🥈"}
                        {publisher.rank === 3 && "🥉"}
                      </span>
                    )}
                    {publisher.rank}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-foreground">{publisher.publisher}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm text-body">{formatNumber(publisher.impressions)}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm text-body">{formatCurrency(publisher.spend)}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm text-body">{formatCurrency(publisher.cpm)}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="text-sm text-body">{formatPercentage(publisher.spendPercentage)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
