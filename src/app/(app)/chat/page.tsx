"use client";

import { Field, FieldDescription } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import extractYouTubeId from "@/lib/utils/extractYoutubeId";
import axios, { AxiosError } from "axios";
import { Loader2, Send } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  const submitHandler = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const { data }: { data: { id: string } } = await axios.post("/api/chats", { url });

      redirect(`/chat/${data.id}`, RedirectType.replace);
    } catch (error) {
      let errorMessage: string;
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || "Failed to start chat";
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
    }
  };

  useEffect(() => {
    setIsValid(isValidUrl(url));
  }, [url]);

  return (
    <>
      <form className="w-full h-full flex justify-center items-center" onSubmit={submitHandler}>
        <Field
          orientation="horizontal"
          className="w-full max-w-3/4 flex flex-col"
          data-invalid={!isValid}
        >
          <InputGroup className="h-12 rounded-full px-1">
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
                className="rounded-full cursor-pointer h-10 w-10 flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription className={`text-sm ${isValid && "invisible"}`}>
            Please enter a valid URL
          </FieldDescription>
        </Field>
      </form>
    </>
  );
};

export default NewChat;
