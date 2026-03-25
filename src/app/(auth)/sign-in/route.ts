import { signIn } from "@/auth";

// NOTE: redirecting to google login directly for temporary

export async function GET() {
  return signIn("google", { redirectTo: "/chat" });
}
