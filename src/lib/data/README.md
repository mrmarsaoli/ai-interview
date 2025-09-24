# Indonesian Holiday Knowledge Base

This directory contains a comprehensive knowledge base for Indonesian holidays that can be used for AI tool calling functionality.

## Files

### `indonesian-holidays.ts`
- **Comprehensive holiday data**: 20+ Indonesian holidays including national, religious, cultural, and regional celebrations
- **Structured data format**: Each holiday includes name, Indonesian name, date, type, description, significance, and traditions
- **Helper functions**: Built-in functions for filtering, searching, and categorizing holidays
- **Multiple calendar systems**: Supports fixed dates, lunar calendar holidays, and calculated dates

### `../utils/holiday-utils.ts`
- **Query functions**: Advanced search and filtering capabilities
- **Formatting utilities**: Functions to format holiday information for display
- **Statistics**: Holiday statistics and analytics
- **Recommendations**: Smart holiday recommendations based on user interests

## Holiday Types Covered

### National Holidays
- New Year's Day (Tahun Baru Masehi)
- Pancasila Day (Hari Pancasila)
- Independence Day (Hari Kemerdekaan)
- Heroes' Day (Hari Pahlawan)
- Youth Pledge Day (Hari Sumpah Pemuda)
- Kartini Day (Hari Kartini)
- National Education Day (Hari Pendidikan Nasional)

### Religious Holidays

#### Islamic Holidays
- Eid al-Fitr (Idul Fitri/Lebaran)
- Eid al-Adha (Idul Adha)
- Islamic New Year (Tahun Baru Hijriyah)
- Mawlid an-Nabi (Maulid Nabi Muhammad SAW)
- Isra and Mi'raj (Isra Mi'raj)

#### Christian Holidays
- Good Friday (Jumat Agung)
- Christmas Day (Hari Raya Natal)
- Ascension Day (Kenaikan Isa Al Masih)

#### Buddhist/Hindu Holidays
- Vesak Day (Hari Raya Waisak)
- Nyepi - Balinese New Year (Hari Raya Nyepi)

### Cultural Holidays
- Chinese New Year (Tahun Baru Imlek)

## Tool Calling Integration

This knowledge base is designed to support AI tool calling with the following capabilities:

### Potential Tool Functions

1. **`getHolidayInfo(holidayName: string)`**
   - Get detailed information about a specific holiday
   - Returns: name, date, description, traditions, significance

2. **`searchHolidays(query: string)`**
   - Search holidays by name, description, or traditions
   - Returns: array of matching holidays

3. **`getHolidaysByMonth(month: number)`**
   - Get all holidays in a specific month
   - Returns: array of holidays for that month

4. **`getHolidaysByType(type: 'national' | 'religious' | 'cultural' | 'regional')`**
   - Filter holidays by type
   - Returns: array of holidays of specified type

5. **`getUpcomingHolidays(limit?: number)`**
   - Get upcoming holidays (would need date calculation)
   - Returns: array of upcoming holidays

6. **`isPublicHoliday(date: string)`**
   - Check if a specific date is a public holiday
   - Returns: boolean and holiday information if applicable

7. **`getHolidayTraditions(holidayName: string)`**
   - Get traditional practices for a specific holiday
   - Returns: array of traditions and customs

8. **`getHolidaysByRegion(region: string)`**
   - Get holidays specific to a region (e.g., Bali for Nyepi)
   - Returns: array of regional holidays

## Usage Examples

### Basic Query
```typescript
import { searchHolidays, formatHolidayInfo } from '../utils/holiday-utils';

// Search for Lebaran
const results = searchHolidays('lebaran');
console.log(formatHolidayInfo(results[0]));
```

### Advanced Filtering
```typescript
import { findHolidays } from '../utils/holiday-utils';

// Get all religious public holidays
const religiousHolidays = findHolidays({
  type: 'religious',
  publicOnly: true
});
```

### Holiday Details
```typescript
import { getHolidayDetails } from '../utils/holiday-utils';

// Get detailed information about Independence Day
const independenceDay = getHolidayDetails('independence-day');
```

## Data Structure

Each holiday entry includes:

```typescript
interface Holiday {
  id: string;                    // Unique identifier
  name: string;                  // English name
  nameIndonesian: string;        // Indonesian name
  date: string;                  // Date or pattern
  type: 'national' | 'religious' | 'regional' | 'cultural';
  category: 'fixed' | 'lunar' | 'calculated';
  description: string;           // Holiday description
  significance: string;          // Cultural/religious significance
  traditions?: string[];        // Traditional practices
  regions?: string[];           // Specific regions (if applicable)
  isPublicHoliday: boolean;     // Whether it's an official public holiday
  alternativeNames?: string[];   // Other names for the holiday
}
```

## Future Enhancements

1. **Date Calculations**: Add actual date calculations for lunar and calculated holidays
2. **Regional Variations**: Expand regional holiday coverage
3. **Historical Context**: Add historical background for each holiday
4. **Multilingual Support**: Add support for regional languages
5. **Holiday Calendar Integration**: Generate calendar events
6. **Custom Holidays**: Allow users to add personal or local holidays

This knowledge base provides a solid foundation for implementing Indonesian holiday-related tool calling functionality in the chat application.
