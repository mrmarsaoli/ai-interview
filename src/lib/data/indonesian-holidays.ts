/**
 * Indonesian Holiday Knowledge Base
 * Comprehensive data for Indonesian national and religious holidays
 */

export interface Holiday {
  id: string;
  name: string;
  nameIndonesian: string;
  date: string; // ISO date format or pattern for variable dates
  type: 'national' | 'religious' | 'regional' | 'cultural';
  category: 'fixed' | 'lunar' | 'calculated';
  description: string;
  significance: string;
  traditions?: string[];
  regions?: string[]; // For regional holidays
  isPublicHoliday: boolean;
  alternativeNames?: string[];
}

export const indonesianHolidays: Holiday[] = [
  // Fixed National Holidays
  {
    id: 'new-year',
    name: 'New Year\'s Day',
    nameIndonesian: 'Tahun Baru Masehi',
    date: '01-01', // January 1st
    type: 'national',
    category: 'fixed',
    description: 'Celebration of the beginning of the Gregorian calendar year',
    significance: 'International celebration marking the start of a new year',
    traditions: ['Fireworks', 'Parties', 'Resolutions', 'Family gatherings'],
    isPublicHoliday: true,
  },
  {
    id: 'pancasila-day',
    name: 'Pancasila Day',
    nameIndonesian: 'Hari Pancasila',
    date: '06-01', // June 1st
    type: 'national',
    category: 'fixed',
    description: 'Commemorates the birth of Pancasila, Indonesia\'s state ideology',
    significance: 'Celebrates the five principles that form the foundation of Indonesian state philosophy',
    traditions: ['Flag ceremonies', 'Educational events', 'Government speeches'],
    isPublicHoliday: true,
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    nameIndonesian: 'Hari Kemerdekaan',
    date: '08-17', // August 17th
    type: 'national',
    category: 'fixed',
    description: 'Celebrates Indonesia\'s declaration of independence from Dutch colonial rule in 1945',
    significance: 'Most important national holiday commemorating Indonesian independence',
    traditions: ['Flag ceremonies', 'Panjat pinang', 'Traditional games', 'Parades', 'Red and white decorations'],
    isPublicHoliday: true,
  },

  // Islamic Holidays (Lunar calendar - dates vary each year)
  {
    id: 'eid-fitr',
    name: 'Eid al-Fitr',
    nameIndonesian: 'Idul Fitri / Lebaran',
    date: 'lunar-variable', // 1st of Shawwal
    type: 'religious',
    category: 'lunar',
    description: 'Festival marking the end of Ramadan, the Islamic holy month of fasting',
    significance: 'Most important Islamic celebration in Indonesia, marking spiritual purification',
    traditions: ['Takbiran', 'Sholat Eid', 'Silaturahmi', 'Ketupat', 'THR (holiday allowance)', 'Mudik (homecoming)'],
    isPublicHoliday: true,
    alternativeNames: ['Lebaran', 'Hari Raya Idul Fitri'],
  },
  {
    id: 'eid-adha',
    name: 'Eid al-Adha',
    nameIndonesian: 'Idul Adha',
    date: 'lunar-variable', // 10th of Dhul Hijjah
    type: 'religious',
    category: 'lunar',
    description: 'Festival of Sacrifice commemorating Abraham\'s willingness to sacrifice his son',
    significance: 'Celebrates obedience to God and marks the end of Hajj pilgrimage',
    traditions: ['Qurban (animal sacrifice)', 'Distribution of meat to the poor', 'Special prayers'],
    isPublicHoliday: true,
    alternativeNames: ['Hari Raya Idul Adha', 'Hari Raya Haji'],
  },
  {
    id: 'islamic-new-year',
    name: 'Islamic New Year',
    nameIndonesian: 'Tahun Baru Hijriyah',
    date: 'lunar-variable', // 1st of Muharram
    type: 'religious',
    category: 'lunar',
    description: 'First day of the Islamic lunar calendar',
    significance: 'Marks the beginning of the Islamic year and the Prophet\'s migration to Medina',
    traditions: ['Religious gatherings', 'Quran recitation', 'Reflection and prayer'],
    isPublicHoliday: true,
    alternativeNames: ['Muharram', '1 Muharram'],
  },
  {
    id: 'mawlid',
    name: 'Mawlid an-Nabi',
    nameIndonesian: 'Maulid Nabi Muhammad SAW',
    date: 'lunar-variable', // 12th of Rabi\' al-awwal
    type: 'religious',
    category: 'lunar',
    description: 'Celebrates the birth of Prophet Muhammad',
    significance: 'Honors the Prophet Muhammad and his teachings',
    traditions: ['Sholawat recitation', 'Religious processions', 'Charity', 'Religious lectures'],
    isPublicHoliday: true,
    alternativeNames: ['Maulud', 'Milad un Nabi'],
  },
  {
    id: 'isra-miraj',
    name: 'Isra and Mi\'raj',
    nameIndonesian: 'Isra Mi\'raj',
    date: 'lunar-variable', // 27th of Rajab
    type: 'religious',
    category: 'lunar',
    description: 'Commemorates the Prophet Muhammad\'s night journey to Jerusalem and ascension to heaven',
    significance: 'Celebrates the miraculous journey of Prophet Muhammad and the establishment of daily prayers',
    traditions: ['Special prayers', 'Religious lectures', 'Mosque gatherings', 'Reflection'],
    isPublicHoliday: true,
    alternativeNames: ['Lailatul Mi\'raj'],
  },

  // Christian Holidays
  {
    id: 'good-friday',
    name: 'Good Friday',
    nameIndonesian: 'Jumat Agung',
    date: 'easter-calculated', // Friday before Easter Sunday
    type: 'religious',
    category: 'calculated',
    description: 'Commemorates the crucifixion of Jesus Christ',
    significance: 'Important Christian observance of Jesus Christ\'s sacrifice',
    traditions: ['Church services', 'Prayer', 'Fasting', 'Stations of the Cross'],
    isPublicHoliday: true,
  },
  {
    id: 'christmas',
    name: 'Christmas Day',
    nameIndonesian: 'Hari Raya Natal',
    date: '12-25', // December 25th
    type: 'religious',
    category: 'fixed',
    description: 'Celebrates the birth of Jesus Christ',
    significance: 'Most important Christian celebration',
    traditions: ['Church services', 'Family gatherings', 'Gift giving', 'Christmas trees', 'Nativity scenes'],
    isPublicHoliday: true,
  },
  {
    id: 'ascension-day',
    name: 'Ascension Day',
    nameIndonesian: 'Kenaikan Isa Al Masih',
    date: 'easter-calculated', // 39 days after Easter Sunday
    type: 'religious',
    category: 'calculated',
    description: 'Commemorates the ascension of Jesus Christ to heaven',
    significance: 'Celebrates Jesus Christ\'s ascension 40 days after his resurrection',
    traditions: ['Church services', 'Prayer', 'Religious reflection'],
    isPublicHoliday: true,
  },

  // Buddhist and Hindu Holidays
  {
    id: 'vesak',
    name: 'Vesak Day',
    nameIndonesian: 'Hari Raya Waisak',
    date: 'lunar-variable', // Full moon day in May (Vesakha month)
    type: 'religious',
    category: 'lunar',
    description: 'Celebrates the birth, enlightenment, and death of Buddha',
    significance: 'Most important Buddhist celebration commemorating Buddha\'s life',
    traditions: ['Temple visits', 'Meditation', 'Charity', 'Lantern lighting', 'Borobudur ceremonies'],
    isPublicHoliday: true,
    alternativeNames: ['Buddha\'s Birthday', 'Waisak'],
  },
  {
    id: 'nyepi',
    name: 'Nyepi (Balinese New Year)',
    nameIndonesian: 'Hari Raya Nyepi',
    date: 'lunar-variable', // Day after new moon in March/April
    type: 'religious',
    category: 'lunar',
    description: 'Balinese Hindu New Year and Day of Silence',
    significance: 'Marks the Balinese New Year with a day of silence, fasting, and meditation',
    traditions: ['Complete silence', 'No work', 'No travel', 'Meditation', 'Ogoh-ogoh parades (day before)'],
    regions: ['Bali'],
    isPublicHoliday: true,
    alternativeNames: ['Day of Silence', 'Saka New Year'],
  },

  // Regional and Cultural Holidays
  {
    id: 'chinese-new-year',
    name: 'Chinese New Year',
    nameIndonesian: 'Tahun Baru Imlek',
    date: 'lunar-variable', // First day of Chinese lunar calendar
    type: 'cultural',
    category: 'lunar',
    description: 'Traditional Chinese New Year celebration',
    significance: 'Important celebration for Indonesian Chinese community',
    traditions: ['Lion dances', 'Red decorations', 'Family reunions', 'Angpao (red envelopes)', 'Fireworks'],
    isPublicHoliday: true,
    alternativeNames: ['Imlek', 'Lunar New Year', 'Spring Festival'],
  },

  // Additional National Commemorative Days (not always public holidays)
  {
    id: 'kartini-day',
    name: 'Kartini Day',
    nameIndonesian: 'Hari Kartini',
    date: '04-21', // April 21st
    type: 'national',
    category: 'fixed',
    description: 'Honors R.A. Kartini, pioneer of women\'s rights and education in Indonesia',
    significance: 'Celebrates women\'s emancipation and gender equality',
    traditions: ['Wearing kebaya', 'Educational events', 'Women\'s rights discussions'],
    isPublicHoliday: false,
  },
  {
    id: 'education-day',
    name: 'National Education Day',
    nameIndonesian: 'Hari Pendidikan Nasional',
    date: '05-02', // May 2nd
    type: 'national',
    category: 'fixed',
    description: 'Commemorates Ki Hajar Dewantara, the father of Indonesian education',
    significance: 'Honors the importance of education and educational reform',
    traditions: ['School ceremonies', 'Educational exhibitions', 'Teacher appreciation'],
    isPublicHoliday: false,
  },
  {
    id: 'heroes-day',
    name: 'Heroes\' Day',
    nameIndonesian: 'Hari Pahlawan',
    date: '11-10', // November 10th
    type: 'national',
    category: 'fixed',
    description: 'Commemorates the Battle of Surabaya and honors Indonesian heroes',
    significance: 'Remembers those who fought for Indonesian independence',
    traditions: ['Flag ceremonies', 'Visiting war memorials', 'Moment of silence'],
    isPublicHoliday: false,
  },
  {
    id: 'youth-pledge-day',
    name: 'Youth Pledge Day',
    nameIndonesian: 'Hari Sumpah Pemuda',
    date: '10-28', // October 28th
    type: 'national',
    category: 'fixed',
    description: 'Commemorates the 1928 Youth Pledge that helped unite Indonesia',
    significance: 'Celebrates Indonesian unity and the role of youth in independence',
    traditions: ['Youth gatherings', 'Reciting the Youth Pledge', 'Cultural events'],
    isPublicHoliday: false,
  },
];

