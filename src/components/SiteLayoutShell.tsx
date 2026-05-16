"use client";

export default function SiteLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="smooth-wrapper"
      className="w-full h-full overflow-y-auto overflow-x-hidden"
    >
      <div
        id="smooth-content"
        className="z-10 flex flex-col relative min-h-full"
      >
        {children}
      </div>
    </div>
  );
}
