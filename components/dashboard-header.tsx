"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Filter } from "lucide-react"
import { CSVUploadDialog } from "@/components/csv-upload-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDashboardStore } from "@/store/useDashboardStore"

export function DashboardHeader() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  
  // Get campaigns, selected campaign, and action from store
  const campaigns = useDashboardStore(state => state.campaigns)
  const selectedCampaign = useDashboardStore(state => state.selectedCampaign)
  const selectCampaign = useDashboardStore(state => state.selectCampaign)
  const hasData = useDashboardStore(state => state.rawCSVData !== null)

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
              <h1 className="text-xl font-bold text-text-heading hidden sm:block">Media Attribution</h1>
            </div>

            {/* Campaign Filter & Actions */}
            <div className="flex items-center gap-3">
              {/* Campaign Filter Dropdown - Only show if data is loaded */}
              {hasData && campaigns.length > 0 && (
                <Select
                  value={selectedCampaign || 'all'}
                  onValueChange={selectCampaign}
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
              
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden sm:flex bg-transparent"
                disabled={!hasData}
              >
                Export
              </Button>
              <Button size="sm" className="gap-2" onClick={() => setUploadDialogOpen(true)}>
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload CSV</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <CSVUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </>
  )
}
