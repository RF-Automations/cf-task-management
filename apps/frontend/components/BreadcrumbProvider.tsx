"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbResponsive } from "./BreadcrumbResponsive";

export default function BreadcrumbProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const items: { href?: string; label: string }[] = [];

  const pathName = usePathname();
  const paths = pathName.split("/").filter((path) => path.trim() !== "");

  const middlePath = paths.slice(1, paths.length - 1);
  items.push({
    href: `/${paths[0]}`,
    label: "dashboard",
  });
  if (paths.length > 1) {
    middlePath.map((path) => {
      items.push({
        href: `/${paths[0]}/${path}`,
        label: path,
      });
    });

    items.push({
      label: `${paths[paths.length - 1]}`,
    });
  }
  
  return (
    <>
      <div className="px-6 pt-6 md:pt-0">
        <BreadcrumbResponsive items={items} />
      </div>
      {children}
    </>
  );
}
