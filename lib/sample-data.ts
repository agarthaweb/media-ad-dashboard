export interface PublisherData {
  rank: number
  publisher: string
  impressions: number
  spend: number
  cpm: number
  spendPercentage: number
}

export const samplePublisherData: PublisherData[] = [
  { rank: 1, publisher: "Hulu", impressions: 2456789, spend: 48920, cpm: 19.92, spendPercentage: 25.5 },
  { rank: 2, publisher: "Disney+", impressions: 2134567, spend: 45678, cpm: 21.4, spendPercentage: 23.8 },
  { rank: 3, publisher: "Pluto TV", impressions: 1987654, spend: 35432, cpm: 17.83, spendPercentage: 18.5 },
  { rank: 4, publisher: "Peacock", impressions: 1654321, spend: 28765, cpm: 17.39, spendPercentage: 15.0 },
  { rank: 5, publisher: "Paramount+", impressions: 1234567, spend: 22345, cpm: 18.1, spendPercentage: 11.6 },
  { rank: 6, publisher: "Max", impressions: 987654, spend: 19876, cpm: 20.12, spendPercentage: 10.4 },
  { rank: 7, publisher: "Tubi", impressions: 876543, spend: 14567, cpm: 16.62, spendPercentage: 7.6 },
  { rank: 8, publisher: "Roku Channel", impressions: 765432, spend: 13245, cpm: 17.3, spendPercentage: 6.9 },
  { rank: 9, publisher: "Freevee", impressions: 654321, spend: 11234, cpm: 17.17, spendPercentage: 5.9 },
  { rank: 10, publisher: "Crackle", impressions: 543210, spend: 9876, cpm: 18.18, spendPercentage: 5.1 },
  { rank: 11, publisher: "Xumo", impressions: 456789, spend: 8234, cpm: 18.03, spendPercentage: 4.3 },
  { rank: 12, publisher: "Plex", impressions: 398765, spend: 7123, cpm: 17.86, spendPercentage: 3.7 },
  { rank: 13, publisher: "Vevo", impressions: 345678, spend: 6543, cpm: 18.93, spendPercentage: 3.4 },
  { rank: 14, publisher: "Sling TV", impressions: 298765, spend: 5876, cpm: 19.67, spendPercentage: 3.1 },
  { rank: 15, publisher: "FuboTV", impressions: 256789, spend: 5234, cpm: 20.38, spendPercentage: 2.7 },
  { rank: 16, publisher: "Philo", impressions: 234567, spend: 4765, cpm: 20.31, spendPercentage: 2.5 },
  { rank: 17, publisher: "Redbox", impressions: 198765, spend: 3987, cpm: 20.06, spendPercentage: 2.1 },
  { rank: 18, publisher: "Vudu", impressions: 176543, spend: 3456, cpm: 19.58, spendPercentage: 1.8 },
  { rank: 19, publisher: "IMDb TV", impressions: 154321, spend: 3012, cpm: 19.52, spendPercentage: 1.6 },
  { rank: 20, publisher: "YouTube TV", impressions: 143210, spend: 2876, cpm: 20.08, spendPercentage: 1.5 },
  { rank: 21, publisher: "Discovery+", impressions: 132109, spend: 2654, cpm: 20.09, spendPercentage: 1.4 },
  { rank: 22, publisher: "ESPN+", impressions: 121098, spend: 2432, cpm: 20.09, spendPercentage: 1.3 },
  { rank: 23, publisher: "Apple TV+", impressions: 109876, spend: 2234, cpm: 20.34, spendPercentage: 1.2 },
  { rank: 24, publisher: "Showtime", impressions: 98765, spend: 2012, cpm: 20.37, spendPercentage: 1.0 },
  { rank: 25, publisher: "Starz", impressions: 87654, spend: 1789, cpm: 20.41, spendPercentage: 0.9 },
]

export function formatNumber(num: number): string {
  return num.toLocaleString("en-US")
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function formatPercentage(num: number): string {
  return `${num.toFixed(1)}%`
}
