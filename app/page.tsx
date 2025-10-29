import { DashboardHeader } from "@/components/dashboard-header"
import { HeroStats } from "@/components/hero-stats"
import { DataVisualization } from "@/components/data-visualization"
import { PublisherTable } from "@/components/publisher-table"

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <main className="px-4 md:px-8 py-8 max-w-[1920px] mx-auto">
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
      </main>
    </div>
  )
}
