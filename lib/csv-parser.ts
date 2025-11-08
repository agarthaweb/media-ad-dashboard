/**
 * CSV Parser for Media Attribution Dashboard
 * 
 * This file handles:
 * 1. Reading uploaded CSV files
 * 2. Parsing CSV text into JavaScript objects
 * 3. Validating data structure
 * 4. Converting string numbers to actual numbers
 * 5. Extracting unique campaigns
 */

import Papa from 'papaparse'
import type { RawCSVRow, Campaign, CSVValidationError } from './types'

// ============================================================================
// MAIN PARSING FUNCTION
// ============================================================================

/**
 * parseCSV - Main function to parse uploaded CSV file
 * 
 * Flow:
 * 1. User uploads file → This function receives it
 * 2. PapaParse reads the file and converts to objects
 * 3. We validate the structure
 * 4. We clean the data (remove commas, convert to numbers)
 * 5. Return cleaned data + any errors
 * 
 * @param file - The File object from the upload input
 * @returns Promise with parsed data or error
 */
export async function parseCSV(file: File): Promise<{
  data: RawCSVRow[]
  error: CSVValidationError | null
}> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,           // First row = column names
      skipEmptyLines: true,   // Ignore blank rows
      transformHeader: (header) => header.trim(), // Remove extra spaces from column names
      
      complete: (results) => {
        // PapaParse finished - now validate and clean the data
        
        const data = results.data as RawCSVRow[]
        
        // Check if we got any data
        if (data.length === 0) {
          resolve({
            data: [],
            error: {
              message: 'CSV file is empty. Please upload a file with data.'
            }
          })
          return
        }
        
        // Validate that required columns exist
        const validationError = validateCSVStructure(data[0])
        if (validationError) {
          resolve({
            data: [],
            error: validationError
          })
          return
        }
        
        // Success! Return the parsed data
        resolve({
          data: data,
          error: null
        })
      },
      
      error: (error) => {
        // PapaParse encountered an error
        resolve({
          data: [],
          error: {
            message: `Failed to parse CSV: ${error.message}`
          }
        })
      }
    })
  })
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * validateCSVStructure - Check if CSV has all required columns
 * 
 * We need these columns to work:
 * - Publisher Name (to group by)
 * - Impressions (for metrics)
 * - Advertiser Cost (for spend calculations)
 * - Campaign (for filtering)
 * 
 * @param firstRow - First data row from CSV
 * @returns Error object if validation fails, null if OK
 */
function validateCSVStructure(firstRow: RawCSVRow): CSVValidationError | null {
  const requiredColumns = [
    'Publisher Name',
    'Impressions',
    'Advertiser Cost (Adv Currency)',
    'Campaign'
  ]
  
  const missingColumns: string[] = []
  
  // Check each required column
  for (const column of requiredColumns) {
    if (!(column in firstRow)) {
      missingColumns.push(column)
    }
  }
  
  // If any columns are missing, return error
  if (missingColumns.length > 0) {
    return {
      message: `CSV is missing required columns: ${missingColumns.join(', ')}`,
      missingColumns
    }
  }
  
  return null // All good!
}

// ============================================================================
// DATA EXTRACTION FUNCTIONS
// ============================================================================

/**
 * extractCampaigns - Get list of unique campaigns from CSV data
 *
 * Looks through all rows and finds unique campaign names.
 * Used to populate the campaign filter dropdown.
 *
 * Example:
 * Input: 100 rows with 2 different campaigns
 * Output: [{id: "Campaign A", name: "Campaign A"}, {id: "Campaign B", name: "Campaign B"}]
 *
 * @param data - Parsed CSV rows
 * @returns Array of unique campaigns
 */
export function extractCampaigns(data: RawCSVRow[]): Campaign[] {
  // Use Set to get unique campaign names (no duplicates)
  const uniqueCampaigns = new Set<string>()

  data.forEach(row => {
    if (row.Campaign && row.Campaign.trim() !== '') {
      uniqueCampaigns.add(row.Campaign.trim())
    }
  })

  // Convert Set to array of Campaign objects
  const campaigns: Campaign[] = Array.from(uniqueCampaigns)
    .sort() // Alphabetical order
    .map(name => ({
      id: name,
      name: name
    }))

  return campaigns
}

// ============================================================================
// DATA CLEANING UTILITIES
// ============================================================================

/**
 * parseNumberString - Convert CSV string to actual number
 * 
 * CSV numbers come as strings with commas: "48,421" or "2,740.50"
 * We need to:
 * 1. Remove commas
 * 2. Convert to number
 * 3. Handle invalid values
 * 
 * Examples:
 * "48,421" → 48421
 * "2,740.50" → 2740.50
 * "invalid" → 0 (fallback)
 * "" → 0 (empty string)
 * 
 * @param value - String value from CSV
 * @returns Parsed number
 */
export function parseNumberString(value: string): number {
  if (!value || value.trim() === '') {
    return 0
  }
  
  // Remove commas and parse as float
  const cleaned = value.replace(/,/g, '')
  const parsed = parseFloat(cleaned)
  
  // If parsing failed (NaN), return 0
  return isNaN(parsed) ? 0 : parsed
}

/**
 * parseIntegerString - Convert CSV string to integer
 * 
 * Similar to parseNumberString but for whole numbers (impressions, bids)
 * 
 * @param value - String value from CSV
 * @returns Parsed integer
 */
export function parseIntegerString(value: string): number {
  if (!value || value.trim() === '') {
    return 0
  }
  
  // Remove commas and parse as integer
  const cleaned = value.replace(/,/g, '')
  const parsed = parseInt(cleaned, 10)
  
  return isNaN(parsed) ? 0 : parsed
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * getFileSize - Format file size for display
 * 
 * Converts bytes to KB/MB for user-friendly display
 * 
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "245.5 KB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * validateFileType - Check if file is a CSV
 * 
 * @param file - Uploaded file
 * @returns true if valid CSV, false otherwise
 */
export function validateFileType(file: File): boolean {
  // Check file extension
  const validExtensions = ['.csv', '.txt']
  const fileName = file.name.toLowerCase()
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext))
  
  // Check MIME type
  const validMimeTypes = ['text/csv', 'text/plain', 'application/csv']
  const hasValidMimeType = validMimeTypes.includes(file.type)
  
  return hasValidExtension || hasValidMimeType
}
