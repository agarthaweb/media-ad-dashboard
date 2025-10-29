/**
 * Dashboard Store - Global State Management with Zustand
 * 
 * This is the CENTRAL HUB of the application. Think of it like a database that:
 * 1. Stores all data (raw CSV, processed data, campaigns)
 * 2. Provides actions to modify data (upload, filter, clear)
 * 3. Notifies components when data changes (automatic re-renders)
 * 
 * Why Zustand?
 * - Simple API (easier than Redux)
 * - No boilerplate code
 * - Works great with TypeScript
 * - Perfect for medium-sized apps
 * 
 * Flow:
 * User uploads CSV → uploadCSV() → Parse → Process → Update store → UI re-renders
 */

import { create } from 'zustand'
import type { RawCSVRow, ProcessedPublisherData, DashboardStats, Campaign } from '@/lib/types'
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
  rawCSVData: RawCSVRow[] | null              // Original CSV data (unprocessed)
  processedData: ProcessedPublisherData[]      // Aggregated publisher data (for UI)
  campaigns: Campaign[]                        // List of available campaigns
  selectedCampaign: string | null              // Currently selected campaign filter
  dashboardStats: DashboardStats               // Hero card metrics (totals)
  
  // ===== UI STATE =====
  isLoading: boolean                           // Is data being processed?
  error: string | null                         // Any error messages
  fileName: string | null                      // Name of uploaded file
  
  // ===== ACTIONS =====
  uploadCSV: (file: File) => Promise<void>     // Upload and process CSV file
  selectCampaign: (campaignId: string) => void // Filter by campaign
  clearData: () => void                         // Reset everything
  setError: (error: string | null) => void     // Set error message
}

// ============================================================================
// CREATE STORE
// ============================================================================

/**
 * useDashboardStore - The main store hook
 * 
 * Usage in components:
 * const { processedData, uploadCSV } = useDashboardStore()
 * 
 * Zustand automatically handles:
 * - Re-rendering components when data changes
 * - Performance optimization (only re-renders if data you use changes)
 */
