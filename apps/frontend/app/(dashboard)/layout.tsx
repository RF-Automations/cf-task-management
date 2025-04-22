import BreadcrumbProvider from "@/components/BreadcrumbProvider";
import DashboardHeader from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code First Communtiy Dashboard",
  description:
    "Common dashboard for members, TA's, and mentors for Code First Community.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full lg:h-screen w-full flex flex-col justify-start">
      <DashboardHeader />
      <div className="flex h-full lg:p-8 lg:gap-4">
        <Sidebar />
        <div className="lg:rounded-md lg:border lg:border-border lg:p-4 h-full w-full overflow-y-auto">
          <BreadcrumbProvider>{children}</BreadcrumbProvider>
        </div>
      </div>
    </div>
  );
}
