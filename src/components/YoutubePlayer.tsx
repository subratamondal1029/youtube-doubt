"use client";

import { useAppContext } from "@/app/context/AppContext";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

type YoutubePlayerProps = {
  videoId: string;
};

const YoutubePlayer = ({ videoId }: YoutubePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { setTimestamp } = useAppContext();

  const updateTimestamp = () => {
    if (playerRef.current) {
      const currentTimestamp = Math.floor(playerRef.current.getCurrentTime?.());
      setTimestamp((prev) => ({ ...prev, current: currentTimestamp }));
    }
  };

  const onReady = () => {
    console.log("Youtube player is ready");
    updateTimestamp();
  };

  const onStateChange = (e: YT.OnStateChangeEvent) => {
    if (e.data === YT.PlayerState.PLAYING) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(updateTimestamp, 250);
    } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  useEffect(() => {
    const initPlayer = () => {
      if (!containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          playsinline: 1,
        },
        events: {
          onReady,
          onStateChange,
        },
      });
    };

    if (window.YT?.Player) {
      // API already loaded (e.g. another player mounted first)
      initPlayer();
      return;
    }

    // add script for YouTube IFrame API
    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = initPlayer;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      document.getElementById("yt-iframe-api")?.remove();
      playerRef.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg shadow-lg border border-border outline-none"
    >
      YoutubePlayer
    </div>
  );
};

export default YoutubePlayer;
