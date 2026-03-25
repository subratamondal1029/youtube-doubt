import Link from "next/link";
import { MenuIcon } from "lucide-react";
import Logo from "@/components/Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
];

const Header = async () => {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl rounded-2xl backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border border-gray-200 dark:border-slate-800 shadow-lg">
      <div className="flex items-center justify-between px-4 py-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/sign-in" className={buttonVariants({ variant: "default", size: "sm" })}>
            Sign In
          </Link>

          {/* Mobile hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <SheetHeader>
                <SheetTitle asChild>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col flex-1 mt-6 mb-4 px-4">
                <ul className="flex flex-col gap-4">
                  {navLinks.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="flex items-center py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-b border-gray-100 dark:border-slate-800 transition-colors"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-6">
                  <Link
                    href="/sign-in"
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                      className: "w-full",
                    })}
                  >
                    Sign In
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
