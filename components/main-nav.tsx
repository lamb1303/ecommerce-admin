"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MainNav = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/`,
      label: "Inicio",
      active: pathname === `/`,
    },
    {
      href: `/categories`,
      label: "Categorías",
      active: pathname === `/categories`,
    },
    {
      href: `/news`,
      label: "Noticias",
      active: pathname === `/news`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-5", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
