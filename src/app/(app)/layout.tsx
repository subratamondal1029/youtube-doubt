import SideBar from "@/components/layout/sidebar";
import { buttonVariants } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppContextProvider } from "@/context/AppContext";

import Link from "next/link";
import { auth } from "@/auth";

const AppLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SidebarProvider>
      <AppContextProvider>
        {session?.user && <SideBar user={session.user} />}
        <div className="flex min-h-svh flex-1 flex-col">
          <header
            className={`flex h-14 items-center border-b border-sidebar-border/70 bg-background/95 px-3 backdrop-blur ${session ? "md:hidden" : ""}`}
          >
            {session ? (
              <SidebarTrigger className="cursor-pointer" />
            ) : (
              <Link href="/sign-in" className={`ml-auto ${buttonVariants()}`}>
                Sign In
              </Link>
            )}
          </header>
          <div className="pl-4 w-full flex-1 overflow-hidden">{children}</div>
        </div>
      </AppContextProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
