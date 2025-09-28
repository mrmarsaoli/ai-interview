import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Sessions table (improved from conversations)
export const sessions = sqliteTable(
	"sessions",
	{
		// Stable string identifier (UUID v4 recommended)
		id: text("id").primaryKey(),

		// Short title for listing sessions in sidebar
		title: text("title").notNull(),

		// Timestamps for session management
		createdAt: integer("created_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.notNull(),

		lastActiveAt: integer("last_active_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.notNull(),
	},
	(table) => ({
		// Index for efficient sidebar queries (most recent first)
		lastActiveAtIdx: index("sessions_last_active_at_idx").on(
			table.lastActiveAt
		),

		// Index for efficient session lookups by creation time
		createdAtIdx: index("sessions_created_at_idx").on(table.createdAt),
	})
);

// Messages table with improved ordering and constraints
export const messages = sqliteTable(
	"messages",
	{
		// Stable string identifier (UUID v4 recommended)
		id: text("id").primaryKey(),

		// Foreign key to sessions with cascade delete
		sessionId: text("session_id")
			.references(() => sessions.id, { onDelete: "cascade" })
			.notNull(),

		// Role with correct enum values as per requirements
		role: text("role", { enum: ["human", "ai"] }).notNull(),

		// Message content
		content: text("content").notNull(),

		// Explicit ordering field for deterministic message order
		// This ensures reliable ordering even when timestamps are identical
		orderIndex: integer("order_index").notNull(),

		// Timestamp for when message was inserted
		createdAt: integer("created_at", { mode: "timestamp" })
			.$defaultFn(() => new Date())
			.notNull(),

		// Future extensions for streaming support
		isComplete: integer("is_complete", { mode: "boolean" })
			.$defaultFn(() => true)
			.notNull(),

		// For streaming: sequence number for message chunks
		streamSequence: integer("stream_sequence").$defaultFn(() => 0),
	},
	(table) => ({
		// Primary compound index for efficient message retrieval in order
		sessionOrderIdx: index("messages_session_order_idx").on(
			table.sessionId,
			table.orderIndex
		),

		// Index for timestamp-based queries (fallback ordering)
		sessionTimeIdx: index("messages_session_time_idx").on(
			table.sessionId,
			table.createdAt
		),

		// Index for role-based filtering (e.g., last AI message)
		sessionRoleIdx: index("messages_session_role_idx").on(
			table.sessionId,
			table.role
		),
	})
);

// TypeScript types for better type safety
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

// Utility type for sessions with last message info (constructed via joins)
export type SessionWithLastMessage = Session & {
	lastMessage?: {
		content: string;
		role: "human" | "ai";
		createdAt: Date;
	};
};

// Utility types for API responses
export type SessionList = Array<
	Session & {
		lastMessage?: {
			content: string;
			role: "human" | "ai";
			createdAt: Date;
		};
		messageCount?: number;
	}
>;

export type SessionWithMessages = Session & {
	messages: Message[];
};

// Helper functions for generating stable IDs
export const generateSessionId = (): string => {
	// Use crypto.randomUUID() for stable, unique session identifiers
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	// Fallback for environments without crypto.randomUUID
	return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateMessageId = (): string => {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	return `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Constants for query optimization
export const DEFAULT_SESSIONS_LIMIT = 50;
export const DEFAULT_MESSAGES_LIMIT = 100;

// Legacy exports for backward compatibility (remove these after updating all imports)
export const conversations = sessions; // Temporary alias
export type Conversation = Session; // Temporary alias
export type NewConversation = NewSession; // Temporary alias
