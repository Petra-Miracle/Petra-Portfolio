import { fetchAllProjects, fetchTechnologies } from "@/lib/api";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Technologies } from "@/components/Technologies";
import { ProjectsSection } from "@/components/ProjectsSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [technologies, { projects, competitions }] = await Promise.all([
    fetchTechnologies(),
    fetchAllProjects(),
  ]);

  return (
    <main>
      <Hero />
      <About />
      <Technologies technologies={technologies} />
      <ProjectsSection projects={projects} competitions={competitions} />
    </main>
  );
}