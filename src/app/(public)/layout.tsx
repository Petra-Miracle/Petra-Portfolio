import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navigation />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}