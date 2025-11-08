"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { HeroStats } from "@/components/hero-stats"
import { DataVisualization } from "@/components/data-visualization"
import { PublisherTable } from "@/components/publisher-table"
import { DatasetSidebar } from "@/components/dataset-sidebar"
import { ComparisonTable } from "@/components/comparison-table"
import { ComparisonCharts } from "@/components/comparison-charts"
import { CSVUploadDialog } from "@/components/csv-upload-dialog"
import { useComparisonMode, useHasData } from "@/store/useDashboardStore"

export default function DashboardPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const comparisonMode = useComparisonMode()
  const hasData = useHasData()

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardHeader onUploadClick={() => setUploadDialogOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DatasetSidebar onUploadClick={() => setUploadDialogOpen(true)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-8 py-8 max-w-[1920px] mx-auto">
            {!hasData ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="mb-6">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="h-12 w-12 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to Media Attribution Dashboard</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Upload your first CSV file to get started. You can upload multiple datasets to compare
                    performance month-over-month.
                  </p>
                </div>
              </div>
            ) : comparisonMode ? (
              /* Comparison Mode View */
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Compare Datasets</h2>
                  <p className="text-muted-foreground">
                    Select 2 or more datasets from the sidebar to compare their performance
                  </p>
                </div>

                {/* Comparison Charts */}
                <ComparisonCharts />

                {/* Comparison Table */}
                <ComparisonTable />
              </div>
            ) : (
              /* Single Dataset View */
              <>
                {/* Hero Stats Section */}
                <section className="mb-12">
                  <HeroStats />
                </section>

                {/* Data Visualization Section */}
                <section className="mb-12">
                  <DataVisualization />
                </section>

                {/* Publisher Table Section */}
                <section>
                  <PublisherTable />
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Upload Dialog */}
      <CSVUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  )
}
