/**
 * Data Processor for Media Attribution Dashboard
 * 
 * This is the BRAIN of the application. It takes raw CSV data and:
 * 1. Combines duplicate publishers (all "Hulu" rows → one "Hulu" entry)
 * 2. Converts string numbers to actual numbers
 * 3. Calculates CPM: (spend / impressions) * 1000
 * 4. Calculates spend percentages
 * 5. Sorts and ranks publishers
 * 6. Calculates dashboard totals
 */

import type { RawCSVRow, ProcessedPublisherData, DashboardStats, SortField, SortDirection } from './types'
import { parseNumberString, parseIntegerString } from './csv-parser'

// ============================================================================
// MAIN PROCESSING FUNCTION
// ============================================================================

/**
 * processCSVData - Transform raw CSV into aggregated publisher data
 * 
 * This is the CORE function. Here's what happens:
 * 
 * INPUT: Raw CSV rows (may have duplicates)
 * [
 *   { Publisher: "Hulu", Site: "com.hulu.plus", Impressions: "27,055", Cost: "1,364.32" },
 *   { Publisher: "Hulu", Site: "2285", Impressions: "42,910", Cost: "2,068.95" },
 *   { Publisher: "Disney+", Site: "291097", Impressions: "48,421", Cost: "2,740.50" }
 * ]
 * 
 * OUTPUT: Aggregated data (one entry per publisher)
 * [
 *   { publisher: "Hulu", impressions: 69965, spend: 3433.27, cpm: 49.08, ... },
 *   { publisher: "Disney+", impressions: 48421, spend: 2740.50, cpm: 56.60, ... }
 * ]
 * 
 * @param rawData - Parsed CSV rows
 * @param campaignFilter - Optional campaign to filter by (null = all campaigns)
 * @returns Processed and aggregated publisher data
 */
export function processCSVData(
  rawData: RawCSVRow[],
  campaignFilter: string | null = null
): ProcessedPublisherData[] {
  
  // STEP 1: Filter by campaign if specified
  let filteredData = rawData
  if (campaignFilter && campaignFilter !== 'all') {
    filteredData = rawData.filter(row => row.Campaign === campaignFilter)
  }
  
  // If no data after filtering, return empty array
  if (filteredData.length === 0) {
    return []
  }
  
  // STEP 2: Aggregate publishers (combine duplicates)
  const publisherMap = aggregateByPublisher(filteredData)
  
  // STEP 3: Calculate total spend (for percentage calculations)
  const totalSpend = Array.from(publisherMap.values()).reduce(
    (sum, pub) => sum + pub.spend, 
    0
  )
  
  // STEP 4: Convert Map to array and calculate derived metrics
  const processedData: ProcessedPublisherData[] = Array.from(publisherMap.entries()).map(
    ([publisherName, aggregated]) => {
      // Calculate CPM: (spend / impressions) * 1000
      const cpm = aggregated.impressions > 0 
        ? (aggregated.spend / aggregated.impressions) * 1000 
        : 0
      
      // Calculate spend percentage
      const spendPercentage = totalSpend > 0 
        ? (aggregated.spend / totalSpend) * 100 
        : 0
      
      return {
        rank: 0, // Will be set after sorting
        publisher: publisherName,
        impressions: aggregated.impressions,
        spend: aggregated.spend,
        cpm: parseFloat(cpm.toFixed(2)), // Round to 2 decimal places
        spendPercentage: parseFloat(spendPercentage.toFixed(1)) // Round to 1 decimal place
      }
    }
  )
  
  // STEP 5: Sort by spend (highest first) and assign ranks
  const sortedData = processedData.sort((a, b) => b.spend - a.spend)
  
  // Assign ranks (1, 2, 3, ...)
  sortedData.forEach((item, index) => {
    item.rank = index + 1
  })
  
  // STEP 6: Return top 25 publishers only
  return sortedData.slice(0, 25)
}

// ============================================================================
// AGGREGATION FUNCTIONS
// ============================================================================

/**
 * aggregateByPublisher - Combine all rows with same publisher name
 * 
 * Example:
 * Input: 
 * - Row 1: Hulu (site A), 10,000 impressions, $500 spend
 * - Row 2: Hulu (site B), 15,000 impressions, $750 spend
 * 
 * Output:
 * - Hulu: 25,000 impressions, $1,250 spend
 * 
 * Uses a Map for fast lookups by publisher name
 * 
 * @param data - Filtered CSV rows
 * @returns Map of publisher name → aggregated metrics
 */
function aggregateByPublisher(data: RawCSVRow[]): Map<string, {
  impressions: number
  spend: number
}> {
  const publisherMap = new Map<string, { impressions: number; spend: number }>()
  
  data.forEach(row => {
    // Get publisher name (use the aggregated version if available)
    const publisherName = row["Publisher Name (with tail aggregation)"] || row["Publisher Name"]
    
    if (!publisherName || publisherName.trim() === '') {
      return // Skip rows without publisher name
    }
    
    // Parse impressions and spend from strings to numbers
    const impressions = parseIntegerString(row.Impressions)
    const spend = parseNumberString(row["Advertiser Cost (Adv Currency)"])
    
    // If this publisher already exists in map, ADD to existing totals
    if (publisherMap.has(publisherName)) {
      const existing = publisherMap.get(publisherName)!
      publisherMap.set(publisherName, {
        impressions: existing.impressions + impressions,
        spend: existing.spend + spend
      })
    } else {
      // First time seeing this publisher, create new entry
      publisherMap.set(publisherName, {
        impressions,
        spend
      })
    }
  })
  
  return publisherMap
}