export const useDashboardStore = create<DashboardStore>((set, get) => ({
  
  // ===== INITIAL STATE =====
  rawCSVData: null,
  processedData: [],
  campaigns: [],
  selectedCampaign: 'all',
  dashboardStats: {
    totalImpressions: 0,
    totalSpend: 0,
    averageCPM: 0
  },
  isLoading: false,
  error: null,
  fileName: null,
  
  // ===== ACTIONS =====
  
  /**
   * uploadCSV - Main action for handling file uploads
   * 
   * This is where EVERYTHING comes together!
   * 
   * Flow:
   * 1. Set loading state
   * 2. Parse CSV file → RawCSVRow[]
   * 3. Extract campaigns for dropdown
   * 4. Process data → ProcessedPublisherData[]
   * 5. Calculate dashboard stats
   * 6. Update store
   * 7. Components automatically re-render with new data!
   * 
   * @param file - The uploaded File object
   */
  uploadCSV: async (file: File) => {
    // Set loading state (shows spinner in UI)
    set({ 
      isLoading: true, 
      error: null,
      fileName: file.name 
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
      
      // STEP 2: Extract unique campaigns
      const campaigns = extractCampaigns(data)
      console.log(`📊 Found ${campaigns.length} unique campaigns:`, campaigns.map(c => c.name))
      
      // Add "All Campaigns" option
      const campaignsWithAll: Campaign[] = [
        { id: 'all', name: 'All Campaigns' },
        ...campaigns
      ]
      
      // STEP 3: Process data (aggregate publishers, calculate metrics)
      // Start with "All Campaigns" selected
      const processedData = processCSVData(data, null)
      console.log(`🔄 Processed into ${processedData.length} unique publishers`)
      
      // STEP 4: Calculate dashboard stats
      const stats = calculateDashboardStats(processedData)
      console.log('📈 Dashboard Stats:', stats)
      
      // STEP 5: Update store with all the data
      set({
        rawCSVData: data,
        processedData: processedData,
        campaigns: campaignsWithAll,
        selectedCampaign: 'all',
        dashboardStats: stats,
        isLoading: false,
        error: null
      })
      
      console.log('✨ Dashboard data loaded successfully!')
      
    } catch (err) {
      // Something went wrong
      console.error('❌ Error uploading CSV:', err)
      set({ 
        isLoading: false, 
        error: err instanceof Error ? err.message : 'Failed to process CSV file' 
      })
    }
  },
  
  /**
   * selectCampaign - Filter data by campaign
   * 
   * When user selects a campaign from dropdown, we:
   * 1. Re-process raw data with new filter
   * 2. Recalculate stats
   * 3. Update store → UI re-renders
   * 
   * This is FAST because we keep raw data in memory.
   * No need to re-upload the CSV!
   * 
   * @param campaignId - Campaign ID to filter by ('all' = no filter)
   */
  selectCampaign: (campaignId: string) => {
    const { rawCSVData } = get()
    
    // Can't filter if no data loaded
    if (!rawCSVData) {
      console.warn('⚠️ No data loaded, cannot filter by campaign')
      return
    }
    
    console.log('🔍 Filtering by campaign:', campaignId)
    
    // Re-process data with new campaign filter
    const filterValue = campaignId === 'all' ? null : campaignId
    const processedData = processCSVData(rawCSVData, filterValue)
    
    // Recalculate stats with filtered data
    const stats = calculateDashboardStats(processedData)
    
    console.log(`📊 Filtered to ${processedData.length} publishers`)
    
    // Update store
    set({
      selectedCampaign: campaignId,
      processedData: processedData,
      dashboardStats: stats
    })
  },
  
  /**
   * clearData - Reset everything to initial state
   * 
   * Used when user wants to upload a new file.
   * Clears all data and resets UI.
   */
  clearData: () => {
    console.log('🗑️ Clearing all dashboard data')
    set({
      rawCSVData: null,
      processedData: [],
      campaigns: [],
      selectedCampaign: 'all',
      dashboardStats: {
        totalImpressions: 0,
        totalSpend: 0,
        averageCPM: 0
      },
      error: null,
      fileName: null
    })
  },
  
  /**
   * setError - Manually set an error message
   * 
   * Used by components to report errors to the store.
   * 
   * @param error - Error message (null to clear)
   */
  setError: (error: string | null) => {
    set({ error })
  }
}))

// ============================================================================
// SELECTOR HOOKS (ADVANCED - OPTIONAL BUT USEFUL)
// ============================================================================

/**
 * These are convenience hooks that extract specific pieces of state.
 * They help with performance - components only re-render when their data changes.
 */

/**
 * useProcessedData - Get only the processed data
 * 
 * Usage: const data = useProcessedData()
 */
export const useProcessedData = () => useDashboardStore(state => state.processedData)

/**
 * useDashboardStats - Get only the stats
 * 
 * Usage: const stats = useDashboardStats()
 */
export const useDashboardStats = () => useDashboardStore(state => state.dashboardStats)

/**
 * useCampaigns - Get campaigns for dropdown
 * 
 * Usage: const campaigns = useCampaigns()
 */
export const useCampaigns = () => useDashboardStore(state => state.campaigns)

/**
 * useSelectedCampaign - Get currently selected campaign
 * 
 * Usage: const selected = useSelectedCampaign()
 */
export const useSelectedCampaign = () => useDashboardStore(state => state.selectedCampaign)

/**
 * useLoadingState - Get loading/error state
 * 
 * Usage: const { isLoading, error } = useLoadingState()
 */
export const useLoadingState = () => useDashboardStore(state => ({
  isLoading: state.isLoading,
  error: state.error
}))

/**
 * useHasData - Check if any data is loaded
 * 
 * Usage: const hasData = useHasData()
 * Returns: true if CSV has been uploaded, false otherwise
 */
export const useHasData = () => useDashboardStore(state => state.rawCSVData !== null)
