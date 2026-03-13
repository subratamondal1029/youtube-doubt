import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_60%,rgba(59,130,246,0.08),transparent)]" />

      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mb-5">
        <Mail className="w-5 h-5 text-blue-500" />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-foreground">Contact Support</h1>

      <p className="mt-3 text-muted-foreground text-base max-w-sm">
        Found a bug or have a question? Drop a mail — we reply fast.
      </p>

      <Button
        asChild
        size="lg"
        className="mt-6 bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/40 text-white px-8 rounded-full shadow-lg shadow-blue-500/20 transition-all duration-200"
      >
        <a href="mailto:subratamondal@tutanota.com">subratamondal@tutanota.com</a>
      </Button>

      <p className="mt-4 text-xs text-muted-foreground/60">Opens your default mail app.</p>
    </main>
  );
}
