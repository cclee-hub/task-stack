# task-stack

A task context stack for single-person, multi-project workflows.

Not just for coding — manage any kind of daily tasks. When you switch between projects or contexts frequently, `task-stack` tracks what you're working on, where you came from, and where you need to go back to.

## Install

```bash
npm install -g @cclee/task-stack
```

## Usage

```bash
task push "build login page"  # Push a new task onto the stack
task pop                      # Pop current task, return to previous
task note "need API change"   # Append a note to current task
task stack                    # View the full task chain
task log                      # View completed tasks
task projects                 # View / manage project list
task projects add <name>      # Add a new project
task clear                    # Clear the stack
```

## Claude Code Integration

Can be registered as a [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill for natural language invocation:

> "task push build login page"

## Data Storage

Task data is stored in `~/.task-stack.json`.

## About the Author

- English Site: https://aidevhub.ai/about
- Upwork: https://www.upwork.com/freelancers/~010ab5ec29d8f4ff3f
- LinkedIn: https://www.linkedin.com/in/cc-lee-9b0b113bb/
