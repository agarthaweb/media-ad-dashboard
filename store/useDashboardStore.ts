/**
 * Dashboard Store - Global State Management with Zustand (Multi-CSV Support)
 *
 * This is the CENTRAL HUB of the application. Think of it like a database that:
 * 1. Stores multiple CSV datasets (for month-over-month comparison)
 * 2. Manages active dataset selection
 * 3. Handles comparison mode for multiple datasets
 * 4. Provides actions to modify data (upload, rename, delete, select)
 * 5. Notifies components when data changes (automatic re-renders)
 *
 * Why Zustand?
 * - Simple API (easier than Redux)
 * - No boilerplate code
 * - Works great with TypeScript
 * - Perfect for medium-sized apps
 *
 * Flow:
 * User uploads CSV → uploadCSV() → Parse → Process → Create dataset → Update store → UI re-renders
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RawCSVRow, ProcessedPublisherData, DashboardStats, Campaign, CSVDataset, ComparisonData } from '@/lib/types'
import { parseCSV, extractCampaigns } from '@/lib/csv-parser'
import { processCSVData, calculateDashboardStats } from '@/lib/data-processor'

// ============================================================================
// STORE INTERFACE
// ============================================================================

/**
 * DashboardStore - The shape of our global state
 *
 * This defines everything the store holds and can do.
 */
interface DashboardStore {
  // ===== DATA STATE =====
  datasets: CSVDataset[]                       // Array of all uploaded datasets
  activeDatasetId: string | null               // ID of currently active dataset
  comparisonMode: boolean                      // Is comparison mode enabled?
  selectedDatasetIds: string[]                 // IDs of datasets selected for comparison (2+)

  // ===== UI STATE =====
  isLoading: boolean                           // Is data being processed?
  error: string | null                         // Any error messages

  // ===== ACTIONS - Dataset Management =====
  uploadCSV: (file: File, datasetName: string) => Promise<void>  // Upload and process CSV file
  deleteDataset: (datasetId: string) => void                      // Remove a dataset
  renameDataset: (datasetId: string, newName: string) => void     // Rename a dataset
  setActiveDataset: (datasetId: string) => void                   // Switch active dataset
  selectCampaignForDataset: (datasetId: string, campaignId: string) => void  // Filter dataset by campaign

  // ===== ACTIONS - Comparison Mode =====
  toggleComparisonMode: () => void                                // Enable/disable comparison mode
  selectDatasetsForComparison: (datasetIds: string[]) => void    // Select which datasets to compare

  // ===== ACTIONS - Utility =====
  clearAllData: () => void                                        // Reset everything
  setError: (error: string | null) => void                       // Set error message

