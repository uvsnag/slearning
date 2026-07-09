import { notFound } from 'next/navigation';
import CodeStudio from '../components/CodeStudio';
import { getProjectById, STUDIO_PROJECTS } from '../registry';

/**
 * Server route for a Code Studio project. With `output: 'export'` every
 * project in the registry is pre-rendered at build time; adding a project
 * to registry.ts automatically adds its page.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return STUDIO_PROJECTS.map((project) => ({ projectId: project.id }));
}

export default async function StudioProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = getProjectById(projectId);
  if (!project) notFound();
  return <CodeStudio project={project} />;
}