// Helper functions for holiday calculations
export function getHolidaysByType(type: Holiday['type']): Holiday[] {
  return indonesianHolidays.filter(holiday => holiday.type === type);
}

export function getPublicHolidays(): Holiday[] {
  return indonesianHolidays.filter(holiday => holiday.isPublicHoliday);
}

export function getHolidaysByMonth(month: number): Holiday[] {
  return indonesianHolidays.filter(holiday => {
    if (holiday.category === 'fixed') {
      const [monthStr] = holiday.date.split('-');
      return parseInt(monthStr) === month;
    }
    return false; // Variable dates need special handling
  });
}

export function searchHolidays(query: string): Holiday[] {
  const lowerQuery = query.toLowerCase();
  return indonesianHolidays.filter(holiday => 
    holiday.name.toLowerCase().includes(lowerQuery) ||
    holiday.nameIndonesian.toLowerCase().includes(lowerQuery) ||
    holiday.description.toLowerCase().includes(lowerQuery) ||
    holiday.significance.toLowerCase().includes(lowerQuery) ||
    holiday.alternativeNames?.some(name => name.toLowerCase().includes(lowerQuery))
  );
}

export function getHolidayById(id: string): Holiday | undefined {
  return indonesianHolidays.find(holiday => holiday.id === id);
}

// Holiday date calculation helpers (for tool calling implementation)
export const holidayCalculationNotes = {
  lunarHolidays: [
    'Islamic holidays follow the Hijri calendar and dates shift ~11 days earlier each year',
    'Chinese New Year follows the Chinese lunar calendar',
    'Vesak Day is on the full moon day of the fourth lunar month',
    'Nyepi follows the Balinese Saka calendar'
  ],
  calculatedHolidays: [
    'Good Friday is the Friday before Easter Sunday',
    'Ascension Day is 39 days after Easter Sunday',
    'Easter calculation follows the Western Christian calendar'
  ],
  regionalVariations: [
    'Nyepi is primarily celebrated in Bali',
    'Some regions may have additional local holidays',
    'Holiday observance may vary by region and religious community'
  ]
};
