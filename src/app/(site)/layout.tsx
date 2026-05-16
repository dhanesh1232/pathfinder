import GlobalNav from "@/components/GlobalNav";
import SiteLayoutShell from "@/components/SiteLayoutShell";
import SiteLayoutExtras from "@/components/SiteLayoutExtras";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <GlobalNav />
      <SiteLayoutShell>{children}</SiteLayoutShell>
      <SiteLayoutExtras />
    </>
  );
}
