---
name: opencode-agents
description: Create and configure custom OpenCode agents (primary and subagents) with specialized prompts, tools, permissions, and models. Use when the user wants to create, modify, or configure OpenCode agents, or mentions agent modes, tool permissions, or task delegation.
license: MIT
metadata:
  author: opencode-community
  version: "1.0"
  category: configuration
---

## When to use this skill

Use this skill when:
- User asks to create a new OpenCode agent
- User wants to modify or configure an existing agent
- User mentions agent modes (primary, subagent)
- User wants to control tool permissions or access
- User needs specialized agents for specific tasks (review, security, docs, etc.)
- User mentions agent switching, task delegation, or @ mentions
- User wants to customize prompts or models for different workflows

## What OpenCode agents are

OpenCode agents are specialized AI assistants that can be configured for specific tasks and workflows. They allow you to create focused tools with custom prompts, models, and tool access.

### Agent types

**Primary agents**: Main assistants you interact with directly. Switch between them using **Tab** key or configured keybind.
- Examples: Build (default with all tools), Plan (restricted for analysis)

**Subagents**: Specialized assistants invoked by primary agents or via **@ mention**.
- Examples: General (multi-step tasks), Explore (read-only codebase exploration)

### Built-in agents

1. **Build** (primary): Default agent with all tools enabled for full development work
2. **Plan** (primary): Restricted agent for planning/analysis without making changes
3. **General** (subagent): General-purpose for complex questions and multi-step tasks
4. **Explore** (subagent): Fast, read-only agent for exploring codebases

## Configuration methods

Agents can be configured in two ways:

### 1. JSON configuration

Add agents to `opencode.json` config file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "agent-name": {
      "description": "What the agent does and when to use it",
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "temperature": 0.3,
      "prompt": "{file:./prompts/agent-name.txt}",
      "tools": {
        "write": true,
        "edit": true,
        "bash": true
      },
      "permission": {
        "edit": "ask",
        "bash": {
          "*": "ask",
          "git status *": "allow"
        }
      }
    }
  }
}
```

### 2. Markdown files

Place markdown files in:
- Global: `~/.config/opencode/agents/`
- Per-project: `.opencode/agents/`

The filename becomes the agent name (e.g., `review.md` creates `review` agent).

```markdown
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
permission:
  edit: deny
  bash:
    "*": ask
    "git diff": allow
    "git log*": allow
  webfetch: deny
---

You are in code review mode. Focus on:
- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

## Configuration options

### Required fields

#### description
Brief description of what the agent does and when to use it.
- **Required**: Yes (for custom agents)
- **Constraints**: Clear, actionable description with keywords

```json
{
  "agent": {
    "review": {
      "description": "Reviews code for best practices and potential issues"
    }
  }
}
```

### Optional fields

#### mode
Determines how the agent can be used.
- **Values**: `"primary"`, `"subagent"`, `"all"` (default if not specified)
- **Primary**: Main assistants you interact with directly (switchable via Tab)
- **Subagent**: Specialized assistants invoked by other agents or @ mention

```json
{
  "agent": {
    "review": {
      "mode": "subagent"
    }
  }
}
```

#### model
Override the model for this agent.
- **Format**: `provider/model-id`
- **Examples**: `anthropic/claude-sonnet-4-20250514`, `openai/gpt-5`, `opencode/gpt-5.1-codex`
- Primary agents use globally configured model if not specified
- Subagents use the invoking primary agent's model if not specified

```json
{
  "agent": {
    "plan": {
      "model": "anthropic/claude-haiku-4-20250514"
    }
  }
}
```

#### temperature
Control randomness and creativity of responses.
- **Range**: 0.0 to 1.0
- **0.0-0.2**: Very focused and deterministic (code analysis, planning)
- **0.3-0.5**: Balanced with some creativity (general development)
- **0.6-1.0**: More creative and varied (brainstorming, exploration)
- **Default**: 0 for most models, 0.55 for Qwen models

```json
{
  "agent": {
    "analyze": {
      "temperature": 0.1
    },
    "brainstorm": {
      "temperature": 0.7
    }
  }
}
```

