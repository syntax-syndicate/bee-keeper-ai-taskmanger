import { OperationResult } from "@/base/dto.js";
import { RunContext } from "beeai-framework/context";
import { Emitter } from "beeai-framework/emitter/emitter";
import {
  BaseToolOptions,
  JSONToolOutput,
  Tool,
  ToolEmitter,
  ToolInput,
} from "beeai-framework/tools/base";
import { z } from "zod";
import {
  ActingAgentIdValueSchema,
  TaskConfig,
  TaskConfigPoolStats,
  TaskConfigSchema,
  TaskKindEnumSchema,
  TaskRun,
  TaskRunHistoryEntry,
  TaskRunIdValueSchema,
  TaskTypeValueSchema,
} from "./manager/dto.js";
import { TaskManager } from "./manager/manager.js";
import { ServiceLocator } from "@/utils/service-locator.js";

export const TOOL_NAME = "task_manager";

export type TaskManagerToolResultData =
  | void
  | boolean
  | TaskConfig
  | TaskConfig[]
  | [TaskConfigPoolStats, [number, TaskConfigPoolStats][]]
  | TaskRun
  | TaskRun[]
  | TaskRunHistoryEntry[]
  | OperationResult
  | OperationResult[];

export interface TaskManagerToolResult {
  method: string;
  success: true;
  data: TaskManagerToolResultData;
}

