"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Filter, GitCompare } from "lucide-react"
import { CSVUploadDialog } from "@/components/csv-upload-dialog"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDashboardStore, useActiveDataset, useCampaigns, useSelectedCampaign, useComparisonMode, useDatasets } from "@/store/useDashboardStore"

interface DashboardHeaderProps {
  onUploadClick?: () => void
}

export function DashboardHeader({ onUploadClick }: DashboardHeaderProps = {}) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // Get state from store
  const activeDataset = useActiveDataset()
  const campaigns = useCampaigns()
  const selectedCampaign = useSelectedCampaign()
  const comparisonMode = useComparisonMode()
  const datasets = useDatasets()

  const selectCampaignForDataset = useDashboardStore(state => state.selectCampaignForDataset)
  const toggleComparisonMode = useDashboardStore(state => state.toggleComparisonMode)

  const hasData = datasets.length > 0
  const canCompare = datasets.length >= 2

  const handleUploadClick = () => {
    if (onUploadClick) {
      onUploadClick()
    } else {
      setUploadDialogOpen(true)
    }
  }

  const handleCampaignChange = (campaignId: string) => {
    if (activeDataset) {
      selectCampaignForDataset(activeDataset.id, campaignId)
    }
  }

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="px-4 md:px-8 py-4 max-w-[1920px] mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">MA</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-heading hidden sm:block">Media Attribution</h1>
                {comparisonMode && (
                  <Badge variant="secondary" className="text-xs ml-2">
                    Comparison Mode
                  </Badge>
                )}
              </div>
            </div>

            {/* Campaign Filter & Actions */}
            <div className="flex items-center gap-3">
              {/* Campaign Filter Dropdown - Only show if data is loaded and not in comparison mode */}
              {hasData && !comparisonMode && campaigns.length > 0 && activeDataset && (
                <Select
                  value={selectedCampaign || 'all'}
                  onValueChange={handleCampaignChange}
                >
                  <SelectTrigger className="w-[200px] md:w-[300px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Comparison Mode Toggle */}
              {canCompare && (
                <Button
                  variant={comparisonMode ? "default" : "outline"}
                  size="sm"
                  onClick={toggleComparisonMode}
                  className="gap-2"
                >
                  <GitCompare className="h-4 w-4" />
                  <span className="hidden md:inline">
                    {comparisonMode ? "Exit Compare" : "Compare"}
                  </span>
                </Button>
              )}

              <Button size="sm" className="gap-2" onClick={handleUploadClick}>
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload CSV</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {!onUploadClick && (
        <CSVUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      )}
    </>
  )
}
