export const siteConfig = {
  title: "Petra Portfolio",
  description:
    "Portfolio programmer project, kompetisi, dan teknologi yang dikuasai.",
  author: {
    name: "Petra Lenggu",
    role: "Full-Stack Developer",
    image: "/hero-profile.png",
    // Ubah ke "Available" jika sedang open opportunities, atau null untuk sembunyikan
    status: null as "Available" | null,
  },
  // TODO: Ganti dengan angka & email asli
  stats: {
    experience: "5+",
    experienceLabel: "TAHUN PENGALAMAN",
  },
  email: "petra221106@gmail.com",
  navLinks: [
    { label: "Tentang", href: "#tentang" },
    { label: "Teknologi", href: "#teknologi" },
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