#### prompt
Custom system prompt file for this agent.
- **Format**: `{file:./path/to/prompt.txt}`
- **Path**: Relative to config file location
- Works for both global and project-specific configs

```json
{
  "agent": {
    "review": {
      "prompt": "{file:./prompts/code-review.txt}"
    }
  }
}
```

#### tools
Control which tools are available to this agent.
- **Values**: `true` (enable), `false` (disable)
- Can use wildcards: `"mymcp_*": false`
- Agent-specific config overrides global config

```json
{
  "agent": {
    "plan": {
      "tools": {
        "write": false,
        "edit": false,
        "bash": false,
        "mymcp_*": false
      }
    }
  }
}
```

#### permission
Manage what actions an agent can take.
- **Values**: `"ask"` (prompt for approval), `"allow"` (no approval needed), `"deny"` (disable)
- **Supported tools**: `edit`, `bash`, `webfetch`
- Can set permissions for specific bash commands with glob patterns
- Last matching rule takes precedence

```json
{
  "agent": {
    "build": {
      "permission": {
        "edit": "ask",
        "bash": {
          "*": "ask",
          "git status *": "allow",
          "git diff *": "allow",
          "git push": "ask"
        },
        "webfetch": "allow"
      }
    }
  }
}
```

##### Task permissions
Control which subagents an agent can invoke via the Task tool.
- Uses glob patterns for flexible matching
- `"deny"` removes subagent from Task tool description
- Last matching rule wins
- Users can always invoke any subagent directly via @ mention

```json
{
  "agent": {
    "orchestrator": {
      "permission": {
        "task": {
          "*": "deny",
          "orchestrator-*": "allow",
          "code-reviewer": "ask"
        }
      }
    }
  }
}
```

#### maxSteps
Maximum number of agentic iterations before text-only response.
- **Type**: Number
- Controls cost by limiting iterations
- Agent receives summary prompt when limit reached
- If not set, agent continues until model stops or user interrupts

```json
{
  "agent": {
    "quick-thinker": {
      "maxSteps": 5
    }
  }
}
```

#### disable
Disable the agent.
- **Values**: `true` (disable), `false` (enable)

```json
{
  "agent": {
    "review": {
      "disable": true
    }
  }
}
```

#### hidden
Hide subagent from @ autocomplete menu.
- **Values**: `true` (hidden), `false` (visible)
- Only applies to `mode: subagent`
- Can still be invoked programmatically via Task tool

```json
{
  "agent": {
    "internal-helper": {
      "mode": "subagent",
      "hidden": true
    }
  }
}
```

#### Additional provider-specific options
Any other options are passed directly to the provider.
- Example: OpenAI reasoning models support `reasoningEffort`, `textVerbosity`

```json
{
  "agent": {
    "deep-thinker": {
      "model": "openai/gpt-5",
      "reasoningEffort": "high",
      "textVerbosity": "low"
    }
  }
}
```

## Creating agents step-by-step

### Using the CLI command

The fastest way to create an agent:

```bash
opencode agent create
```

This interactive command will:
1. Ask where to save (global or project-specific)
2. Prompt for description
3. Generate appropriate system prompt and identifier
4. Let you select which tools can be accessed
5. Create a markdown file with the configuration

### Manual creation process

#### 1. Gather requirements
Ask the user:
- What should the agent do?
- When should it be used?
- Should it be a primary agent or subagent?
- What tools does it need access to?
- Should any operations require approval?
- What model is best suited for the task?
- Should it have a custom prompt?

#### 2. Choose agent name
- Use lowercase with hyphens (for markdown files)
- Keep it short and descriptive
- Examples: `review`, `security-audit`, `docs-writer`

#### 3. Write clear description
Include:
- What the agent does
- When to use it
- Keywords for agent matching

Good: "Reviews code for best practices and potential issues"
Poor: "Helps with code"

#### 4. Select mode
- **Primary**: User switches to it directly (Tab key)
- **Subagent**: Invoked by other agents or @ mention
- **All**: Can be used both ways (default)

