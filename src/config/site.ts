export const siteConfig = {
  title: "Petra Portfolio",
  description:
    "Full-Stack Developer who builds real-world web applications, from planning and development to production release.",
  author: {
    name: "Petra Lenggu",
    role: "Full-Stack Developer",
    image: "/img/pet-portfolio.jpg",
    // Set to null to hide the availability badge in the Hero & Footer
    status: "Available" as "Available" | null,
  },
  // TODO: Replace with real figures & email
  stats: {
    experience: "2+",
    experienceLabel: "YEARS OF EXPERIENCE",
  },
  email: "petra221106@gmail.com",
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Technologies", href: "#technologies" },
    { label: "Certificates", href: "#certificates" },
    { label: "Work", href: "#work" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ],
  socials: [
    // TODO: Replace with real links
    { label: "GitHub", href: "https://github.com/Petra-Miracle", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/petra-lenggu-538226319/", icon: "linkedin" },
    { label: "Twitter / X", href: "https://x.com/SmkindEzz", icon: "twitter" },
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
  ],
} as const;