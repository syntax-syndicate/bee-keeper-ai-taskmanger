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
  - [Architecture](#architecture)
  - [Operation Modes](#operation-modes)
    - [Interactive Mode](#interactive-mode)
    - [Autonomous Mode](#autonomous-mode)
  - [Key Benefits](#key-benefits)
  - [Best Practices](#best-practices)

## Overview

BeeAI Supervisor is a multi-agent AI system designed to orchestrate specialized AI agents for completing complex tasks. While the name might suggest a single agent, it actually refers to the entire system - a comprehensive runtime that includes a Supervisor Agent at its core which serves as your primary interface, helping to configure, manage, and coordinate other specialized agents.

Think of BeeAI Supervisor as a hive of AI agents, with the Supervisor agent acting as the queen bee, orchestrating the activities of worker agents to efficiently accomplish your goals. This system enables you to harness the collective intelligence of multiple specialized agents through a single, coordinated interface.

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

## Architecture
[Full documentation](https://cheerful-sodalite-38a.notion.site/BeeAI-Supervisor-1ab3b270a700801cabadc0eb80ae9ddb)

## Operation Modes

The system can be operated in two distinct modes:

### Interactive Mode

In this mode, you engage in an ongoing conversation with the Supervisor in Chat UI:

```bash
mise supervisor:chat
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
