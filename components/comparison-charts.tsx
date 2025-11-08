"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useDashboardStore, useSelectedDatasets } from "@/store/useDashboardStore"

const CHART_COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#84CC16",
]

export function ComparisonCharts() {
  const selectedDatasets = useSelectedDatasets()
  const getComparisonData = useDashboardStore(state => state.getComparisonData)

  const comparisonData = useMemo(() => {
    return getComparisonData()
  }, [getComparisonData, selectedDatasets])

  // Get top 10 publishers by total spend across all datasets
  const topPublishers = useMemo(() => {
    const sorted = [...comparisonData].sort((a, b) => {
      const totalA = a.datasets.reduce((sum, d) => sum + d.spend, 0)
      const totalB = b.datasets.reduce((sum, d) => sum + d.spend, 0)
      return totalB - totalA
    })
    return sorted.slice(0, 10)
  }, [comparisonData])

  // Format data for impressions chart
  const impressionsChartData = topPublishers.map(pub => {
    const dataPoint: any = { publisher: pub.publisher }
    pub.datasets.forEach(d => {
      dataPoint[d.datasetName] = d.impressions
    })
    return dataPoint
  })

  // Format data for spend chart
  const spendChartData = topPublishers.map(pub => {
    const dataPoint: any = { publisher: pub.publisher }
    pub.datasets.forEach(d => {
      dataPoint[d.datasetName] = d.spend
    })
    return dataPoint
  })

  // Format data for CPM chart
  const cpmChartData = topPublishers.map(pub => {
    const dataPoint: any = { publisher: pub.publisher }
    pub.datasets.forEach(d => {
      dataPoint[d.datasetName] = d.cpm
    })
    return dataPoint
  })

  // Custom tooltip formatter
  const formatTooltipValue = (value: number, name: string, type: 'currency' | 'number') => {
    if (type === 'currency') {
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return value.toLocaleString()
  }

  // Early return if not enough datasets selected
  if (selectedDatasets.length < 2) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Impressions Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Impressions by Publisher</CardTitle>
          <CardDescription>Top 10 publishers compared across selected datasets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impressionsChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" />
                <YAxis dataKey="publisher" type="category" width={100} />
                <Tooltip
                  formatter={(value: number, name: string) => formatTooltipValue(value, name, 'number')}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 600, marginBottom: '4px' }}
                  itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
                <Legend />
                {selectedDatasets.map((dataset, index) => (
                  <Bar
                    key={dataset.id}
                    dataKey={dataset.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Spend Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Spend by Publisher</CardTitle>
          <CardDescription>Top 10 publishers compared across selected datasets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" />
                <YAxis dataKey="publisher" type="category" width={100} />
                <Tooltip
                  formatter={(value: number, name: string) => formatTooltipValue(value, name, 'currency')}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 600, marginBottom: '4px' }}
                  itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
                <Legend />
                {selectedDatasets.map((dataset, index) => (
                  <Bar
                    key={dataset.id}
                    dataKey={dataset.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* CPM Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>CPM by Publisher</CardTitle>
          <CardDescription>Top 10 publishers compared across selected datasets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cpmChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" />
                <YAxis dataKey="publisher" type="category" width={100} />
                <Tooltip
                  formatter={(value: number, name: string) => formatTooltipValue(value, name, 'currency')}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  labelStyle={{ color: 'hsl(var(--popover-foreground))', fontWeight: 600, marginBottom: '4px' }}
                  itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
                />
                <Legend />
                {selectedDatasets.map((dataset, index) => (
                  <Bar
                    key={dataset.id}
                    dataKey={dataset.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
