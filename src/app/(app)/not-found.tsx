import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

const AppNotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-lg text-muted-foreground">Page not found</p>
        <Link href="/chat" className={`${buttonVariants()} mt-4 cursor-pointer`}>
          <Plus /> <p>New Chat</p>
        </Link>
      </div>
    </div>
  );
};

export default AppNotFound;
