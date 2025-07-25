import { TaskRunIdValueSchema } from "@/tasks/manager/dto.js";
import { z } from "zod";

export const AgentUpdateCallbackSchema = z
  .function()
  .args(z.string(), z.string())
  .returns(z.void());
export type AgentUpdateCallback = z.infer<typeof AgentUpdateCallbackSchema>;

export const SupervisorWorkflowInputSchema = z.object({
  prompt: z.string(),
  originTaskRunId: TaskRunIdValueSchema,
  onUpdate: AgentUpdateCallbackSchema,
});
export type SupervisorWorkflowInput = z.infer<
  typeof SupervisorWorkflowInputSchema
>;

export const SupervisorWorkflowOutputSchema = z.string();
export type SupervisorWorkflowOutput = z.infer<
  typeof SupervisorWorkflowOutputSchema
>;
