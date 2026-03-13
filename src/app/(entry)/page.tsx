import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Globe } from "lucide-react";
import Youtube from "@/icons/Youtube";

export default function LandingPage() {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Subtle blue glow background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(59,130,246,0.08),transparent)]" />

      {/* Badge */}
      <Badge
        variant="outline"
        className="mb-6 text-blue-500 border-blue-500/30 bg-blue-500/5 px-3 py-1 text-xs tracking-wide"
      >
        Built for Indian Students 🇮🇳
      </Badge>

      {/* Heading */}
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground max-w-xl leading-tight">
        Clear your doubts <span className="text-blue-500">while watching.</span>
      </h1>

      {/* Subtext */}
      <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-md">
        Paste any YouTube link. Watch the video. Ask anything about it — in{" "}
        <span className="font-medium text-foreground">Hindi, English, or Hinglish.</span> No tab
        switching.
      </p>

      {/* Feature pills */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full">
          <Youtube className="w-3.5 h-3.5" />
          YouTube Embedded
        </span>
        <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full">
          <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
          Ask by Timestamp
        </span>
        <span className="flex items-center gap-1.5 bg-muted px-3 py-1 rounded-full">
          <Globe className="w-3.5 h-3.5 text-green-500" />
          Hindi / Hinglish / English
        </span>
      </div>

      {/* CTA */}
      <div className="mt-8">
        <Button
          asChild
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-full text-base font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-blue-500/40 hover:scale-[1.02]"
        >
          <Link href="/chat">Get Started →</Link>
        </Button>
      </div>

      {/* Footer note */}
      <p className="mt-10 text-xs text-muted-foreground/60">
        No setup. Just paste a link and start asking.
      </p>
    </div>
  );
}
