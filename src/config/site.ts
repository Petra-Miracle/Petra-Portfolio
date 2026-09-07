export const siteConfig = {
  title: "Petra Portfolio",
  description:
    "Portfolio programmer — project, kompetisi, dan teknologi yang dikuasai.",
  author: {
    // TODO: Ganti dengan nama asli
    name: "[Nama Anda]",
    role: "Programmer",
    image: "/hero-profile.png",
  },
  navLinks: [
    { label: "Beranda", href: "#beranda" },
    { label: "Tentang", href: "#tentang" },
    { label: "Teknologi", href: "#teknologi" },
    { label: "Project & Kompetisi", href: "#proyek" },
    { label: "Kontak", href: "#kontak" },
  ],
  socials: [
    // TODO: Ganti dengan link asli
    { label: "GitHub", href: "https://github.com/", icon: "github" },
    { label: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
    { label: "Email", href: "mailto:you@example.com", icon: "mail" },
  ],
} as const;
