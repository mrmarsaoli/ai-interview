"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessagePart } from "ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
	MessageCircle,
	Send,
	Calendar,
	Clock,
	MapPin,
	Star,
	Info,
	Loader2,
	ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function ChatPage() {
	const [input, setInput] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);

	// AI SDK v5 - useChat with DefaultChatTransport
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	});

	// Simple loading state - check if last message is from user without a response
	const isLoading =
		messages.length > 0 &&
		messages[messages.length - 1]?.role === "user" &&
		!messages.some(
			(m) =>
				m.role === "assistant" &&
				messages.findIndex((msg) => msg.id === m.id) >
					messages.findIndex(
						(msg) => msg.id === messages[messages.length - 1]?.id
					)
		);

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim() && !isLoading) {
			// AI SDK v5 - Use sendMessage with text property
			sendMessage({ text: input.trim() });
			setInput("");
		}
	};

	const suggestedQuestions = [
		"What are the main religious holidays in Indonesia?",
		"Show me statistics about Indonesian holidays",
		"Search for Islamic holidays in Indonesia",
		"What holidays are celebrated in Bali?",
	];

	const renderToolResult = (part: any) => {
		if (part.type.startsWith("tool-")) {
			const toolName = part.type.replace("tool-", "");

			switch (toolName) {
				case "getHolidayInfo":
					if (part.state === "output-available" && part.output.success) {
						const holiday = part.output.holiday;
						return (
							<Card className="mt-2 border-l-4 border-l-blue-500">
								<CardHeader className="pb-2">
									<div className="flex items-start justify-between">
										<div>
											<CardTitle className="text-lg">
												{holiday.name}
											</CardTitle>
											<p className="text-sm text-muted-foreground">
												{holiday.nameIndonesian}
											</p>
										</div>
										<Badge
											variant={
												holiday.type === "national"
													? "default"
													: holiday.type === "religious"
													? "secondary"
													: "outline"
											}
										>
											{holiday.type}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Calendar className="w-4 h-4" />
										<span>{holiday.date}</span>
										{holiday.isPublicHoliday && (
											<>
												<span>•</span>
												<Badge variant="outline" className="h-5">
													Public Holiday
												</Badge>
											</>
										)}
									</div>

									<div>
										<h4 className="font-medium text-sm mb-1">
											Description
										</h4>
										<p className="text-sm text-muted-foreground">
											{holiday.description}
										</p>
									</div>

									<div>
										<h4 className="font-medium text-sm mb-1">
											Significance
										</h4>
										<p className="text-sm text-muted-foreground">
											{holiday.significance}
										</p>
									</div>

									{holiday.traditions.length > 0 && (
										<div>
											<h4 className="font-medium text-sm mb-2">
												Traditions
											</h4>
											<div className="flex flex-wrap gap-1">
												{holiday.traditions.map(
													(tradition: string, idx: number) => (
														<Badge
															key={idx}
															variant="outline"
															className="text-xs"
														>
															{tradition}
														</Badge>
													)
												)}
											</div>
										</div>
									)}

									{holiday.alternativeNames.length > 0 && (
										<div className="text-xs text-muted-foreground">
											<strong>Also known as:</strong>{" "}
											{holiday.alternativeNames.join(", ")}
										</div>
									)}
								</CardContent>
							</Card>
						);
					}
					break;

				case "searchHolidays":
					if (part.state === "output-available" && part.output.success) {
						return (
							<Card className="mt-2 border-l-4 border-l-green-500">
								<CardHeader className="pb-2">
									<CardTitle className="text-lg flex items-center gap-2">
										<Calendar className="w-5 h-5" />
										Search Results
									</CardTitle>
									<p className="text-sm text-muted-foreground">
										Found {part.output.count} holidays for "
										{part.output.query}"
									</p>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										{part.output.holidays.map(
											(holiday: any, idx: number) => (
												<div
													key={idx}
													className="p-2 rounded-lg bg-muted/50"
												>
													<div className="flex items-start justify-between mb-1">
														<h4 className="font-medium text-sm">
															{holiday.name}
														</h4>
														<Badge
															variant="outline"
															className="text-xs"
														>
															{holiday.type}
														</Badge>
													</div>
													<p className="text-xs text-muted-foreground mb-1">
														{holiday.nameIndonesian}
													</p>
													<p className="text-xs text-muted-foreground">
														{holiday.description.substring(
															0,
															100
														)}
														...
													</p>
													{holiday.isPublicHoliday && (
														<Badge
															variant="outline"
															className="mt-1 h-4 text-xs"
														>
															Public Holiday
														</Badge>
													)}
												</div>
											)
										)}
									</div>
								</CardContent>
							</Card>
						);
					}
					break;

				case "getHolidaysByType":
					if (part.state === "output-available" && part.output.success) {
						const typeColors = {
							national: "border-l-blue-500",
							religious: "border-l-purple-500",
							regional: "border-l-orange-500",
							cultural: "border-l-green-500",
						};
						return (
							<Card
								className={`mt-2 border-l-4 ${
									typeColors[
										part.output.type as keyof typeof typeColors
									]
								}`}
							>
								<CardHeader className="pb-2">
									<CardTitle className="text-lg capitalize">
										{part.output.type} Holidays ({part.output.count})
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid gap-2">
										{part.output.holidays.map(
											(holiday: any, idx: number) => (
												<div
													key={idx}
													className="p-2 rounded-lg bg-muted/50"
												>
													<div className="flex items-start justify-between">
														<div>
															<h4 className="font-medium text-sm">
																{holiday.name}
															</h4>
															<p className="text-xs text-muted-foreground">
																{holiday.nameIndonesian}
															</p>
														</div>
														<div className="text-right">
															<div className="text-xs text-muted-foreground">
																{holiday.date}
															</div>
															{holiday.isPublicHoliday && (
																<Badge
																	variant="outline"
																	className="h-4 text-xs mt-1"
																>
																	Public
																</Badge>
															)}
														</div>
													</div>
												</div>
											)
										)}
									</div>
								</CardContent>
							</Card>
						);
					}
					break;

				case "getHolidayStats":
					if (part.state === "output-available" && part.output.success) {
						const stats = part.output.statistics;
						return (
							<Card className="mt-2 border-l-4 border-l-purple-500">
								<CardHeader className="pb-2">
									<CardTitle className="text-lg flex items-center gap-2">
										<Star className="w-5 h-5" />
										Holiday Statistics
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="grid grid-cols-2 gap-4 mb-4">
										<div className="text-center p-3 rounded-lg bg-muted/50">
											<div className="text-2xl font-bold text-blue-600">
												{stats.total}
											</div>
											<div className="text-xs text-muted-foreground">
												Total Holidays
											</div>
										</div>
										<div className="text-center p-3 rounded-lg bg-muted/50">
											<div className="text-2xl font-bold text-green-600">
												{stats.publicHolidays}
											</div>
											<div className="text-xs text-muted-foreground">
												Public Holidays
											</div>
										</div>
									</div>

									<div className="space-y-2">
										<h4 className="font-medium text-sm">By Type</h4>
										<div className="grid grid-cols-2 gap-2">
											{Object.entries(stats.byType).map(
												([type, count]) => (
													<div
														key={type}
														className="flex justify-between items-center p-2 rounded bg-muted/30"
													>
														<span className="text-sm capitalize">
															{type}
														</span>
														<Badge variant="outline">
															{count as number}
														</Badge>
													</div>
												)
											)}
										</div>
									</div>

									{part.output.breakdown && (
										<div className="mt-4 pt-4 border-t">
											<h4 className="font-medium text-sm mb-2">
												Public Holidays
											</h4>
											<div className="space-y-1">
												{part.output.breakdown.publicHolidays.map(
													(holiday: any, idx: number) => (
														<div
															key={idx}
															className="flex items-center justify-between text-xs"
														>
															<span>{holiday.name}</span>
															<Badge
																variant="outline"
																className="h-4"
															>
																{holiday.type}
															</Badge>
														</div>
													)
												)}
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						);
					}
					break;
			}

			// Handle tool execution states
			if (
				part.state === "input-streaming" ||
				part.state === "input-available"
			) {
				return (
					<div className="mt-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
						<div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Searching Indonesian holidays...</span>
						</div>
					</div>
				);
			}

			if (part.state === "output-error") {
				return (
					<div className="mt-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
						<div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
							<Info className="w-4 h-4" />
							<span>Error: {part.errorText}</span>
						</div>
					</div>
				);
			}
		}

		return null;
	};

	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
				<div className="flex items-center justify-between p-4">
					<div className="flex items-center gap-3">
						<Link href="/">
							<Button variant="ghost" size="icon" className="h-8 w-8">
								<ArrowLeft className="h-4 w-4" />
							</Button>
						</Link>
						<div className="flex items-center gap-2">
							<MessageCircle className="w-5 h-5 text-blue-600" />
							<h1 className="font-semibold">
								Indonesian Holiday Assistant
							</h1>
						</div>
					</div>
					<Badge variant="outline" className="hidden sm:flex">
						AI SDK v5
					</Badge>
				</div>
			</div>

			{/* Chat Container */}
			<div className="container mx-auto max-w-4xl h-[calc(100vh-73px)] flex flex-col">
				{/* Messages Area */}
				<ScrollArea className="flex-1 p-4" ref={scrollRef}>
					{messages.length === 0 ? (
						<div className="text-center py-8">
							<Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
							<h2 className="text-xl font-semibold mb-2">
								Welcome to Indonesian Holiday Assistant
							</h2>
							<p className="text-muted-foreground mb-6">
								Ask me about Indonesian holidays, traditions, and
								cultural celebrations!
							</p>

							<div className="space-y-2">
								<p className="text-sm font-medium text-muted-foreground">
									Try asking:
								</p>
								<div className="grid gap-2 max-w-md mx-auto">
									{suggestedQuestions.map((question, idx) => (
										<Button
											key={idx}
											variant="outline"
											size="sm"
											className="text-left justify-start h-auto whitespace-normal p-3"
											onClick={() => setInput(question)}
										>
											"{question}"
										</Button>
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4 pb-4">
							{messages.map((message) => (
								<div
									key={message.id}
									className={`flex ${
										message.role === "user"
											? "justify-end"
											: "justify-start"
									}`}
								>
									<div
										className={`max-w-[80%] ${
											message.role === "user"
												? "bg-blue-600 text-white rounded-l-2xl rounded-tr-2xl rounded-br-md"
												: "bg-muted rounded-r-2xl rounded-tl-2xl rounded-bl-md"
										} p-4`}
									>
										{message.parts.map((part, partIndex) => {
											if (part.type === "text") {
												return (
													<div
														key={partIndex}
														className="whitespace-pre-wrap text-sm"
													>
														{part.text}
													</div>
												);
											}

											return (
												<div key={partIndex}>
													{renderToolResult(part)}
												</div>
											);
										})}
									</div>
								</div>
							))}

							{isLoading && (
								<div className="flex justify-start">
									<div className="bg-muted rounded-r-2xl rounded-tl-2xl rounded-bl-md p-4">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Loader2 className="w-4 h-4 animate-spin" />
											<span>Thinking...</span>
										</div>
									</div>
								</div>
							)}
						</div>
					)}
				</ScrollArea>

				{/* Input Area */}
				<div className="border-t p-4">
					<form onSubmit={handleSubmit} className="flex gap-2">
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask about Indonesian holidays..."
							disabled={isLoading}
							className="flex-1"
						/>
						<Button type="submit" disabled={isLoading || !input.trim()}>
							{isLoading ? (
								<Loader2 className="w-4 h-4 animate-spin" />
							) : (
								<Send className="w-4 h-4" />
							)}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
