# OpenCode Agent Configuration Reference

This document provides comprehensive reference information for configuring OpenCode agents.

## Configuration file locations

### Global configuration
- **macOS/Linux**: `~/.config/opencode/opencode.json`
- **Windows**: `%APPDATA%\opencode\opencode.json`

### Project-specific configuration
- `.opencode/config.json` (in project root)
- `.opencode/agents/*.md` (markdown agent files)

### Agent markdown files
- **Global**: `~/.config/opencode/agents/*.md`
- **Project**: `.opencode/agents/*.md`

## Complete configuration schema

```json
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "agent-name": {
      "description": "string (required)",
      "mode": "primary | subagent | all",
      "model": "provider/model-id",
      "temperature": 0.0,
      "maxSteps": 0,
      "disable": false,
      "hidden": false,
      "prompt": "{file:./path/to/prompt.txt}",
      "tools": {
        "write": true,
        "edit": true,
        "read": true,
        "bash": true,
        "glob": true,
        "grep": true,
        "webfetch": true,
        "task": true,
        "todowrite": true,
        "todoread": true,
        "skill": true,
        "question": true,
        "mcp-tool-name": true,
        "prefix_*": true
      },
      "permission": {
        "edit": "ask | allow | deny",
        "bash": {
          "*": "ask | allow | deny",
          "specific-command *": "ask | allow | deny"
        },
        "webfetch": "ask | allow | deny",
        "task": {
          "*": "ask | allow | deny",
          "subagent-name": "ask | allow | deny"
        }
      }
    }
  }
}
```

## Markdown agent schema

```yaml
---
description: string (required)
mode: primary | subagent | all
model: provider/model-id
temperature: 0.0
maxSteps: 0
disable: false
hidden: false
tools:
  write: true
  edit: true
  bash: true
permission:
  edit: ask | allow | deny
  bash:
    "*": ask
    "git diff": allow
  webfetch: ask | allow | deny
  task:
    "*": deny
    "allowed-subagent": allow
---

Agent instructions go here in Markdown format.
```

## Field reference

### description
- **Type**: String
- **Required**: Yes (for custom agents)
- **Constraints**: 1-1024 characters, non-empty
- **Purpose**: Describes what the agent does and when to use it
- **Best practices**:
  - Include both capabilities and use cases
  - Add keywords for agent matching
  - Be specific and actionable

### mode
- **Type**: String
- **Required**: No
- **Default**: `"all"`
- **Values**: `"primary"`, `"subagent"`, `"all"`
- **Purpose**: Determines how agent can be invoked
  - `primary`: Switchable via Tab key, main conversation
  - `subagent`: Invoked by other agents or @ mention
  - `all`: Can be used as either primary or subagent

### model
- **Type**: String
- **Required**: No
- **Format**: `provider/model-id`
- **Default**: 
  - Primary agents: Global model config
  - Subagents: Invoking agent's model
- **Examples**:
  - `anthropic/claude-sonnet-4-20250514`
  - `anthropic/claude-haiku-4-20250514`
  - `openai/gpt-5`
  - `opencode/gpt-5.1-codex`

### temperature
- **Type**: Number
- **Required**: No
- **Range**: 0.0 to 1.0
- **Default**: 0 (most models), 0.55 (Qwen models)
- **Purpose**: Controls response randomness/creativity
- **Guidelines**:
  - 0.0-0.2: Deterministic, focused (analysis, planning)
  - 0.3-0.5: Balanced (general development)
  - 0.6-1.0: Creative (brainstorming, exploration)

### maxSteps
- **Type**: Number
- **Required**: No
- **Default**: Unlimited
- **Purpose**: Limits agentic iterations for cost control
- **Behavior**: Agent receives summary prompt when limit reached

### disable
- **Type**: Boolean
- **Required**: No
- **Default**: `false`
- **Purpose**: Disable agent without removing configuration

### hidden
- **Type**: Boolean
- **Required**: No
- **Default**: `false`
- **Applies to**: `mode: subagent` only
- **Purpose**: Hide from @ autocomplete menu
- **Note**: Can still be invoked programmatically

### prompt
- **Type**: String
- **Required**: No
- **Format**: `{file:./path/to/prompt.txt}`
- **Purpose**: Custom system prompt file
- **Path**: Relative to config file location
- **Supported formats**: `.txt`, `.md`

### tools
- **Type**: Object
- **Required**: No
- **Purpose**: Control tool availability
- **Values**: `true` (enable), `false` (disable)
- **Wildcards**: Use `*` for pattern matching (e.g., `"mcp_*": false`)
- **Inheritance**: Agent config overrides global config
- **Available tools**:
  - `write`: Create new files
  - `edit`: Modify existing files
  - `read`: Read file contents
  - `bash`: Execute shell commands
  - `glob`: Find files by pattern
  - `grep`: Search file contents
  - `webfetch`: Fetch web content
  - `task`: Invoke subagents
  - `todowrite`: Manage todo list
  - `todoread`: Read todo list
  - `skill`: Load agent skills
  - `question`: Ask user questions
  - MCP tools: Named by MCP server