#### 5. Configure tools and permissions
Decide which tools to enable/disable:
- Write operations (`write`, `edit`)
- Shell commands (`bash`)
- Web fetching (`webfetch`)
- MCP tools (wildcards like `mymcp_*`)

Set permissions:
- `allow`: No approval needed
- `ask`: Prompt before execution
- `deny`: Completely disable

#### 6. Choose model and temperature
- Fast models for planning: `anthropic/claude-haiku-4-20250514`
- Capable models for implementation: `anthropic/claude-sonnet-4-20250514`
- Temperature: lower (0.1) for focused work, higher (0.7) for creative tasks

#### 7. Write custom prompt (optional)
If the agent needs specialized instructions:
1. Create a prompts directory (e.g., `./prompts/`)
2. Write a `.txt` or `.md` file with instructions
3. Reference it: `{file:./prompts/agent-name.txt}`

#### 8. Decide on configuration format
- **JSON**: Better for complex configs, good for global agents
- **Markdown**: Better for prompt-heavy agents, good for project-specific

#### 9. Create the configuration

For Markdown (recommended for most use cases):

```bash
# Global
mkdir -p ~/.config/opencode/agents
touch ~/.config/opencode/agents/agent-name.md

# Project-specific
mkdir -p .opencode/agents
touch .opencode/agents/agent-name.md
```

For JSON:

```bash
# Edit opencode.json (global or project .opencode/config.json)
```

#### 10. Validate configuration
Check that:
- Description is clear and keyword-rich
- Mode is appropriate for use case
- Tools match agent's purpose
- Permissions prevent unwanted actions
- Model is appropriate for task complexity
- Temperature matches desired creativity level
- Custom prompt (if any) is well-structured

## Common agent patterns

### Read-only analysis agent

```json
{
  "agent": {
    "analyzer": {
      "description": "Analyzes code for patterns and insights without making changes",
      "mode": "subagent",
      "temperature": 0.1,
      "tools": {
        "write": false,
        "edit": false,
        "bash": false
      }
    }
  }
}
```

### Security auditor

```markdown
---
description: Performs security audits and identifies vulnerabilities
mode: subagent
tools:
  write: false
  edit: false
permission:
  bash:
    "*": deny
    "grep *": allow
    "git log*": allow
---

You are a security expert. Focus on identifying potential security issues.

Look for:
- Input validation vulnerabilities
- Authentication and authorization flaws
- Data exposure risks
- Dependency vulnerabilities
- Configuration security issues
```

### Documentation writer

```json
{
  "agent": {
    "docs-writer": {
      "description": "Writes and maintains project documentation",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "tools": {
        "bash": false
      },
      "prompt": "{file:./prompts/docs-writer.txt}"
    }
  }
}
```

### Careful build agent with approvals

```json
{
  "agent": {
    "careful-build": {
      "description": "Development agent that asks before making changes",
      "mode": "primary",
      "permission": {
        "edit": "ask",
        "bash": {
          "*": "ask",
          "git status": "allow",
          "git diff": "allow"
        }
      }
    }
  }
}
```

### Specialized reviewer with git access

```markdown
---
description: Reviews code changes using git history and diffs
mode: subagent
temperature: 0.1
tools:
  write: false
  edit: false
permission:
  bash:
    "*": deny
    "git diff*": allow
    "git log*": allow
    "git show*": allow
---

You are a code reviewer with access to git history.

Review process:
1. Use `git diff` to see changes
2. Use `git log` for context
3. Analyze for quality, security, performance
4. Provide constructive feedback
```

### Orchestrator with limited subagent access

```json
{
  "agent": {
    "orchestrator": {
      "description": "Coordinates multiple specialized agents for complex tasks",
      "mode": "primary",
      "permission": {
        "task": {
          "*": "deny",
          "explore": "allow",
          "docs-writer": "allow",
          "security-audit": "ask"
        }
      }
    }
  }
}
```

## Agent usage guide

### Switching primary agents
- Use **Tab** key to cycle through primary agents
- Or use configured `switch_agent` keybind

