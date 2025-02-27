# 🐝 BeeAI Supervisor

> [!WARNING]
> [PRE-Alpha] This repository contains the beeai supervisor which is still under a rapid development. Please treat it as
> highly experimental and expect breaking changes often. Reach out on discord if you'd like to contribute or get 
> involved in the discussions: [join discord](https://discord.gg/AZFrp3UF5k)


## Table of Contents
- [🐝 BeeAI Supervisor](#-beeai-supervisor)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Development setup](#development-setup)
    - [Installation](#installation)
  - [Platform Architecture](#platform-architecture)
    - [Supervisor-Driven Workflow](#supervisor-driven-workflow)
    - [Workspace Persistence](#workspace-persistence)
  - [Monitor UI](#monitor-ui)
    - [Agent Monitor](#agent-monitor)
    - [Task Monitor](#task-monitor)
  - [Platform Operation Modes](#platform-operation-modes)
    - [Interactive Mode](#interactive-mode)
    - [Autonomous Mode](#autonomous-mode)
  - [Key Benefits](#key-benefits)
  - [Best Practices](#best-practices)

## Overview

BeeAI Supervisor is a multi-agent AI platform designed to orchestrate specialized AI agents for completing complex tasks. While the name might suggest a single agent, it actually refers to the entire system - a comprehensive platform that includes a Supervisor Agent at its core which serves as your primary interface, helping to configure, manage, and coordinate other specialized agents.

Think of BeeAI Supervisor as a hive of AI agents, with the Supervisor agent acting as the queen bee, orchestrating the activities of worker agents to efficiently accomplish your goals. This platform enables you to harness the collective intelligence of multiple specialized agents through a single, coordinated interface.

## Development setup

### Installation

This project uses [Mise-en-place](https://mise.jdx.dev/) as a manager of tool versions (`python`, `uv`, `nodejs`, `pnpm` etc.), as well as a task runner and environment manager. Mise will download all the needed tools automatically -- you don't need to install them yourself.

Clone this project, then run these setup steps:

```sh
brew install mise  # more ways to install: https://mise.jdx.dev/installing-mise.html
mise trust
mise install
mise build
```

After setup, you can use:
- `mise run` to list tasks and select one interactively to run
- `mise <task-name>` to run a task
- `mise x -- <command>` to run a project tool -- for example `mise x -- uv add <package>`

> [!TIP]
> If you want to run tools directly without the `mise x --` prefix, you need to activate a shell hook:
> - Bash: `eval "$(mise activate bash)"` (add to `~/.bashrc` to make permanent)
> - Zsh: `eval "$(mise activate zsh)"` (add to `~/.zshrc` to make permanent)
> - Fish: `mise activate fish | source` (add to `~/.config/fish/config.fish` to make permanent)
> - Other shells: [documentation](https://mise.jdx.dev/installing-mise.html#shells)

## Platform Architecture

### Supervisor-Driven Workflow

The platform is designed for interactive development through conversation with the Supervisor Agent. This allows you to:

- Iteratively develop the best configuration of agents and tasks
- Define specialized agents for specific types of work
- Create task templates that can be instantiated with specific inputs
- Coordinate complex workflows through intelligent task orchestration

### Workspace Persistence

All your work with the platform is automatically persisted in workspaces:

- The default workspace is located at `./output/workspaces/default`
- Agent and task configurations are stored in the `configs` folder
- Multiple workspaces can be maintained for different projects or purposes

## Monitor UI

The platform includes a monitoring interface with two main views:

### Agent Monitor

The Agent Monitor displays:

- **Agent Pools**: List of all agent configurations organized by type (supervisor/operator) and name
  - Each entry shows active/total agents (e.g., `researcher [3/11]`)
  - Clicking on an agent pool displays its details and versions

- **Agent Versions**: When an agent pool is selected, shows all versions of that agent
  - Each entry shows active/total agents for that version (e.g., `v2 [2/10]`)
  - Multiple versions allow for graceful updates and testing

- **Agent Instances**: When a version is selected, displays all running instances
  - Each entry shows the specific agent ID (e.g., `researcher [1] v2`)
  - Clicking an agent instance reveals its detailed status

Example hierarchy:
```
Agent Pools:
├── supervisor
│   └── boss [1/1]
└── operator
    └── researcher [3/11]  <-- Selected

Agent Versions:
├── v2 [2/10]  <-- Selected
└── v1 [1/1]

Agent Instances:
├── researcher [1] v2
└── researcher [2] v2
```

### Task Monitor

The Task Monitor provides visibility into task configurations and running task instances throughout the platform:

- **Task Configs**: List of all task configurations organized by type
  - Each entry shows the task type name (e.g., `poem_generation`)
  - Clicking on a task config displays its details and runs

- **Task Runs**: When a task config is selected, shows all running and completed instances
  - Each entry shows the specific task run ID (e.g., `task:poem_generation[3]:1`)
  - Status indicators show whether tasks are pending, in-progress, completed, or failed
  - Includes information about which agent is assigned to each task run

- **Task Details**: When a task run is selected, displays detailed information including:
  - Input parameters and their values
  - Current status and execution time
  - Output results (for completed tasks)
  - Associated agent information

Example hierarchy:
```
Task Configs:
├── poem_generation  <-- Selected
├── text_summarization
└── research_query

Task Runs:
├── task:poem_generation[3]:1  <-- Selected
├── task:poem_generation[2]:1 (Completed)
└── task:poem_generation[1]:1 (Completed)

Task Details:
├── Input: "sunset over mountains"
├── Status: In Progress
├── Assigned to: operator:poem_generator[2]:3
└── Execution time: 00:01:23
```

## Platform Operation Modes

The platform can be operated in two distinct modes:

### Interactive Mode

In this mode, you engage in an ongoing conversation with the Supervisor:

```bash
mise supervisor
```

This command starts the platform in interactive mode where you can:
1. **Start a Conversation**: Interact with the Supervisor Agent to describe your goals
2. **Iterative Configuration**: Work with the Supervisor to define appropriate agent and task configurations
3. **Monitor Execution**: Use the Monitor UI to track agent activity and task progress
4. **Refine Your Approach**: Based on results, work with the Supervisor to improve your configuration

To monitor the platform's operation while in interactive mode, open another terminal window and run:

```bash
mise monitor
```

This launches the Monitor UI that allows you to observe agent activities and task progress in real-time.

### Autonomous Mode

For one-off tasks or batch processing, you can run the platform in autonomous mode:

```bash
mise supervisor <<< "Hi, can you create a poem about each of these topics: bee, hive, queen, sun, flowers?"
```

In this mode:
- The Supervisor Agent processes your request autonomously without further interaction
- The platform creates necessary agents and tasks to fulfill the request
- Results are returned when processing is complete
- The platform shuts down after completing the request

To monitor the process while in autonomous mode, open another terminal window and run:

```bash
mise monitor
```

This allows you to observe the platform's operations as it works on your request.

Autonomous mode is ideal for scripted operations, batch processing, or simple one-off requests that don't require iterative development.

## Key Benefits

- **Iterative Development**: Refine your agent ecosystem through conversation
- **Persistence**: All configurations are automatically saved for future use
- **Visibility**: Monitor UI provides real-time insights into system operation
- **Specialized Agents**: Create purpose-built agents for specific tasks
- **Intelligent Orchestration**: Complex workflows are managed automatically

## Best Practices

- Begin with a clear goal in mind when working with the Supervisor
- Start with simple tasks before building more complex workflows
- Use the Monitor UI to identify bottlenecks or underutilized resources
- Reuse existing agent and task configurations when possible
- Consider creating specialized agent configurations for recurring task types

This platform combines the power of specialized AI agents with the flexibility of interactive configuration, all managed through natural conversation with the Supervisor Agent.