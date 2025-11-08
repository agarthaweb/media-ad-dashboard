/**
 * Type Definitions for Media Attribution Dashboard
 * 
 * This file defines the shape of data as it flows through the application:
 * CSV Upload → Raw Data → Processed Data → UI Display
 */

// ============================================================================
// RAW CSV DATA TYPES
// ============================================================================

/**
 * RawCSVRow - Exactly matches the CSV column structure
 * 
 * This represents ONE row from the uploaded CSV file.
 * Column names match exactly what's in Lawrence_CTD_TTD_InventoryPerf.csv
 * 
 * Example CSV row:
 * Lawrence,CAMG | TTD | MVA/PI | Ohio | Lawrence : 4374,Video,Disney+,Disney+,291097,r9x8qzv,88877,48421,2740.50,56.5973651293435,...
 */
export interface RawCSVRow {
  Advertiser: string                          // e.g., "Lawrence"
  Campaign: string                            // e.g., "CAMG | TTD | MVA/PI | Ohio | Lawrence : 4374"
  "Media Type": string                        // e.g., "Video"
  "Publisher Name": string                    // e.g., "Disney+", "Hulu", "Pluto"
  "Publisher Name (with tail aggregation)": string
  Site: string                                // e.g., "291097", "com.hulu.plus"
  "Publisher ID": string                      // e.g., "r9x8qzv"
  Bids: string                                // e.g., "88,877" (note: comes as string with commas)
  Impressions: string                         // e.g., "48,421" (note: comes as string with commas)
  "Advertiser Cost (Adv Currency)": string    // e.g., "2,740.50" (note: comes as string)
  CPM: string                                 // e.g., "56.5973651293435" (we'll recalculate this)
  "Ad Plays": string
  "Player Completed Views": string
  "Player Starts": string
}

// ============================================================================
// PROCESSED DATA TYPES
// ============================================================================

/**
 * ProcessedPublisherData - Aggregated publisher metrics
 * 
 * After parsing CSV, we combine all rows with the same "Publisher Name"
 * and calculate totals. This is what gets displayed in charts and tables.
 * 
 * Example: All "Hulu" rows (with different Sites) get combined into one.
 */
export interface ProcessedPublisherData {
  rank: number              // Position in sorted list (1, 2, 3...)
  publisher: string         // Publisher name (e.g., "Hulu")
  impressions: number       // Total impressions (all sites combined)
  spend: number             // Total spend (all sites combined)
  cpm: number               // Calculated: (spend / impressions) * 1000
  spendPercentage: number   // What % of total spend went to this publisher
}

/**
 * DashboardStats - Summary metrics for hero stat cards
 * 
 * These are the big numbers at the top of the dashboard:
 * - Total Impressions (sum of all)
 * - Total Spend (sum of all)
 * - Average CPM (weighted average across all publishers)
 */
export interface DashboardStats {
  totalImpressions: number  // e.g., 12,345,678
  totalSpend: number        // e.g., 245,890.50
  averageCPM: number        // e.g., 19.92
}

/**
 * Campaign - Individual campaign for filter dropdown
 *
 * Each unique campaign from the CSV becomes a selectable option
 */
export interface Campaign {
  id: string    // Same as name, used as unique key
  name: string  // Display name (e.g., "CAMG | TTD | MVA/PI | Ohio | Lawrence : 4374")
}

// ============================================================================
// MULTI-CSV DATASET TYPES
// ============================================================================

/**
 * CSVDataset - Represents a single uploaded CSV with all its data
 *
 * This allows us to store multiple CSVs and compare them month-over-month
 */
export interface CSVDataset {
  id: string                              // Unique identifier (e.g., "dataset_1234567890")
  name: string                            // User-provided name (e.g., "January 2024")
  fileName: string                        // Original file name (e.g., "jan_data.csv")
  uploadedAt: Date                        // When this CSV was uploaded
  rawData: RawCSVRow[]                    // Original parsed CSV data
  processedData: ProcessedPublisherData[] // Aggregated publisher data
  campaigns: Campaign[]                   // Available campaigns in this dataset
  selectedCampaign: string | null         // Currently selected campaign filter
  stats: DashboardStats                   // Calculated summary metrics
}

/**
 * ComparisonData - Data structure for comparing multiple datasets
 *
 * Used when comparing 2+ datasets side-by-side
 */
export interface ComparisonData {
  publisher: string                       // Publisher name
  datasets: {
    datasetId: string                     // Which dataset this data is from
    datasetName: string                   // Display name of dataset
    impressions: number
    spend: number
    cpm: number
    spendPercentage: number
  }[]
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * SortField - Which column to sort by
 */
export type SortField = "rank" | "publisher" | "impressions" | "spend" | "cpm" | "spendPercentage"

/**
 * SortDirection - Sort ascending or descending
 */
export type SortDirection = "asc" | "desc"

/**
 * CSVValidationError - Structure for validation errors
 */
export interface CSVValidationError {
  message: string
  missingColumns?: string[]
  rowNumber?: number
}
