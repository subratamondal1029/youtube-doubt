"use client";

import { CHAT_LANGUAGE, MESSAGE_ROLE } from "../../../../../generated/prisma/browser";
import { ArrowUp, Loader2, RotateCw, Lightbulb, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import type { ChatInfo } from "@/lib/repositories/chat.repo";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/app/context/AppContext";
import Markdown from "@/components/Markdown";
import { MessagePayload } from "@/types/chat.types";
import { ApiError } from "@/lib/utils/ApiError";

type ChatPops = {
  chat: ChatInfo;
};

type Message =
  | {
      id: string;
      content: string;
      role: typeof MESSAGE_ROLE.USER;
    }
  | {
      id: string;
      content: string;
      thinking?: string;
      role: typeof MESSAGE_ROLE.ASSISTANT;
    };

const Chat = ({ chat }: ChatPops) => {
  const { setOpen } = useSidebar();
  const [messages, setMessages] = useState<Message[]>(chat.messages || []);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(true);
  const { timestamp, chatLanguage, setTimestamp, setChatLanguage } = useAppContext();

  const handleResponseStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array<ArrayBuffer>>
  ) => {
    console.log("Handling response stream");
    const responseId = crypto.randomUUID();
    let responseThinking: string = "";
    let responseContent: string = "";

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      const lines = decoder.decode(value).split("\n").filter(Boolean);

      for (const line of lines) {
        const { content, thinking, error } = JSON.parse(line) as {
          content?: string | null;
          thinking?: string | null;
          error?: string | null;
        };

        if (error) {
          setError(error);
          break;
        }

        if (thinking) {
          setIsThinking(true);
          responseThinking += thinking;
        } else {
          setIsThinking(false);
          if (content && content !== "null" && content !== "undefined") {
            responseContent += content;
          }
        }

        // Update or add message based on whether it already exists
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];

          const message = {
            id: responseId,
            content: responseContent,
            role: MESSAGE_ROLE.ASSISTANT,
            thinking: responseThinking,
          };

          if (lastMessage?.id === responseId) {
            // Update existing message
            return [...prev.slice(0, -1), message];
          } else {
            // Add new message
            return [...prev, message];
          }
        });
      }
    }
  };

  const submitMessage = async (e?: React.SubmitEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!query.trim()) return;

    const requestedQuery: string = query;
    try {
      setError("");
      setIsLoading(true);

      // Implementation for submitting message

      const body: MessagePayload = { message: requestedQuery, language: chatLanguage };

      if (timestamp.enable) {
        body.timestamp = timestamp.current;
      }

      setQuery("");
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          content: body.message,
          role: MESSAGE_ROLE.USER,
        },
      ]);

      const response = await fetch(`/api/chats/${chat.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error("Failed to read response stream");
        }

        await handleResponseStream(reader);
      } else {
        const error = (await response.json()) as ApiError;
        throw new Error(error.message);
      }
    } catch (error) {
      // revert message and query
      setQuery(requestedQuery);
      setMessages((prev) => prev.slice(0, -1));

      setError("Failed to send message.");
      console.error("Error submitting message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // set chat language
    setChatLanguage(chat.language || chat.user?.profile?.language || "HINGLISH");

    // set include timestamp
    setTimestamp((prev) => ({
      ...prev,
      enable: chat.withTimestamp || chat.user?.profile?.withTimestamp || true,
    }));
  }, [chat, setChatLanguage, setTimestamp]);

  useEffect(() => {
    const el = messageContainerRef.current;

    if (!el) return;

    el.scrollTop = el.scrollHeight;
  }, [messages]);

  useEffect(() => {
    // make the sidebar hidden
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full p-2 flex flex-col justify-between items-center">
      <div ref={messageContainerRef} className="w-full h-full mb-4 overflow-auto">
        {messages.map((message, index) =>
          message.role === "ASSISTANT" ? (
            <div key={message.id} className="w-full p-2">
              {message.thinking && (
                <details className="group mb-3" open={isThinking && index === messages.length - 1}>
                  <summary className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg bg-slate-500/10 border border-slate-500/20 hover:bg-slate-500/15 transition-colors">
                    <ChevronDown className="size-4 text-slate-600 group-open:rotate-180 transition-transform" />
                    <Lightbulb className="size-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Thinking</span>
                  </summary>
                  <div className="mt-2 ml-6 pl-3 border-l-2 border-slate-500/20">
                    <Markdown
                      className={`text-sm text-slate-500 italic leading-relaxed ${isThinking && index === messages.length - 1 ? "animate-pulse" : ""}`}
                    >
                      {message.thinking}
                    </Markdown>
                  </div>
                </details>
              )}
              <Markdown>{message.content}</Markdown>
              {/* controls */}
            </div>
          ) : (
            <div key={message.id} className="w-fit py-2 px-4 rounded-xl ml-auto bg-gray-800">
              {message.content}
            </div>
          )
        )}
        {error && (
          <div className="w-full mt-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-between gap-2">
            <p className="text-sm text-red-500 font-medium flex-1">{error}</p>
            <button
              type="button"
              className="shrink-0 text-red-600 hover:text-red-700 hover:rotate-180 transition-transform duration-300 cursor-pointer"
              onClick={() => submitMessage()}
              aria-label="Retry"
            >
              <RotateCw className="size-4" />
            </button>
          </div>
        )}
      </div>
      <form
        className="w-full max-w-full rounded-2xl border bg-card/70 p-3 backdrop-blur-sm"
        onSubmit={submitMessage}
      >
        <FieldGroup>
          <Field>
            <Textarea
              id="textarea-code-32"
              placeholder="Ask anything about this video..."
              className="min-h-24 resize-none border-0 bg-transparent! px-0 shadow-none focus-visible:ring-0"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
          </Field>

          <div className="mt-2 grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 border-t pt-3">
            <Field className="w-fit flex-1">
              <Select
                value={chatLanguage}
                onValueChange={(value) => value && setChatLanguage(value as CHAT_LANGUAGE)}
              >
                <SelectTrigger className="h-9 w-full min-w-0 rounded-lg">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Object.values(CHAT_LANGUAGE).map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field orientation="horizontal" className="shrink-0 gap-2 whitespace-nowrap">
              <Checkbox
                id="include-timestamp"
                checked={timestamp.enable}
                onCheckedChange={(checked) =>
                  setTimestamp((prev) => ({ ...prev, enable: !!checked }))
                }
              />
              <FieldLabel htmlFor="include-timestamp" className="text-xs sm:text-sm">
                <span className="hidden md:inline">Timestamp</span>
              </FieldLabel>
            </Field>

            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 shrink-0 self-center rounded-full cursor-pointer"
              variant="default"
              disabled={!query.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
};

export default Chat;
