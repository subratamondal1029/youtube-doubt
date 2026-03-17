"use client";

import { Field, FieldDescription } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { TOTAL_PROCESSING_STEPS } from "@/constant";
import extractYouTubeId from "@/lib/utils/extractYoutubeId";
import { Loader2, Send } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SseSuccessMessage = {
  step: number;
  message: string;
  data: Record<string, unknown>;
};

type SseErrorMessage = {
  error: string;
  message: string;
};

type SseMessage = SseSuccessMessage | SseErrorMessage;

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

  const [status, setStatus] = useState<"open" | "closed" | "loading">("loading");
  const [sseResponses, setSseResponses] = useState<SseSuccessMessage[]>([]);

  const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      const chatId = await new Promise((resolve, reject) => {
        const es = new EventSource("/api/chats/new?url=" + encodeURIComponent(url));

        es.onopen = () => setStatus("open");

        es.onmessage = (e: MessageEvent) => {
          const data: SseMessage = JSON.parse(e.data);

          if ("error" in data) {
            reject(new Error(data.message));
          } else {
            setSseResponses((prev) => [...prev, data]);
            if (data.step === TOTAL_PROCESSING_STEPS) {
              resolve(data.data.chatId);
            }
          }
        };

        es.onerror = () => {
          setStatus("closed");
          es.close();
          reject(new Error("Failed to establish connection with server"));
        };
      });

      redirect(`/chat/${chatId}`, RedirectType.replace);
    } catch (error) {
      let errorMessage: string;
      if (error instanceof Error) {
        errorMessage = error.message || "Failed to start chat";
      } else {
        errorMessage = "Failed to start chat";
      }

      toast.error(errorMessage, {
        style: {
          background: "red",
          color: "white",
        },
        duration: 5000,
        position: "bottom-left",
      });
    } finally {
      setIsSubmitting(false);
      setStatus("closed");
    }
  };

  useEffect(() => {
    setIsValid(isValidUrl(url));
  }, [url]);

  return (
    <div
      className={`w-full max-w-3/4 h-full mx-auto flex flex-col ${isSubmitting ? "justify-end" : "justify-center"} items-center gap-6`}
    >
      {isSubmitting && (
        <div className="w-full space-y-3 mb-8">
          {sseResponses.map((response, index) => (
            <div
              key={response.step || index + TOTAL_PROCESSING_STEPS}
              className="w-full p-4 bg-muted/50 rounded-lg border border-muted-foreground/20"
            >
              <p className="text-sm font-semibold text-muted-foreground">Step {response.step}</p>
              <p className="text-base font-medium mt-1">{response.message}</p>
              {response.step === 2 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Processing for {response.data?.title as string}
                </p>
              )}
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${status === "open" ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}`}
            >
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
