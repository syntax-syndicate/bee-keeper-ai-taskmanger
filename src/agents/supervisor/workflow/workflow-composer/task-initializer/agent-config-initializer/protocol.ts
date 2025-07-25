import * as laml from "@/laml/index.js";

export const protocol = laml.ProtocolBuilder.new()
  .text({
    name: "RESPONSE_CHOICE_EXPLANATION",
    description:
      "Justify your RESPONSE_TYPE decision based on agent scope, input/output structure, and tool availability—not on specific runtime values like names or topics.",
  })
  .constant({
    name: "RESPONSE_TYPE",
    values: [
      "CREATE_AGENT_CONFIG",
      "UPDATE_AGENT_CONFIG",
      "SELECT_AGENT_CONFIG",
      "AGENT_CONFIG_UNAVAILABLE",
    ] as const,
    description:
      "Valid values: CREATE_AGENT_CONFIG | UPDATE_AGENT_CONFIG | SELECT_AGENT_CONFIG | AGENT_CONFIG_UNAVAILABLE",
  })
  .comment({
    comment:
      "Follow by one of the possible responses format based on the chosen response type",
  })
  .object({
    name: "RESPONSE_CREATE_AGENT_CONFIG",
    isOptional: true,
    attributes: laml.ProtocolBuilder.new()
      .text({
        name: "agent_type",
        description: "Name of the new agent config type in snake_case",
      })
      .array({
        name: "tools",
        isOptional: true,
        description:
          "list of selected tools identifiers that this agent type can utilize",
        type: "text",
      })
      .text({
        name: "description",
        description:
          "Description of the agent's behavior and purpose of his existence",
      }),
  })
  .object({
    name: "RESPONSE_UPDATE_AGENT_CONFIG",
    isOptional: true,
    attributes: laml.ProtocolBuilder.new()
      .text({
        name: "agent_type",
        description: "Name of an existing agent config type to update",
      })
      .array({
        name: "tools",
        isOptional: true,
        description:
          "list of selected tools identifiers that this agent type can utilize",
        type: "text",
      })
      .text({
        name: "description",
        isOptional: true,
        description:
          "Description of the agent's behavior and purpose of his existence",
      }),
  })
  .object({
    name: "RESPONSE_SELECT_AGENT_CONFIG",
    isOptional: true,
    attributes: laml.ProtocolBuilder.new().text({
      name: "agent_type",
      description: "Name of the selected agent config type",
    }),
  })
  .object({
    name: "RESPONSE_AGENT_CONFIG_UNAVAILABLE",
    isOptional: true,
    attributes: laml.ProtocolBuilder.new().text({
      name: "explanation",
      description:
        "Brief reason you are not able to create, update or select an existing agent config",
    }),
  })
  .build();
