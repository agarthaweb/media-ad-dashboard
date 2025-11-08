"use client"

import { useState } from "react"
import { useDashboardStore, useDatasets, useActiveDataset, useComparisonMode } from "@/store/useDashboardStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  FileText,
  Trash2,
  Pencil,
  Check,
  X,
  Calendar,
  BarChart3
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface DatasetSidebarProps {
  onUploadClick: () => void
}

export function DatasetSidebar({ onUploadClick }: DatasetSidebarProps) {
  const datasets = useDatasets()
  const activeDataset = useActiveDataset()
  const comparisonMode = useComparisonMode()

  const setActiveDataset = useDashboardStore(state => state.setActiveDataset)
  const deleteDataset = useDashboardStore(state => state.deleteDataset)
  const renameDataset = useDashboardStore(state => state.renameDataset)
  const selectedDatasetIds = useDashboardStore(state => state.selectedDatasetIds)
  const selectDatasetsForComparison = useDashboardStore(state => state.selectDatasetsForComparison)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditName(currentName)
  }

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renameDataset(id, editName.trim())
    }
    setEditingId(null)
    setEditName("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName("")
  }

  const handleToggleComparison = (datasetId: string) => {
    const isSelected = selectedDatasetIds.includes(datasetId)
    let newSelection: string[]

    if (isSelected) {
      newSelection = selectedDatasetIds.filter(id => id !== datasetId)
    } else {
      newSelection = [...selectedDatasetIds, datasetId]
    }

    // Always update the selection
    selectDatasetsForComparison(newSelection)
  }

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-2">Datasets</h2>
        <Button onClick={onUploadClick} className="w-full" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Upload New Dataset
        </Button>
      </div>

      {/* Dataset List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {datasets.length === 0 ? (
            <div className="text-center py-8 px-4">
              <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-1">No datasets uploaded</p>
              <p className="text-xs text-muted-foreground">Upload a CSV to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {datasets.map((dataset) => {
                const isActive = activeDataset?.id === dataset.id
                const isEditing = editingId === dataset.id
                const isSelectedForComparison = selectedDatasetIds.includes(dataset.id)

                return (
                  <div
                    key={dataset.id}
                    className={`
                      border rounded-lg p-3 transition-all
                      ${isActive && !comparisonMode
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:bg-muted/50"
                      }
                      ${isSelectedForComparison && comparisonMode
                        ? "border-primary bg-primary/5"
                        : ""
                      }
                    `}
                  >
                    {/* Dataset Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <Input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-7 text-sm"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit(dataset.id)
                                if (e.key === "Escape") handleCancelEdit()
                              }}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0"
                              onClick={() => handleSaveEdit(dataset.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {comparisonMode && (
                              <Checkbox
                                checked={isSelectedForComparison}
                                onCheckedChange={() => handleToggleComparison(dataset.id)}
                                className="shrink-0"
                              />
                            )}
                            <button
                              onClick={() => !comparisonMode && setActiveDataset(dataset.id)}
                              className="text-left flex-1 min-w-0"
                              disabled={comparisonMode}
                            >
                              <p className="text-sm font-medium truncate">{dataset.name}</p>
                            </button>
                          </div>
                        )}
                      </div>

                      {!isEditing && !comparisonMode && (
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleStartEdit(dataset.id, dataset.name)}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => deleteDataset(dataset.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Dataset Metadata */}
                    {!isEditing && (
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{dataset.fileName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {formatDistanceToNow(new Date(dataset.uploadedAt), { addSuffix: true })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          <span>{dataset.processedData.length} publishers</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Stats */}
      {datasets.length > 0 && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium mb-1">Total Datasets: {datasets.length}</p>
            {comparisonMode && (
              <p className="text-primary">
                {selectedDatasetIds.length} selected for comparison
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
