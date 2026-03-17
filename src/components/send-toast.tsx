"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type SendToastProps = {
  variant: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
};

const SendToast = ({ variant, message, duration }: SendToastProps) => {
  useEffect(() => {
    toast[variant](message, {
      duration: duration || 5000,
      position: "bottom-left",
    });
  }, [duration, message, variant]);

  return "";
};

export default SendToast;