  // ===== GETTERS =====
  getActiveDataset: () => CSVDataset | null                      // Get currently active dataset
  getDataset: (datasetId: string) => CSVDataset | undefined      // Get specific dataset
  getComparisonData: () => ComparisonData[]                      // Get comparison data for selected datasets
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * generateDatasetId - Create unique ID for dataset
 */
const generateDatasetId = (): string => {
  return `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * createDataset - Build a CSVDataset object from parsed data
 */
const createDataset = (
  id: string,
  name: string,
  fileName: string,
  rawData: RawCSVRow[]
): CSVDataset => {
  const campaigns = extractCampaigns(rawData)
  const campaignsWithAll: Campaign[] = [
    { id: 'all', name: 'All Campaigns' },
    ...campaigns
  ]

  const processedData = processCSVData(rawData, null)
  const stats = calculateDashboardStats(processedData)

  return {
    id,
    name,
    fileName,
    uploadedAt: new Date(),
    rawData,
    processedData,
    campaigns: campaignsWithAll,
    selectedCampaign: 'all',
    stats
  }
}

/**
 * getUnionOfPublishers - Get all unique publishers across multiple datasets
 */
const getUnionOfPublishers = (datasets: CSVDataset[]): string[] => {
  const publisherSet = new Set<string>()

  datasets.forEach(dataset => {
    dataset.processedData.forEach(pub => {
      publisherSet.add(pub.publisher)
    })
  })

  return Array.from(publisherSet).sort()
}

/**
 * buildComparisonData - Create comparison data structure from multiple datasets
 */
const buildComparisonData = (datasets: CSVDataset[]): ComparisonData[] => {
  const publishers = getUnionOfPublishers(datasets)

  return publishers.map(publisher => {
    const datasetMetrics = datasets.map(dataset => {
      const publisherData = dataset.processedData.find(p => p.publisher === publisher)

      return {
        datasetId: dataset.id,
        datasetName: dataset.name,
        impressions: publisherData?.impressions || 0,
        spend: publisherData?.spend || 0,
        cpm: publisherData?.cpm || 0,
        spendPercentage: publisherData?.spendPercentage || 0
      }
    })

    return {
      publisher,
      datasets: datasetMetrics
    }
  })
}

// ============================================================================
// CREATE STORE
// ============================================================================

/**
 * useDashboardStore - The main store hook
 *
 * Usage in components:
 * const { datasets, uploadCSV, activeDatasetId } = useDashboardStore()
 *
 * Zustand automatically handles:
 * - Re-rendering components when data changes
 * - Performance optimization (only re-renders if data you use changes)
 * - Persistence to localStorage (datasets are saved between sessions)
 */
export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({

      // ===== INITIAL STATE =====
      datasets: [],
      activeDatasetId: null,
      comparisonMode: false,
      selectedDatasetIds: [],
      isLoading: false,
      error: null,

      // ===== ACTIONS - Dataset Management =====

      /**
       * uploadCSV - Main action for handling file uploads
       *
       * This creates a NEW dataset from the uploaded CSV.
       * Unlike the old version, this doesn't replace existing data!
       *
       * Flow:
       * 1. Set loading state
       * 2. Parse CSV file → RawCSVRow[]
       * 3. Create dataset with processed data
       * 4. Add to datasets array
       * 5. Set as active dataset
       *
       * @param file - The uploaded File object
       * @param datasetName - User-provided name for this dataset
       */
      uploadCSV: async (file: File, datasetName: string) => {
        set({
          isLoading: true,
          error: null
        })

        try {
          // STEP 1: Parse CSV file
          console.log('📄 Parsing CSV file:', file.name)
          const { data, error } = await parseCSV(file)

          // Check for parsing errors
          if (error) {
            set({
              isLoading: false,
              error: error.message
            })
            return
          }

          // Check if we got data
          if (data.length === 0) {
            set({
              isLoading: false,
              error: 'CSV file is empty'
            })
            return
          }

          console.log(`✅ Parsed ${data.length} rows from CSV`)

          // STEP 2: Create dataset
          const datasetId = generateDatasetId()
          const dataset = createDataset(datasetId, datasetName, file.name, data)

          console.log(`📦 Created dataset: ${datasetName} (${dataset.processedData.length} publishers)`)

          // STEP 3: Add to store and set as active
          set(state => ({
            datasets: [...state.datasets, dataset],
            activeDatasetId: datasetId,
            isLoading: false,
            error: null
          }))

          console.log('✨ Dataset loaded successfully!')

        } catch (err) {
          console.error('❌ Error uploading CSV:', err)
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : 'Failed to process CSV file'
          })
        }
      },

      /**
       * deleteDataset - Remove a dataset
       *
       * @param datasetId - ID of dataset to delete
       */
      deleteDataset: (datasetId: string) => {
        const { datasets, activeDatasetId, selectedDatasetIds } = get()

        console.log('🗑️ Deleting dataset:', datasetId)

        // Remove from datasets array
        const newDatasets = datasets.filter(d => d.id !== datasetId)

        // If we deleted the active dataset, pick a new active one
        let newActiveId = activeDatasetId
        if (activeDatasetId === datasetId) {
          newActiveId = newDatasets.length > 0 ? newDatasets[0].id : null
        }

        // Remove from comparison selection if present
        const newSelectedIds = selectedDatasetIds.filter(id => id !== datasetId)

        set({
          datasets: newDatasets,
          activeDatasetId: newActiveId,
          selectedDatasetIds: newSelectedIds
        })
      },

      /**
       * renameDataset - Change dataset name
       *
       * @param datasetId - ID of dataset to rename
       * @param newName - New name for dataset
       */
      renameDataset: (datasetId: string, newName: string) => {
        console.log(`✏️ Renaming dataset ${datasetId} to: ${newName}`)

        set(state => ({
          datasets: state.datasets.map(d =>
            d.id === datasetId ? { ...d, name: newName } : d
          )
        }))
      },

      /**
       * setActiveDataset - Switch which dataset is currently active
       *
       * @param datasetId - ID of dataset to make active
       */
      setActiveDataset: (datasetId: string) => {
        const { datasets } = get()
        const dataset = datasets.find(d => d.id === datasetId)

        if (!dataset) {
          console.warn(`⚠️ Dataset ${datasetId} not found`)
          return
        }

        console.log('👉 Setting active dataset:', dataset.name)
        set({ activeDatasetId: datasetId })
      },

      /**
       * selectCampaignForDataset - Filter a specific dataset by campaign
       *
       * This re-processes the dataset's raw data with the new campaign filter.
       *
       * @param datasetId - ID of dataset to filter
       * @param campaignId - Campaign ID to filter by ('all' = no filter)
       */
      selectCampaignForDataset: (datasetId: string, campaignId: string) => {
        const { datasets } = get()
        const dataset = datasets.find(d => d.id === datasetId)

        if (!dataset) {
          console.warn(`⚠️ Dataset ${datasetId} not found`)
          return
        }

        console.log(`🔍 Filtering dataset ${dataset.name} by campaign: ${campaignId}`)

        // Re-process data with new campaign filter
        const filterValue = campaignId === 'all' ? null : campaignId
        const processedData = processCSVData(dataset.rawData, filterValue)
        const stats = calculateDashboardStats(processedData)

        console.log(`📊 Filtered to ${processedData.length} publishers`)

        // Update dataset
        set(state => ({
          datasets: state.datasets.map(d =>
            d.id === datasetId
              ? { ...d, selectedCampaign: campaignId, processedData, stats }
              : d
          )
        }))
      },

      // ===== ACTIONS - Comparison Mode =====

      /**
       * toggleComparisonMode - Enable/disable comparison mode
       */
      toggleComparisonMode: () => {
        const { comparisonMode } = get()
        console.log(`🔄 Toggling comparison mode: ${!comparisonMode}`)

        set({ comparisonMode: !comparisonMode })
      },

      /**
       * selectDatasetsForComparison - Choose which datasets to compare
       *
       * @param datasetIds - Array of dataset IDs to compare
       */
      selectDatasetsForComparison: (datasetIds: string[]) => {
        console.log(`📊 Selecting datasets for comparison:`, datasetIds)
        set({ selectedDatasetIds: datasetIds })
      },

      // ===== ACTIONS - Utility =====

      /**
       * clearAllData - Reset everything to initial state
       */
      clearAllData: () => {
        console.log('🗑️ Clearing all dashboard data')
        set({
          datasets: [],
          activeDatasetId: null,
          comparisonMode: false,
          selectedDatasetIds: [],
          error: null
        })
      },

      /**
       * setError - Manually set an error message
       *
       * @param error - Error message (null to clear)
       */
      setError: (error: string | null) => {
        set({ error })
      },

      // ===== GETTERS =====

      /**
       * getActiveDataset - Get currently active dataset
       *
       * @returns Active dataset or null if none selected
       */
      getActiveDataset: () => {
        const { datasets, activeDatasetId } = get()
        if (!activeDatasetId) return null
        return datasets.find(d => d.id === activeDatasetId) || null
      },

      /**
       * getDataset - Get specific dataset by ID
       *
       * @param datasetId - ID of dataset to retrieve
       * @returns Dataset or undefined if not found
       */
      getDataset: (datasetId: string) => {
        const { datasets } = get()
        return datasets.find(d => d.id === datasetId)
      },

      /**
       * getComparisonData - Build comparison data for selected datasets
       *
       * @returns Array of comparison data (one per publisher)
       */
      getComparisonData: () => {
        const { datasets, selectedDatasetIds } = get()

        if (selectedDatasetIds.length < 2) {
          console.warn('⚠️ Need at least 2 datasets selected for comparison')
          return []
        }

        const selectedDatasets = datasets.filter(d =>
          selectedDatasetIds.includes(d.id)
        )

        return buildComparisonData(selectedDatasets)
      }

    }),
    {
      name: 'dashboard-storage', // localStorage key
      partialize: (state) => ({
        // Only persist datasets, not UI state
        datasets: state.datasets,
        activeDatasetId: state.activeDatasetId
      })
    }
  )
)

// ============================================================================
// SELECTOR HOOKS (PERFORMANCE OPTIMIZATION)
// ============================================================================

/**
 * These are convenience hooks that extract specific pieces of state.
 * They help with performance - components only re-render when their data changes.
 */

/**
 * useDatasets - Get all datasets
 */
export const useDatasets = () => useDashboardStore(state => state.datasets)

/**
 * useActiveDataset - Get currently active dataset
 */
export const useActiveDataset = () => {
  const activeDatasetId = useDashboardStore(state => state.activeDatasetId)
  const datasets = useDashboardStore(state => state.datasets)

  if (!activeDatasetId) return null
  return datasets.find(d => d.id === activeDatasetId) || null
}

/**
 * useProcessedData - Get processed data from active dataset
 */
export const useProcessedData = () => {
  const activeDataset = useActiveDataset()
  return activeDataset?.processedData || []
}

/**
 * useDashboardStats - Get stats from active dataset
 */
export const useDashboardStats = () => {
  const activeDataset = useActiveDataset()
  return activeDataset?.stats || {
    totalImpressions: 0,
    totalSpend: 0,
    averageCPM: 0
  }
}

/**
 * useCampaigns - Get campaigns from active dataset
 */
export const useCampaigns = () => {
  const activeDataset = useActiveDataset()
  return activeDataset?.campaigns || []
}

/**
 * useSelectedCampaign - Get selected campaign from active dataset
 */
export const useSelectedCampaign = () => {
  const activeDataset = useActiveDataset()
  return activeDataset?.selectedCampaign || 'all'
}

/**
 * useLoadingState - Get loading/error state
 */
export const useLoadingState = () => useDashboardStore(state => ({
  isLoading: state.isLoading,
  error: state.error
}))

/**
 * useHasData - Check if any datasets are loaded
 */
export const useHasData = () => {
  const datasets = useDatasets()
  return datasets.length > 0
}

/**
 * useComparisonMode - Get comparison mode state
 */
export const useComparisonMode = () => useDashboardStore(state => state.comparisonMode)

/**
 * useSelectedDatasets - Get datasets selected for comparison
 */
export const useSelectedDatasets = () => {
  const selectedIds = useDashboardStore(state => state.selectedDatasetIds)
  const datasets = useDashboardStore(state => state.datasets)

  return datasets.filter(d => selectedIds.includes(d.id))
}