### permission
- **Type**: Object
- **Required**: No
- **Purpose**: Control what actions require approval
- **Values**: 
  - `"ask"`: Prompt for approval
  - `"allow"`: No approval needed
  - `"deny"`: Completely disable
- **Inheritance**: Agent config overrides global config

#### permission.edit
- **Type**: String
- **Values**: `"ask"`, `"allow"`, `"deny"`
- **Purpose**: Control file editing operations

#### permission.bash
- **Type**: String or Object
- **Simple format**: `"ask" | "allow" | "deny"` (applies to all commands)
- **Complex format**: Object with glob patterns
  ```json
  {
    "bash": {
      "*": "ask",
      "git status": "allow",
      "git diff*": "allow",
      "git push*": "ask",
      "rm *": "deny"
    }
  }
  ```
- **Pattern matching**: Last matching rule wins
- **Order matters**: Put `*` first, specific rules after

#### permission.webfetch
- **Type**: String
- **Values**: `"ask"`, `"allow"`, `"deny"`
- **Purpose**: Control web content fetching

#### permission.task
- **Type**: Object
- **Purpose**: Control subagent invocation
- **Format**: Map of subagent names to permission levels
  ```json
  {
    "task": {
      "*": "deny",
      "allowed-*": "allow",
      "maybe-subagent": "ask"
    }
  }
  ```
- **Behavior**: `"deny"` removes subagent from Task tool description
- **User override**: Users can always @ mention any subagent
- **Pattern matching**: Glob patterns supported, last match wins

## Provider-specific options

Any additional fields in agent config are passed to the provider.

### OpenAI reasoning models
```json
{
  "agent": {
    "deep-thinker": {
      "model": "openai/gpt-5",
      "reasoningEffort": "low | medium | high",
      "textVerbosity": "low | medium | high"
    }
  }
}
```

### Other providers
Check your provider's documentation for available parameters.

## Agent naming conventions

### JSON config
- Use lowercase with hyphens
- Examples: `review`, `security-audit`, `docs-writer`

### Markdown files
- Filename becomes agent name
- Use lowercase with hyphens
- Examples: `review.md`, `security-audit.md`, `docs-writer.md`

## Configuration precedence

1. **Agent-specific config** (highest priority)
2. **Project-specific global config**
3. **User global config** (lowest priority)

For tools and permissions:
- Agent config overrides global config
- Within agent bash permissions, last matching glob pattern wins

## Validation checklist

- [ ] Description is clear and includes when to use
- [ ] Mode is appropriate (primary/subagent/all)
- [ ] Model is suitable for task complexity
- [ ] Temperature matches desired creativity
- [ ] Tools include everything needed
- [ ] Permissions prevent unwanted actions
- [ ] Bash glob patterns are ordered correctly (*first, specific last)
- [ ] Task permissions don't accidentally block needed subagents
- [ ] Custom prompt file exists at specified path
- [ ] JSON syntax is valid (if using JSON)
- [ ] YAML frontmatter is valid (if using markdown)

## Common patterns

### Read-only agent
```json
{
  "tools": {
    "write": false,
    "edit": false,
    "bash": false
  }
}
```

### Git-only agent
```json
{
  "permission": {
    "bash": {
      "*": "deny",
      "git *": "allow"
    }
  },
  "tools": {
    "write": false,
    "edit": false
  }
}
```

### Careful agent (asks for approval)
```json
{
  "permission": {
    "edit": "ask",
    "bash": {
      "*": "ask",
      "git status": "allow",
      "git diff": "allow"
    }
  }
}
```

### Orchestrator (limited subagent access)
```json
{
  "permission": {
    "task": {
      "*": "deny",
      "explore": "allow",
      "review": "allow"
    }
  }
}
```

## Troubleshooting

### Agent not showing up
- Check `disable: false` or option not set
- Verify mode is correct (primary vs subagent)
- Check `hidden: false` for subagents
- Validate file location (global vs project)
- Check JSON/YAML syntax

### Can't perform needed actions
- Verify tool is enabled in `tools` section
- Check `permission` settings
- For subagents, check parent's `permission.task`
- Ensure model has required capabilities

### Too many approval prompts
- Change `permission` from `ask` to `allow`
- Add specific bash commands with `allow`
- Consider separate unrestricted agent

### Making unwanted changes
- Set `permission.edit` to `ask` or `deny`
- Disable `write` tool
- Review and tighten custom prompt
- Lower temperature for more focused behavior

## See also

- [OpenCode Agents Documentation](https://opencode.ai/docs/agents/)
- [OpenCode Permissions](https://opencode.ai/docs/permissions/)
- [OpenCode Tools](https://opencode.ai/docs/tools/)
- [OpenCode Models](https://opencode.ai/docs/models/)
