export enum NewChatProcesses {
  INITIALIZING,
  FETCHED_VIDEO_DETAILS,
  FETCHED_SUBTITLES,
  PROCESSED_SUBTITLES,
  INITIALIZE_CHAT,
  COMPLETE,
  ERROR,
}

type EmptyData = Record<string, never>;

export type NewChatProcessResponse =
  | {
      step: NewChatProcesses.INITIALIZING;
      message: string;
      data: EmptyData;
    }
  | {
      step: NewChatProcesses.FETCHED_VIDEO_DETAILS;
      message: string;
      data: {
        title: string;
        description: string;
      };
    }
  | {
      step: NewChatProcesses.FETCHED_SUBTITLES;
      message: string;
      data: {
        length: number;
      };
    }
  | {
      step: NewChatProcesses.PROCESSED_SUBTITLES | NewChatProcesses.INITIALIZE_CHAT;
      message: string;
      data: EmptyData;
    }
  | {
      step: NewChatProcesses.COMPLETE;
      message: string;
      data: {
        chatId: string;
      };
    }
  | {
      step: NewChatProcesses.ERROR;
      error: string;
    };

export type Subtitle = {
  start: number;
  end: number;
  content: string;
};