// ============================================================================
// DASHBOARD STATS CALCULATIONS
// ============================================================================

/**
 * calculateDashboardStats - Calculate totals for hero stat cards
 * 
 * Takes processed data and calculates:
 * - Total Impressions: Sum of all publisher impressions
 * - Total Spend: Sum of all publisher spend
 * - Average CPM: Weighted average across all publishers
 * 
 * @param processedData - Aggregated publisher data
 * @returns Dashboard summary statistics
 */
export function calculateDashboardStats(processedData: ProcessedPublisherData[]): DashboardStats {
  if (processedData.length === 0) {
    return {
      totalImpressions: 0,
      totalSpend: 0,
      averageCPM: 0
    }
  }
  
  // Sum up all impressions and spend
  const totals = processedData.reduce(
    (acc, publisher) => ({
      impressions: acc.impressions + publisher.impressions,
      spend: acc.spend + publisher.spend
    }),
    { impressions: 0, spend: 0 }
  )
  
  // Calculate weighted average CPM
  // Formula: (Total Spend / Total Impressions) * 1000
  const averageCPM = totals.impressions > 0 
    ? (totals.spend / totals.impressions) * 1000 
    : 0
  
  return {
    totalImpressions: totals.impressions,
    totalSpend: parseFloat(totals.spend.toFixed(2)),
    averageCPM: parseFloat(averageCPM.toFixed(2))
  }
}

// ============================================================================
// SORTING FUNCTIONS
// ============================================================================

/**
 * sortPublishers - Sort publisher data by specified field
 * 
 * User can sort table by clicking column headers.
 * This function handles the sorting logic.
 * 
 * @param data - Publisher data to sort
 * @param field - Which column to sort by
 * @param direction - asc (low to high) or desc (high to low)
 * @returns Sorted data
 */
export function sortPublishers(
  data: ProcessedPublisherData[],
  field: SortField,
  direction: SortDirection
): ProcessedPublisherData[] {
  const sorted = [...data] // Create copy to avoid mutating original
  
  sorted.sort((a, b) => {
    let aValue: number | string
    let bValue: number | string
    
    // Get the values to compare based on field
    switch (field) {
      case 'publisher':
        aValue = a.publisher.toLowerCase()
        bValue = b.publisher.toLowerCase()
        break
      case 'rank':
        aValue = a.rank
        bValue = b.rank
        break
      case 'impressions':
        aValue = a.impressions
        bValue = b.impressions
        break
      case 'spend':
        aValue = a.spend
        bValue = b.spend
        break
      case 'cpm':
        aValue = a.cpm
        bValue = b.cpm
        break
      case 'spendPercentage':
        aValue = a.spendPercentage
        bValue = b.spendPercentage
        break
      default:
        return 0
    }
    
    // Compare values
    let comparison = 0
    if (aValue > bValue) {
      comparison = 1
    } else if (aValue < bValue) {
      comparison = -1
    }
    
    // Apply sort direction
    return direction === 'asc' ? comparison : -comparison
  })
  
  return sorted
}

// ============================================================================
// FILTER FUNCTIONS
// ============================================================================

/**
 * filterByCampaign - Filter raw data by campaign before processing
 * 
 * @param data - Raw CSV rows
 * @param campaignId - Campaign to filter by (null = all)
 * @returns Filtered rows
 */
export function filterByCampaign(data: RawCSVRow[], campaignId: string | null): RawCSVRow[] {
  if (!campaignId || campaignId === 'all') {
    return data
  }
  
  return data.filter(row => row.Campaign === campaignId)
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * getTopPublishers - Get top N publishers from processed data
 * 
 * @param data - Processed publisher data
 * @param count - How many to return (default 10)
 * @returns Top N publishers by spend
 */
export function getTopPublishers(data: ProcessedPublisherData[], count: number = 10): ProcessedPublisherData[] {
  return data.slice(0, count)
}

/**
 * validateProcessedData - Sanity check on processed data
 * 
 * Catches potential data issues:
 * - Negative values
 * - Invalid CPM calculations
 * - Missing publisher names
 * 
 * @param data - Processed data to validate
 * @returns Array of warning messages (empty if all OK)
 */
export function validateProcessedData(data: ProcessedPublisherData[]): string[] {
  const warnings: string[] = []
  
  data.forEach((publisher, index) => {
    // Check for negative values
    if (publisher.impressions < 0) {
      warnings.push(`Row ${index + 1}: ${publisher.publisher} has negative impressions`)
    }
    if (publisher.spend < 0) {
      warnings.push(`Row ${index + 1}: ${publisher.publisher} has negative spend`)
    }
    
    // Check for missing publisher name
    if (!publisher.publisher || publisher.publisher.trim() === '') {
      warnings.push(`Row ${index + 1}: Missing publisher name`)
    }
    
    // Check for unreasonable CPM (outside 0-1000 range)
    if (publisher.cpm < 0 || publisher.cpm > 1000) {
      warnings.push(`Row ${index + 1}: ${publisher.publisher} has unusual CPM: $${publisher.cpm}`)
    }
  })
  
  return warnings
}