### Invoking subagents
- **Automatic**: Primary agents invoke based on descriptions
- **Manual**: @ mention in message (e.g., `@review please check this code`)

### Navigating between sessions
When subagents create child sessions:
- **<Leader>+Right**: Cycle forward (parent → child1 → child2 → parent)
- **<Leader>+Left**: Cycle backward (parent ← child1 ← child2 ← parent)

## Use cases by agent type

### Primary agents
- **Build**: Full development work with all tools
- **Plan**: Analysis and planning without changes
- **Careful-build**: Development with approval prompts
- **Fast-build**: Quick iterations with faster model

### Subagents
- **Review**: Code review with read-only access
- **Debug**: Investigation with bash and read tools
- **Docs**: Documentation writing without system commands
- **Security**: Security audits with limited tool access
- **Explore**: Fast codebase exploration (built-in)
- **General**: Multi-step complex tasks (built-in)

## Best practices

### Agent design
1. **Single responsibility**: Each agent should have a clear, focused purpose
2. **Descriptive names**: Use names that clearly indicate the agent's role
3. **Rich descriptions**: Include what the agent does AND when to use it
4. **Appropriate permissions**: Grant only the tools needed for the task
5. **Temperature matching**: Lower for deterministic tasks, higher for creative work

### Tool configuration
1. **Principle of least privilege**: Disable tools not needed for the agent's purpose
2. **Use permissions wisely**: `ask` for dangerous operations, `allow` for safe ones
3. **Bash command granularity**: Allow specific safe commands, ask for risky ones
4. **Test thoroughly**: Ensure the agent can complete its tasks with given tools

### Prompt engineering
1. **Clear instructions**: Be specific about what the agent should do
2. **Include examples**: Show expected behavior and output format
3. **Edge case handling**: Document how to handle unusual situations
4. **Consistent style**: Match the project's coding standards and conventions

### Organization
1. **Global vs project**: Global for general-purpose, project for specific needs
2. **Markdown for prompts**: Use markdown format when custom prompts are primary
3. **JSON for config**: Use JSON when managing multiple related agents
4. **Version control**: Commit project-specific agents to git

### Performance
1. **Use fast models for planning**: Haiku for analysis, Sonnet for implementation
2. **Set maxSteps**: Limit iterations for cost control
3. **Progressive disclosure**: Keep agents focused, use task delegation
4. **Cache-friendly prompts**: Shorter, stable prompts cache better

## Troubleshooting

### Agent not appearing
- Check `disable: false` is set (or option not present)
- For subagents, verify not `hidden: true`
- Ensure config file is in correct location
- Validate JSON syntax (if using JSON config)

### Agent can't perform needed actions
- Check `tools` configuration includes needed tools
- Verify `permission` settings allow the operations
- For subagents, check parent's `permission.task` settings
- Ensure model has capability for the task

### Agent asks for approval too often
- Change permission from `ask` to `allow` for safe operations
- Use glob patterns to allow specific bash commands
- Consider creating a separate agent without restrictions

### Agent makes unwanted changes
- Set `permission.edit` to `ask` or `deny`
- Disable `write` tool if not needed
- Review custom prompt for overly aggressive instructions

### Agent not invoking subagents
- Check subagent's `description` is clear and keyword-rich
- Verify parent's `permission.task` allows the subagent
- Ensure subagent is not `hidden: true`
- Consider manual invocation with @ mention

## Example configurations

See [assets/templates/](assets/templates/) for complete example configurations:
- `read-only-reviewer.md` - Code reviewer without write access
- `security-auditor.json` - Security-focused agent with limited bash
- `docs-writer.md` - Documentation agent with file access only
- `careful-dev.json` - Development agent with approval prompts

## Resources

- [OpenCode Agents Documentation](https://opencode.ai/docs/agents/)
- [OpenCode Configuration](https://opencode.ai/docs/config/)
- [OpenCode Permissions](https://opencode.ai/docs/permissions/)
- [OpenCode Tools](https://opencode.ai/docs/tools/)
- [OpenCode Models](https://opencode.ai/docs/models/)

Run `opencode models` to see available models for your configured providers.
