import {
  fetchAllProjects,
  fetchCertificates,
  fetchGallery,
  fetchSiteSettings,
  fetchTechnologies,
} from "@/lib/api";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { About } from "@/components/About";
import { StatementSection } from "@/components/effects/scroll-statement";
import { Technologies } from "@/components/Technologies";
import { Certificates } from "@/components/Certificates";
import { ProjectsSection } from "@/components/ProjectsSection";
import { Gallery } from "@/components/Gallery";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [technologies, { projects, competitions }, certificates, gallery, settings] =
    await Promise.all([
      fetchTechnologies(),
      fetchAllProjects(),
      fetchCertificates(),
      fetchGallery(),
      fetchSiteSettings(),
    ]);

  return (
    <main>
      <Hero cvUrl={settings.cvUrl} techNames={technologies.map((t) => t.name)} />
      <Stats
        projects={projects}
        competitions={competitions}
        technologies={technologies}
      />
      <About />
      <StatementSection />
      <Technologies technologies={technologies} />
      <Certificates certificates={certificates} />
      <ProjectsSection projects={projects} competitions={competitions} />
      <Gallery items={gallery} />
    </main>
  );
}