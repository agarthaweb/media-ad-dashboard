"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useDashboardStore } from "@/store/useDashboardStore"

const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#6366F1",
  "#84CC16",
]

export function DataVisualization() {
  // Get real data from store
  const processedData = useDashboardStore(state => state.processedData)
  const hasData = useDashboardStore(state => state.rawCSVData !== null)
  
  // Get top 10 publishers for charts (table shows 25)
  const topPublishers = processedData.slice(0, 10)

  // Prepare data for impressions chart
  const impressionsData = topPublishers.map((p) => ({
    name: p.publisher,
    value: p.impressions,
  }))

  // Prepare data for spend chart
  const spendData = topPublishers.map((p) => ({
    name: p.publisher,
    value: p.spend,
  }))

  // Prepare data for CPM chart
  const cpmData = topPublishers.map((p) => ({
    name: p.publisher,
    value: p.cpm,
  }))
  
  // Show empty state if no data
  if (!hasData || topPublishers.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['Impressions by Publisher', 'Spend by Publisher', 'CPM by Publisher'].map((title) => (
          <Card key={title} className="p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-foreground">{title}</h3>
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <p className="text-sm">No data available</p>
                <p className="text-xs mt-1">Upload a CSV file to see visualizations</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Impressions Chart */}
      <Card className="p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 text-foreground">Impressions by Publisher</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={impressionsData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              type="number"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) => {
                // Format large numbers (e.g., 1.2M, 500K)
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value.toString()
              }}
            />
            <YAxis dataKey="name" type="category" tick={{ fill: "#6B7280", fontSize: 12 }} width={90} />
            <Tooltip
              formatter={(value: number) => [value.toLocaleString(), "Impressions"]}
              contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "6px" }}
            />
            <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Spend Chart */}
      <Card className="p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 text-foreground">Spend by Publisher</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={spendData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {spendData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, "Spend"]}
              contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "6px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* CPM Chart */}
      <Card className="p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-6 text-foreground">CPM by Publisher</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={cpmData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              type="number"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis dataKey="name" type="category" tick={{ fill: "#6B7280", fontSize: 12 }} width={90} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "CPM"]}
              contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "6px" }}
            />
            <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
