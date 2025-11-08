"use client"

import { useMemo } from "react"
import { useDashboardStore, useSelectedDatasets } from "@/store/useDashboardStore"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import type { ComparisonData } from "@/lib/types"

export function ComparisonTable() {
  const selectedDatasets = useSelectedDatasets()
  const getComparisonData = useDashboardStore(state => state.getComparisonData)

  const comparisonData = useMemo(() => {
    return getComparisonData()
  }, [getComparisonData, selectedDatasets])

  // Sort by total spend across all datasets (descending)
  const sortedData = useMemo(() => {
    return [...comparisonData].sort((a, b) => {
      const totalA = a.datasets.reduce((sum, d) => sum + d.spend, 0)
      const totalB = b.datasets.reduce((sum, d) => sum + d.spend, 0)
      return totalB - totalA
    })
  }, [comparisonData])

  // Calculate change percentage between first two datasets (if exactly 2 selected)
  const calculateChange = (row: ComparisonData, metric: 'impressions' | 'spend' | 'cpm') => {
    if (selectedDatasets.length !== 2) return null

    const dataset1Value = row.datasets[0][metric]
    const dataset2Value = row.datasets[1][metric]

    if (dataset1Value === 0) return null

    const change = ((dataset2Value - dataset1Value) / dataset1Value) * 100
    return change
  }

  const renderChangeIndicator = (change: number | null) => {
    if (change === null || Math.abs(change) < 0.1) {
      return <Minus className="h-3 w-3 text-muted-foreground" />
    }

    if (change > 0) {
      return (
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUp className="h-3 w-3" />
          <span className="text-xs font-medium">+{change.toFixed(1)}%</span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-1 text-red-600">
        <ArrowDown className="h-3 w-3" />
        <span className="text-xs font-medium">{change.toFixed(1)}%</span>
      </div>
    )
  }

  // Early return if not enough datasets selected
  if (selectedDatasets.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dataset Comparison</CardTitle>
          <CardDescription>Select at least 2 datasets from the sidebar to compare</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">No datasets selected for comparison</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Comparison</CardTitle>
        <CardDescription>
          Comparing {selectedDatasets.length} datasets: {selectedDatasets.map(d => d.name).join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] sticky left-0 bg-card z-10">Publisher</TableHead>
                {selectedDatasets.map((dataset) => (
                  <TableHead key={dataset.id} colSpan={3} className="text-center border-l">
                    {dataset.name}
                  </TableHead>
                ))}
                {selectedDatasets.length === 2 && (
                  <TableHead colSpan={3} className="text-center border-l bg-muted/50">
                    Change
                  </TableHead>
                )}
              </TableRow>
              <TableRow>
                <TableHead className="sticky left-0 bg-card z-10"></TableHead>
                {selectedDatasets.map((dataset) => (
                  <>
                    <TableHead key={`${dataset.id}-imp`} className="text-right">Impressions</TableHead>
                    <TableHead key={`${dataset.id}-spend`} className="text-right">Spend</TableHead>
                    <TableHead key={`${dataset.id}-cpm`} className="text-right">CPM</TableHead>
                  </>
                ))}
                {selectedDatasets.length === 2 && (
                  <>
                    <TableHead className="text-center border-l bg-muted/50">Impressions</TableHead>
                    <TableHead className="text-center bg-muted/50">Spend</TableHead>
                    <TableHead className="text-center bg-muted/50">CPM</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.slice(0, 25).map((row) => (
                <TableRow key={row.publisher}>
                  <TableCell className="font-medium sticky left-0 bg-card z-10">
                    {row.publisher}
                  </TableCell>
                  {row.datasets.map((datasetData) => (
                    <>
                      <TableCell key={`${datasetData.datasetId}-imp`} className="text-right">
                        {datasetData.impressions === 0 ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          datasetData.impressions.toLocaleString()
                        )}
                      </TableCell>
                      <TableCell key={`${datasetData.datasetId}-spend`} className="text-right">
                        {datasetData.spend === 0 ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          `$${datasetData.spend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        )}
                      </TableCell>
                      <TableCell key={`${datasetData.datasetId}-cpm`} className="text-right">
                        {datasetData.cpm === 0 ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          `$${datasetData.cpm.toFixed(2)}`
                        )}
                      </TableCell>
                    </>
                  ))}
                  {selectedDatasets.length === 2 && (
                    <>
                      <TableCell className="text-center border-l bg-muted/50">
                        {renderChangeIndicator(calculateChange(row, 'impressions'))}
                      </TableCell>
                      <TableCell className="text-center bg-muted/50">
                        {renderChangeIndicator(calculateChange(row, 'spend'))}
                      </TableCell>
                      <TableCell className="text-center bg-muted/50">
                        {renderChangeIndicator(calculateChange(row, 'cpm'))}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {sortedData.length > 25 && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Showing top 25 of {sortedData.length} publishers
          </p>
        )}
      </CardContent>
    </Card>
  )
}
