"use client";

import { Field, FieldDescription } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import extractYouTubeId from "@/utils/extractYoutubeId";
import { Loader2, Send } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";

import { NewChatProcesses, NewChatProcessResponse } from "@/types/chat.types";
import { Progress } from "@/components/ui/progress";
import { ApiError } from "@/utils/ApiError";
import { toast } from "sonner";

type Status = "open" | "success" | "error" | "processing" | "closed";

const statusStyles: Record<Status, string> = {
  processing: "bg-yellow-500/20 text-yellow-500",
  success: "bg-green-500/20 text-green-500",
  open: "bg-blue-500/20 text-blue-500",
  error: "bg-red-500/20 text-red-500",
  closed: "bg-gray-500/20 text-gray-500",
};

const processStyles: Partial<Record<NewChatProcesses, string>> = {
  [NewChatProcesses.ERROR]: "bg-destructive/20 border-destructive/20",
  [NewChatProcesses.COMPLETE]: "bg-green-500/20 border-green-500/20",
};

function isValidUrl(url: string): boolean {
  try {
    if (!url) return true;
    const id = extractYouTubeId(url);
    if (!id) return false;
    else return true;
  } catch {
    return false;
  }
}

const NewChat = () => {
  const [url, setUrl] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [status, setStatus] = useState<Status>("closed");
  const [processResponses, setProcessResponses] = useState<NewChatProcessResponse[]>([]);

  const [progress, setProgress] = useState<number>(0);

  const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (url.trim() === "") {
      setIsValid(false);
      return;
    }

    try {
      setIsSubmitting(true);
      setProcessResponses([]);
      setProgress(0);

      const chatId: string = await new Promise((resolve, reject) => {
        const es = new EventSource("/api/chats/new?url=" + encodeURIComponent(url));

        es.onopen = () => {
          setStatus("open");
        };

        es.onmessage = (e: MessageEvent) => {
          const data: NewChatProcessResponse = JSON.parse(e.data);

          setProcessResponses((prev) => [...prev, data]);
          setProgress(Math.floor((data.step / NewChatProcesses.COMPLETE) * 100));

          if (data.step === NewChatProcesses.COMPLETE) {
            setStatus("success");
            resolve(data.data.chatId);
          } else if (data.step === NewChatProcesses.ERROR) {
            reject(new ApiError(0, data.error));
          } else {
            setStatus("processing");
          }
        };

        es.onerror = () => {
          es.close();
          reject(new Error("Failed to establish connection with server"));
        };
      });

      setTimeout(() => {
        redirect(`/chat/${chatId}`, RedirectType.replace);
      }, 2 * 1000);
    } catch (error) {
      console.error(error);

      if (!(error instanceof ApiError)) {
        // show toast message
        toast.error("An unexpected error occurred", {
          duration: 10 * 1000,
          style: {
            background: "red",
            color: "white",
          },
          position: "bottom-left",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setIsValid(isValidUrl(url));
  }, [url]);

  return (
    <div
      className={`w-full max-w-3/4 h-full mx-auto flex flex-col ${status !== "closed" ? "justify-end" : "justify-center"} items-center gap-6`}
    >
      {status !== "closed" && (
        <div className="w-full space-y-3 mb-8">
          {processResponses.map((process, index) => (
            <div
              key={process.step || index + NewChatProcesses.COMPLETE}
              className={`w-full p-4 bg-muted/50 rounded-lg border border-muted-foreground/20 ${processStyles[process.step] || ""}`}
            >
              {process.step !== NewChatProcesses.ERROR ? (
                <p className="text-sm font-semibold text-muted-foreground">Step {process.step}</p>
              ) : (
                <p className="text-sm font-semibold text-destructive">Error</p>
              )}
              <p className="text-base font-medium mt-1">
                {process.step === NewChatProcesses.ERROR ? process.error : process.message}
              </p>
              {process.step === NewChatProcesses.FETCHED_VIDEO_DETAILS && (
                <p className="text-xs text-muted-foreground mt-2">{process.data.title}</p>
              )}
            </div>
          ))}

          <Progress value={progress} className="mt-6" />

          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
              {status}
            </div>
          </div>
        </div>
      )}
      <form className="w-full flex justify-center items-center" onSubmit={submitHandler}>
        <Field
          orientation="horizontal"
          className="w-full flex flex-col gap-2"
          data-invalid={!isValid}
        >
          <InputGroup className="h-12 rounded-full px-1 shadow-sm border border-input">
            <InputGroupInput
              placeholder="https://youtube.com/watch?v=ABCD"
              className="text-base"
              disabled={isSubmitting}
              aria-invalid={!isValid}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                variant="secondary"
                type="submit"
                disabled={isSubmitting}
                className="rounded-full cursor-pointer h-10 w-10 flex items-center justify-center transition-all hover:bg-secondary/80 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription
            className={`text-xs transition-opacity ${isValid ? "invisible opacity-0" : "visible opacity-100"}`}
          >
            Please enter a valid YouTube URL
          </FieldDescription>
        </Field>
      </form>
    </div>
  );
};

export default NewChat;
