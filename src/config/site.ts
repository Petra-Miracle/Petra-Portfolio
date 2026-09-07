export const siteConfig = {
  title: "Petra Portfolio",
  description:
    "Portfolio programmer — project, kompetisi, dan teknologi yang dikuasai.",
  author: {
    name: "Petra Lenggu",
    role: "Programmer",
    image: "/hero-profile.png",
    // Ubah ke "Available" jika sedang open opportunities, atau null untuk sembunyikan
    status: null as "Available" | null,
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