export const CreateTaskConfigSchema = z
  .object({
    method: z.literal("createTaskConfig"),
    config: TaskConfigSchema.omit({
      concurrencyMode: true,
      taskConfigId: true,
      taskConfigVersion: true,
      ownerAgentId: true,
      runImmediately: true,
      intervalMs: true,
    }),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Creates a new task configuration.");

export const GetTaskConfigSchema = z
  .object({
    method: z.literal("getTaskConfig"),
    taskKind: TaskKindEnumSchema,
    taskType: TaskTypeValueSchema,
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Get latest task configuration for specific task kind and type.");

export const UpdateTaskConfigSchema = z
  .object({
    method: z.literal("updateTaskConfig"),
    taskKind: TaskKindEnumSchema,
    taskType: TaskTypeValueSchema,
    config: TaskConfigSchema.partial().pick({
      taskConfigInput: true,
      description: true,
      intervalMs: true,
      runImmediately: true,
      maxRepeats: true,
      maxRetries: true,
      retryDelayMs: true,
      concurrencyMode: true,
    }),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Update an existing task configuration.");

export const DestroyTaskConfigSchema = z
  .object({
    method: z.literal("destroyTaskConfig"),
    taskKind: TaskKindEnumSchema,
    taskType: TaskTypeValueSchema,
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe(
    "Destroy an existing task configuration with all related task runs.",
  );

export const GetPoolStatsSchema = z
  .object({
    method: z.literal("getPoolStats"),
    taskKind: TaskKindEnumSchema,
    taskType: TaskTypeValueSchema,
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe(
    "Get statistics about the task run's pool for a specific task configuration kind and type",
  );

export const CreateTaskRunSchema = z
  .object({
    method: z.literal("createTaskRun"),
    taskKind: TaskKindEnumSchema,
    taskType: TaskTypeValueSchema,
    actingAgentId: ActingAgentIdValueSchema,
    taskRunInput: z.string().describe(`Task input specific for the run.`),
    originTaskRunId: TaskRunIdValueSchema,
    blockedByTaskRunIds: z
      .array(TaskRunIdValueSchema)
      .describe(
        "IDs of task runs that blocks this task run and will whose outputs this task receive",
      ),
  })
  .describe("Creates a new task run from task configuration.");

export const GetAllTaskConfigsSchema = z
  .object({
    method: z.literal("getAllTaskConfigs"),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Gets all created task configs.");

export const ScheduleStartInteractionBlockingTaskRunsSchema = z
  .object({
    method: z.literal("scheduleStartInteractionBlockingTaskRuns"),
    interactionTaskRunId: TaskRunIdValueSchema.describe(
      `The interaction task run ID`,
    ),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe(
    "Schedules starts of all blocking task runs that are blocked by the the interaction task run simultaneously.",
  );

export const ScheduleStartTaskRunSchema = z
  .object({
    method: z.literal("scheduleStartTaskRun"),
    taskRunIds: z.array(TaskRunIdValueSchema),
    actingAgentId: ActingAgentIdValueSchema,
    initiatingTaskRunId: TaskRunIdValueSchema.describe(
      "IDs of interaction kind of task run that initiate the start",
    ),
  })
  .describe(
    "Schedules start of a one or group of specific task runs simultaneously.",
  );

export const StopTaskRunSchema = z
  .object({
    method: z.literal("stopTaskRun"),
    taskRunId: z.string(),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Stop a task run.");

export const RemoveTaskRunSchema = z
  .object({
    method: z.literal("removeTaskRun"),
    taskRunId: z.string(),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Removes task run.");

export const GetTaskRunSchema = z
  .object({
    method: z.literal("getTaskRun"),
    taskRunId: z.string(),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Gets current state of the task run.");

export const AddBlockingTaskRunsSchema = z
  .object({
    method: z.literal("addBlockingTaskRuns"),
    taskRunId: TaskRunIdValueSchema,
    blockingTaskRunIds: z
      .array(TaskRunIdValueSchema)
      .describe("Array of depending task runs."),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Add blocking task run.");

export const GetAllTaskRunsSchema = z
  .object({
    method: z.literal("getAllTaskRuns"),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Gets current state of all accessible task runs.");

export const IsTaskRunOccupiedSchema = z
  .object({
    method: z.literal("isTaskRunOccupied"),
    taskRunId: z.string(),
    actingAgentId: ActingAgentIdValueSchema,
  })
  .describe("Checks if a task run is currently occupied.");

export const GetTaskRunHistorySchema = z
  .object({
    method: z.literal("getTaskRunHistory"),
    taskRunId: z.string(),
    actingAgentId: ActingAgentIdValueSchema,
    options: z
      .object({
        limit: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        successOnly: z.boolean().optional(),
      })
      .optional(),
  })
  .describe("Gets execution history for a task. Requires agent permissions.");

export class TaskManagerTool extends Tool<
  JSONToolOutput<TaskManagerToolResult>
> {
  name = "task_manager";
  description =
    "The TaskManager manages periodic task execution with ownership and permission controls. It provides functionality for scheduling, executing, and managing tasks with proper access control.";

  static {
    this.register();
  }

  public readonly emitter: ToolEmitter<
    ToolInput<this>,
    JSONToolOutput<TaskManagerToolResult>
  > = Emitter.root.child({
    namespace: ["tool", "task_manager"],
    creator: this,
  });

  private get taskManager() {
    // Weak reference to the task manager
    return ServiceLocator.getInstance().get(TaskManager);
  }

  inputSchema() {
    return z.discriminatedUnion("method", [
      CreateTaskConfigSchema,
      UpdateTaskConfigSchema,
      GetTaskConfigSchema,
      GetAllTaskConfigsSchema,
      DestroyTaskConfigSchema,
      GetPoolStatsSchema,
      CreateTaskRunSchema,
      ScheduleStartInteractionBlockingTaskRunsSchema,
      ScheduleStartTaskRunSchema,
      StopTaskRunSchema,
      RemoveTaskRunSchema,
      AddBlockingTaskRunsSchema,
      GetTaskRunSchema,
      GetAllTaskRunsSchema,
      IsTaskRunOccupiedSchema,
      GetTaskRunHistorySchema,
    ]);
  }

  protected async _run(
    input: ToolInput<this>,
    options: BaseToolOptions,
    run: RunContext<this>,
  ) {
    let data: TaskManagerToolResultData;
    switch (input.method) {
      case "createTaskConfig": {
        const { actingAgentId, config: taskConfig } = input;
        data = this.taskManager.createTaskConfig(
          {
            ...taskConfig,
            runImmediately: false,
            concurrencyMode: "PARALLEL",
            intervalMs: 0,
          },
          actingAgentId,
          actingAgentId,
        );
        break;
      }
      case "getTaskConfig": {
        const { taskKind, taskType, actingAgentId } = input;
        data = this.taskManager.getTaskConfig(
          taskKind,
          taskType,
          actingAgentId,
        );
        break;
      }
      case "updateTaskConfig": {
        const { config: config, taskKind, taskType, actingAgentId } = input;
        data = this.taskManager.updateTaskConfig(
          { ...config, taskKind, taskType },
          actingAgentId,
        );
        break;
      }
      case "destroyTaskConfig": {
        const { taskKind, taskType, actingAgentId } = input;
        data = this.taskManager.destroyTaskConfig(
          taskKind,
          taskType,
          actingAgentId,
        );
        break;
      }
      case "getAllTaskConfigs":
        data = this.taskManager.getAllTaskConfigs(input.actingAgentId);
        break;
      case "getPoolStats": {
        const { taskKind, taskType, actingAgentId } = input;
        data = this.taskManager.getPoolStats(taskKind, taskType, actingAgentId);
        break;
      }
      case "createTaskRun": {
        const {
          taskKind,
          taskType,
          taskRunInput,
          actingAgentId,
          originTaskRunId,
          blockedByTaskRunIds,
        } = input;
        data = this.taskManager.createTaskRun(
          taskKind,
          taskType,
          "automatic",
          taskRunInput,
          actingAgentId,
          {
            originTaskRunId,
            blockedByTaskRunIds,
          },
        );
        break;
      }
      case "scheduleStartInteractionBlockingTaskRuns": {
        const { interactionTaskRunId, actingAgentId } = input;
        data = this.taskManager.scheduleStartInteractionBlockingTaskRuns(
          interactionTaskRunId,
          actingAgentId,
          {
            signal: (run.context as any)["task_run_signal"],
          },
        );
        break;
      }
      case "scheduleStartTaskRun": {
        const { taskRunIds, actingAgentId, initiatingTaskRunId } = input;
        data = this.taskManager.scheduleStartTaskRuns(
          taskRunIds,
          actingAgentId,
          {
            initiatingTaskRunId,
            signal: (run.context as any)["task_run_signal"],
          },
        );
        break;
      }
      case "stopTaskRun":
        data = this.taskManager.stopTaskRun(
          input.taskRunId,
          input.actingAgentId,
        );
        break;
      case "removeTaskRun":
        data = this.taskManager.destroyTaskRun(
          input.taskRunId,
          input.actingAgentId,
        );
        break;
      case "getTaskRun":
        data = this.taskManager.getTaskRun(
          input.taskRunId,
          input.actingAgentId,
        );
        break;
      case "addBlockingTaskRuns":
        data = this.taskManager.addBlockingTaskRuns(
          input.taskRunId,
          input.blockingTaskRunIds,
          input.actingAgentId,
        );
        break;
      case "getAllTaskRuns":
        data = this.taskManager.getAllTaskRuns(input.actingAgentId);
        break;
      case "isTaskRunOccupied":
        data = this.taskManager.isTaskRunOccupied(
          input.taskRunId,
          input.actingAgentId,
        );
        break;
      case "getTaskRunHistory":
        data = this.taskManager.getTaskRunHistory(
          input.taskRunId,
          input.actingAgentId,
        );
        break;
    }
    return new JSONToolOutput({
      method: input.method,
      success: true,
      data,
    } satisfies TaskManagerToolResult);
  }
}
