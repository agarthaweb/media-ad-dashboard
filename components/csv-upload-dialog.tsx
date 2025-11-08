"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useDashboardStore } from "@/store/useDashboardStore"
import { validateFileType } from "@/lib/csv-parser"

interface CSVUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CSVUploadDialog({ open, onOpenChange }: CSVUploadDialogProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [datasetName, setDatasetName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Get upload function from store
  const uploadCSV = useDashboardStore(state => state.uploadCSV)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      // Validate file type
      if (!validateFileType(droppedFile)) {
        setUploadError('Please upload a CSV file')
        return
      }
      setFile(droppedFile)
      setUploadError(null)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!validateFileType(selectedFile)) {
        setUploadError('Please upload a CSV file')
        return
      }
      setFile(selectedFile)
      setUploadError(null)
    }
  }, [])

  const handleUpload = async () => {
    if (!file) return

    // Use dataset name if provided, otherwise use file name without extension
    const finalDatasetName = datasetName.trim() || file.name.replace(/\.csv$/i, '')

    setIsProcessing(true)
    setUploadError(null)
    setUploadSuccess(false)

    try {
      // Call the store's uploadCSV function with file and name
      // It will parse, process, and update all components automatically
      await uploadCSV(file, finalDatasetName)

      // Success!
      setUploadSuccess(true)
      setFile(null)
      setDatasetName("")

      // Close dialog after a brief success message
      setTimeout(() => {
        onOpenChange(false)
        setUploadSuccess(false)
      }, 1500)

    } catch (error) {
      // Handle any errors
      setUploadError(error instanceof Error ? error.message : 'Failed to upload file')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Campaign Data</DialogTitle>
          <DialogDescription>Upload a CSV file containing your campaign performance data</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
                ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted hover:border-primary hover:bg-primary/5"
                }
              `}
            >
              <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="csv-upload" />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">CSV files only</p>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleRemoveFile} disabled={isProcessing}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataset-name">Dataset Name</Label>
                <Input
                  id="dataset-name"
                  type="text"
                  placeholder="e.g., January 2024, Q1 Data"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  disabled={isProcessing}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: Give this dataset a meaningful name for comparison. Defaults to file name.
                </p>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing CSV...
            </div>
          )}
          
          {uploadSuccess && (
            <div className="flex items-center justify-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              Successfully uploaded! Loading dashboard...
            </div>
          )}
          
          {uploadError && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{uploadError}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!file || isProcessing}>
              {isProcessing ? "Processing..." : "Upload"}
            </Button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-xs font-medium text-foreground mb-2">Expected CSV Format:</p>
          <code className="text-xs text-muted-foreground block">
            Advertiser, Campaign, Publisher Name, Impressions, Advertiser Cost...
            <br />
            Lawrence, CAMG | TTD..., Hulu, 48421, 2740.50, ...
            <br />
            Lawrence, CAMG | TTD..., Disney+, 17536, 1057.74, ...
          </code>
          <p className="text-xs text-muted-foreground mt-2">
            Required columns: Publisher Name, Campaign, Impressions, Advertiser Cost (Adv Currency)
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
