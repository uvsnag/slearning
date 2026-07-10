import { codePlaygroundProject } from './projects/code-playground';
import { javaMicroserviceProject } from './projects/java-microservice';
import { microserviceLearningProject } from './projects/microservice-learning';
import { StudioProject } from './types';

/**
 * Registry of Code Studio demo projects.
 *
 * To add a new project:
 *   1. create app/source-code/projects/<id>/index.ts exporting a StudioProject
 *      (file tree via the file()/folder() helpers, databases optional),
 *   2. add it to the array below,
 *   3. optionally add a direct link in app/common/navLinks.ts.
 * The hub page and the /source-code/<id> route pick it up automatically.
 */
export const STUDIO_PROJECTS: StudioProject[] = [
  codePlaygroundProject,
  javaMicroserviceProject,
  microserviceLearningProject,
];

export function getProjectById(id: string): StudioProject | undefined {
  return STUDIO_PROJECTS.find((project) => project.id === id);
}
