import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { streamText, convertToModelMessages, tool } from "ai";
import { z } from "zod";
import { 
  indonesianHolidays, 
  getHolidayById, 
  getHolidaysByType, 
  getPublicHolidays,
  searchHolidays,
  Holiday
} from "@/lib/data/indonesian-holidays";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
});

// AI SDK v5 - Indonesian Holiday Tools
const getHolidayInfoTool = tool({
  description: 'Get detailed information about a specific Indonesian holiday by ID or name',
  inputSchema: z.object({
    identifier: z.string().describe('Holiday ID or name to search for')
  }),
  execute: async ({ identifier }) => {
    // Try to find by ID first
    let holiday = getHolidayById(identifier);
    
    // If not found by ID, search by name
    if (!holiday) {
      const searchResults = searchHolidays(identifier);
      holiday = searchResults[0]; // Take the first match
    }

    if (!holiday) {
      return {
        success: false,
        message: `Holiday "${identifier}" not found. Try searching for Indonesian holidays like "Independence Day", "Eid", "Christmas", etc.`
      };
    }

    return {
      success: true,
      holiday: {
        id: holiday.id,
        name: holiday.name,
        nameIndonesian: holiday.nameIndonesian,
        date: holiday.date,
        type: holiday.type,
        category: holiday.category,
        description: holiday.description,
        significance: holiday.significance,
        traditions: holiday.traditions || [],
        isPublicHoliday: holiday.isPublicHoliday,
        alternativeNames: holiday.alternativeNames || [],
        regions: holiday.regions || []
      }
    };
  }
});

const searchHolidaysTool = tool({
  description: 'Search Indonesian holidays by name, description, or keywords',
  inputSchema: z.object({
    query: z.string().describe('Search query for holidays (e.g., "Christmas", "Islamic", "national")')
  }),
  execute: async ({ query }) => {
    const results = searchHolidays(query);
    
    if (results.length === 0) {
      return {
        success: false,
        message: `No holidays found matching "${query}". Try terms like "national", "religious", "Islamic", "Christian", "independence", etc.`
      };
    }

    return {
      success: true,
      query,
      count: results.length,
      holidays: results.slice(0, 10).map(h => ({
        id: h.id,
        name: h.name,
        nameIndonesian: h.nameIndonesian,
        type: h.type,
        description: h.description,
        isPublicHoliday: h.isPublicHoliday
      }))
    };
  }
});

const getHolidaysByTypeTool = tool({
  description: 'Get Indonesian holidays filtered by type (national, religious, regional, cultural)',
  inputSchema: z.object({
    type: z.enum(['national', 'religious', 'regional', 'cultural']).describe('Type of holidays to retrieve')
  }),
  execute: async ({ type }) => {
    const holidays = getHolidaysByType(type);
    
    return {
      success: true,
      type,
      count: holidays.length,
      holidays: holidays.map(h => ({
        id: h.id,
        name: h.name,
        nameIndonesian: h.nameIndonesian,
        description: h.description,
        isPublicHoliday: h.isPublicHoliday,
        date: h.date
      }))
    };
  }
});

const getHolidayStatsTool = tool({
  description: 'Get statistics and overview of Indonesian holidays',
  inputSchema: z.object({
    includeBreakdown: z.boolean().optional().describe('Whether to include detailed breakdown by type')
  }),
  execute: async ({ includeBreakdown = false }) => {
    const publicHolidays = getPublicHolidays();
    const byType = {
      national: getHolidaysByType('national'),
      religious: getHolidaysByType('religious'),
      regional: getHolidaysByType('regional'),
      cultural: getHolidaysByType('cultural')
    };

    const stats = {
      total: indonesianHolidays.length,
      publicHolidays: publicHolidays.length,
      nonPublicHolidays: indonesianHolidays.length - publicHolidays.length,
      byType: {
        national: byType.national.length,
        religious: byType.religious.length,
        regional: byType.regional.length,
        cultural: byType.cultural.length
      }
    };

    type StatsResult = {
      success: true;
      statistics: typeof stats;
      breakdown?: {
        publicHolidays: Array<{
          name: string;
          nameIndonesian: string;
          type: Holiday['type'];
        }>;
        byType: {
          national: string[];
          religious: string[];
          regional: string[];
          cultural: string[];
        };
      };
    };

    const result: StatsResult = {
      success: true,
      statistics: stats
    };

    if (includeBreakdown) {
      result.breakdown = {
        publicHolidays: publicHolidays.map(h => ({
          name: h.name,
          nameIndonesian: h.nameIndonesian,
          type: h.type
        })),
        byType: {
          national: byType.national.map(h => h.name),
          religious: byType.religious.map(h => h.name),
          regional: byType.regional.map(h => h.name),
          cultural: byType.cultural.map(h => h.name)
        }
      };
    }

    return result;
  }
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { messages } = body;

		// AI SDK v5 - Convert UI messages to model messages
		const modelMessages = convertToModelMessages(messages);

		const result = streamText({
			model: openrouter("gpt-4o-mini"),
			messages: modelMessages,
			temperature: 0.7,
			tools: {
				getHolidayInfo: getHolidayInfoTool,
				searchHolidays: searchHolidaysTool,
				getHolidaysByType: getHolidaysByTypeTool,
				getHolidayStats: getHolidayStatsTool,
			},
			system: `You are a helpful assistant with expertise in Indonesian culture and holidays. You have access to comprehensive information about Indonesian holidays including national, religious, regional, and cultural celebrations.

When users ask about Indonesian holidays, use the available tools to provide accurate and detailed information. You can:

1. Get specific holiday information by name or ID
2. Search for holidays by keywords
3. Filter holidays by type (national, religious, regional, cultural)  
4. Provide statistics and overviews

Present the information in a clear, engaging way. When showing holiday details, include:
- Both English and Indonesian names
- Significance and cultural importance
- Traditional celebrations and customs
- Whether it's a public holiday

Feel free to share interesting cultural context and explain the importance of these celebrations in Indonesian society.`,
		});

		// AI SDK v5 - Use toUIMessageStreamResponse instead of toTextStreamResponse
		return result.toUIMessageStreamResponse();
	} catch (error) {
		console.error("Error in chat API:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
