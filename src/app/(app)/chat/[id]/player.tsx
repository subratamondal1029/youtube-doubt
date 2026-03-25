import { ChatInfo } from "@/lib/repositories/chat.repo";
import YoutubePlayer from "@/components/YoutubePlayer";

type PlayerProps = {
  video: ChatInfo["video"];
  className?: string;
};

export default function Player({ video, className }: PlayerProps) {
  if (!video) {
    return <div className="text-center text-lg font-medium">Video not found</div>;
  }

  return (
    <div
      className={`h-screen flex flex-col bg-linear-to-b from-background to-secondary/10 px-2 ${className}`}
    >
      <div className="flex-1 flex items-center justify-center py-4">
        {video.platform === "YOUTUBE" ? (
          <YoutubePlayer videoId={video.remoteId} />
        ) : (
          <div className="text-center text-lg font-medium">Platform not supported yet</div>
        )}
      </div>
      <div className="bg-card border-t border-border rounded-2xl py-6 px-4 space-y-3 mb-4 overflow-hidden">
        <h1 className="text-2xl font-bold text-foreground line-clamp-1">{video.title}</h1>
        <p className="text-sm text-muted-foreground line-clamp-1">{video.description}</p>
      </div>
    </div>
  );
}
