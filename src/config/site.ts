export const siteConfig = {
  title: "Petra Portfolio",
  description:
    "Full-Stack Developer yang membangun aplikasi web nyata — dari perencanaan, pengembangan, hingga rilis produksi.",
  author: {
    name: "Petra Lenggu",
    role: "Full-Stack Developer",
    image: "/img/hero-profile.png",
    // Ubah ke null untuk sembunyikan badge ketersediaan di Hero & Footer
    status: "Available" as "Available" | null,
  },
  // TODO: Ganti dengan angka & email asli
  stats: {
    experience: "2+",
    experienceLabel: "TAHUN PENGALAMAN",
  },
  email: "petra221106@gmail.com",
  navLinks: [
    { label: "Tentang", href: "#tentang" },
    { label: "Teknologi", href: "#teknologi" },
    { label: "Sertifikat", href: "#sertifikat" },
    { label: "Karya", href: "#proyek" },
    { label: "Kontak", href: "#kontak" },
  ],
  socials: [
    // TODO: Ganti dengan link asli
    { label: "GitHub", href: "https://github.com/Petra-Miracle", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/petra-lenggu-538226319/", icon: "linkedin" },
    { label: "Twitter / X", href: "https://x.com/SmkindEzz", icon: "twitter" },
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
  ],
} as const;