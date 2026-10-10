import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/effects/cursor-glow";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation />
      <CursorGlow />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}