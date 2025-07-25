import {
  ChoiceExplanations,
  WorkflowComposeFixture,
} from "../../base/workflow-compose-fixtures.js";
import toolsFixtures from "./tools.js";
import agentsFixtures from "./agent-config.js";
import tasksFixtures from "./task-config.js";
import taskStepsFixtures from "./task-step.js";
import taskRunsFixtures from "./task-run.js";

const title = "Poetry and Hip-Hop Song Analysis";

const prompt =
  "Create four distinct poems on these topics: vikings, neutrinos, marshmallows, and cats. Then craft a hip-hop song that deliberately incorporates specific imagery, phrases, and themes from each poem. Then take the hip-hop song and generated poems and highlight which elements from each original poem were integrated into your hip-hop lyrics there, demonstrating parallelization and how multiple specialized outputs enhance the final creative synthesis. So the final output should consist of original poems, the song and the analysis.";

const choiceExplanations = {
  requestHandler:
    "The request involves creating multiple poems and a song, followed by an analysis, which is a complex, multi-step task.",
  problemDecomposer: "",
  steps: [
    // {
    //   stepNo: 1,
    //   agentConfig:
    //     "The task requires retrieving field metadata and agronomic details using the field_info_api tool. There is no existing agent config, so a new agent config needs to be created to handle this task.",
    //   taskConfig:
    //     "There are no existing task configs that match the requirement to retrieve field metadata and agronomic details. Therefore, a new task config needs to be created.",
    //   taskRun: `The task config "retrieve_field_metadata" exists and the input can be completed using the non-dependent field "field name or ID" provided in the task step.`,
    // },
  ],
} satisfies ChoiceExplanations;

export const requestHandlerOutput = `{
  "requestType": "creative_writing",
  "primaryGoal": "Generate four poems, a hip-hop song, and an analysis of thematic integration",
  "userParameters": {
    "poemTopics": ["vikings", "neutrinos", "marshmallows", "cats"],
    "songStyle": "hip-hop",
    "analysisFocus": "highlighting thematic and imagery integration"
  },
  "requiredComponents": [
    "create four distinct poems on specified topics",
    "compose a hip-hop song incorporating elements from each poem",
    "analyze and highlight the integration of poem elements into the song"
  ],
  "expectedDeliverables": "Four poems, one hip-hop song, and an analysis of thematic integration"
}`;

const fixtures = new WorkflowComposeFixture(
  title,
  prompt,
  choiceExplanations,
  requestHandlerOutput,
  taskStepsFixtures,
  toolsFixtures,
  agentsFixtures,
  tasksFixtures,
  taskRunsFixtures,
);

export default fixtures;
