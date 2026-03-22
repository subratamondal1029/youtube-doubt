"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import type { History } from "@/components/layout/sidebar/chat-history";
import { CHAT_LANGUAGE } from "../../../generated/prisma/enums";

type AppState = {
  timestamp: {
    enable: boolean;
    current: number;
  };
  chatLanguage: CHAT_LANGUAGE;
  history: History[];

  setTimestamp: Dispatch<SetStateAction<AppState["timestamp"]>>;
  setChatLanguage: Dispatch<SetStateAction<AppState["chatLanguage"]>>;
  setHistory: Dispatch<SetStateAction<AppState["history"]>>;
};

const AppContext = createContext<AppState | null>(null);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [timestamp, setTimestamp] = useState<AppState["timestamp"]>({
    enable: true,
    current: 0,
  });

  const [chatLanguage, setChatLanguage] = useState<AppState["chatLanguage"]>(CHAT_LANGUAGE.ENGLISH);

  const [history, setHistory] = useState<AppState["history"]>([]);

  const value = {
    timestamp,
    chatLanguage,
    history,
    setTimestamp,
    setChatLanguage,
    setHistory,
  };

  useEffect(() => {
    if (Math.floor(timestamp.current) % 5 === 0) {
      if (localStorage !== undefined) {
        localStorage.setItem("timestamp", timestamp.current.toString());
      }
    }
  }, [timestamp]);

  useEffect(() => {
    const updateLocalData = () => {
      const localStorageTimestamp = localStorage.getItem("timestamp");
      if (localStorageTimestamp) {
        setTimestamp((prev) => ({
          ...prev,
          current: parseFloat(localStorageTimestamp),
        }));
      }
    };

    if (localStorage !== undefined) {
      updateLocalData();
    }
  }, []);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return ctx;
};

export { AppContextProvider, useAppContext };
