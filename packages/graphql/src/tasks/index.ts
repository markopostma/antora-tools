import { GenerateMetaTask } from './before-process/generate-meta.task';
import { IntrospectionTask } from './before-process/introspection.task';
import { ValidateTask } from './before-process/validate.task';
import { AddAttachmentsTask } from './content-classified/add-attachments.task';
import { AddPagesTask } from './content-classified/add-pages.task';
import { CreateComponentTask } from './content-classified/create-component.task';
import { AttachResultsTask } from './navigation-built/attach-results.task';
import { NavigationTask } from './navigation-built/navigation.task';

export const beforeProcess = [ValidateTask, IntrospectionTask, GenerateMetaTask] as const;
export const contentClassified = [CreateComponentTask, AddAttachmentsTask, AddPagesTask] as const;
export const navigationBuilt = [NavigationTask, AttachResultsTask] as const;
