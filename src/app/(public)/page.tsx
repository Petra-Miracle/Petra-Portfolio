import {
  fetchAllProjects,
  fetchCertificates,
  fetchSiteSettings,
  fetchTechnologies,
} from "@/lib/api";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Technologies } from "@/components/Technologies";
import { Certificates } from "@/components/Certificates";
import { ProjectsSection } from "@/components/ProjectsSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [technologies, { projects, competitions }, certificates, settings] =
    await Promise.all([
      fetchTechnologies(),
      fetchAllProjects(),
      fetchCertificates(),
      fetchSiteSettings(),
    ]);

  return (
    <main>
      <Hero cvUrl={settings.cvUrl} />
      <About />
      <Technologies technologies={technologies} />
      <Certificates certificates={certificates} />
      <ProjectsSection projects={projects} competitions={competitions} />
    </main>
  );
}