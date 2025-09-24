import { 
  indonesianHolidays, 
  Holiday, 
  getHolidaysByType, 
  getPublicHolidays, 
  getHolidaysByMonth, 
  searchHolidays, 
  getHolidayById 
} from '../data/indonesian-holidays';

/**
 * Holiday utility functions for tool calling and chat integration
 */

export interface HolidayQueryResult {
  holidays: Holiday[];
  totalCount: number;
  queryType: string;
  message: string;
}

/**
 * Get holidays for current year (this would be enhanced with actual date calculations)
 */
export function getCurrentYearHolidays(): Holiday[] {
  return getPublicHolidays();
}

/**
 * Find holidays by various criteria
 */
export function findHolidays(criteria: {
  type?: Holiday['type'];
  month?: number;
  search?: string;
  publicOnly?: boolean;
  region?: string;
}): HolidayQueryResult {
  let results = indonesianHolidays;
  let queryType = 'all holidays';
  let message = 'Found all Indonesian holidays';

  // Filter by type
  if (criteria.type) {
    results = results.filter(h => h.type === criteria.type);
    queryType = `${criteria.type} holidays`;
    message = `Found ${criteria.type} holidays in Indonesia`;
  }

  // Filter by month
  if (criteria.month) {
    const monthHolidays = results.filter(holiday => {
      if (holiday.category === 'fixed') {
        const [monthStr] = holiday.date.split('-');
        return parseInt(monthStr) === criteria.month;
      }
      return false;
    });
    results = monthHolidays;
    const monthNames = [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    queryType = `holidays in ${monthNames[criteria.month]}`;
    message = `Found holidays in ${monthNames[criteria.month]}`;
  }

  // Filter by search term
  if (criteria.search) {
    results = searchHolidays(criteria.search);
    queryType = `holidays matching "${criteria.search}"`;
    message = `Found holidays matching "${criteria.search}"`;
  }

  // Filter by public holidays only
  if (criteria.publicOnly) {
    results = results.filter(h => h.isPublicHoliday);
    queryType += ' (public holidays only)';
    message += ' (public holidays only)';
  }

  // Filter by region
  if (criteria.region) {
    results = results.filter(h => 
      !h.regions || h.regions.some(r => 
        r.toLowerCase().includes(criteria.region!.toLowerCase())
      )
    );
    queryType += ` in ${criteria.region}`;
    message += ` in ${criteria.region}`;
  }

  return {
    holidays: results,
    totalCount: results.length,
    queryType,
    message: `${message}. Total: ${results.length} holidays.`
  };
}

/**
 * Get detailed information about a specific holiday
 */
export function getHolidayDetails(identifier: string): Holiday | null {
  // Try to find by ID first
  let holiday = getHolidayById(identifier);
  
  // If not found, try searching by name
  if (!holiday) {
    const searchResults = searchHolidays(identifier);
    if (searchResults.length > 0) {
      holiday = searchResults[0]; // Return the first match
    }
  }

  return holiday || null;
}

/**
 * Get upcoming holidays (this would need actual date calculation in real implementation)
 */
export function getUpcomingHolidays(limit: number = 5): Holiday[] {
  // For now, return public holidays (in real implementation, this would calculate actual upcoming dates)
  return getPublicHolidays().slice(0, limit);
}

/**
 * Check if a given date string matches any holiday
 */
export function isHoliday(dateString: string): { isHoliday: boolean; holiday?: Holiday } {
  // Simple check for fixed dates (MM-DD format)
  const [year, month, day] = dateString.split('-');
  const monthDay = `${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  
  const holiday = indonesianHolidays.find(h => 
    h.category === 'fixed' && h.date === monthDay
  );

  return {
    isHoliday: !!holiday,
    holiday
  };
}

/**
 * Get holiday statistics
 */
export function getHolidayStats() {
  const stats = {
    total: indonesianHolidays.length,
    publicHolidays: getPublicHolidays().length,
    byType: {
      national: getHolidaysByType('national').length,
      religious: getHolidaysByType('religious').length,
      cultural: getHolidaysByType('cultural').length,
      regional: getHolidaysByType('regional').length,
    },
    byCategory: {
      fixed: indonesianHolidays.filter(h => h.category === 'fixed').length,
      lunar: indonesianHolidays.filter(h => h.category === 'lunar').length,
      calculated: indonesianHolidays.filter(h => h.category === 'calculated').length,
    }
  };

  return stats;
}

/**
 * Format holiday information for display
 */
export function formatHolidayInfo(holiday: Holiday): string {
  let info = `**${holiday.name}** (${holiday.nameIndonesian})\n`;
  info += `📅 **Type:** ${holiday.type} | **Category:** ${holiday.category}\n`;
  info += `🏛️ **Public Holiday:** ${holiday.isPublicHoliday ? 'Yes' : 'No'}\n`;
  
  if (holiday.date && holiday.category === 'fixed') {
    const [month, day] = holiday.date.split('-');
    const monthNames = [
      '', 'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    info += `📆 **Date:** ${monthNames[parseInt(month)]} ${parseInt(day)}\n`;
  } else {
    info += `📆 **Date:** Variable (${holiday.category})\n`;
  }

  info += `\n📖 **Description:** ${holiday.description}\n`;
  info += `✨ **Significance:** ${holiday.significance}\n`;

  if (holiday.traditions && holiday.traditions.length > 0) {
    info += `\n🎭 **Traditions:**\n`;
    holiday.traditions.forEach(tradition => {
      info += `• ${tradition}\n`;
    });
  }

  if (holiday.regions && holiday.regions.length > 0) {
    info += `\n🗺️ **Regions:** ${holiday.regions.join(', ')}\n`;
  }

  if (holiday.alternativeNames && holiday.alternativeNames.length > 0) {
    info += `\n🏷️ **Also known as:** ${holiday.alternativeNames.join(', ')}\n`;
  }

  return info;
}

/**
 * Get holiday recommendations based on interests
 */
export function getHolidayRecommendations(interests: string[]): Holiday[] {
  const recommendations: Holiday[] = [];
  
  interests.forEach(interest => {
    const lowerInterest = interest.toLowerCase();
    const matches = indonesianHolidays.filter(holiday => 
      holiday.description.toLowerCase().includes(lowerInterest) ||
      holiday.significance.toLowerCase().includes(lowerInterest) ||
      holiday.traditions?.some(t => t.toLowerCase().includes(lowerInterest)) ||
      holiday.type === lowerInterest
    );
    recommendations.push(...matches);
  });

  // Remove duplicates
  const uniqueRecommendations = recommendations.filter((holiday, index, self) => 
    index === self.findIndex(h => h.id === holiday.id)
  );

  return uniqueRecommendations;
}
