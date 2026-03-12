import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/auth";

const Header = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/chat");
  }

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl rounded-2xl backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 shadow-lg">
      <div className="flex items-center justify-between px-4 py-4">
        <Logo />
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            <li>
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <Link
          href="/api/auth/signin"
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Sign In
        </Link>
      </div>
    </header>
  );
};

export default Header;
