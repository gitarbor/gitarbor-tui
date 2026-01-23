# OpenCode Agents Skill

A comprehensive skill for creating and configuring custom OpenCode agents with specialized prompts, tools, permissions, and models.

## What this skill provides

This skill helps you:
- Create new OpenCode agents (primary and subagents)
- Configure agent tools, permissions, and models
- Understand agent modes and use cases
- Design specialized agents for specific workflows
- Manage agent configurations in JSON or Markdown format

## Skill structure

```
opencode-agents/
├── SKILL.md                          # Main skill instructions
├── references/
│   └── REFERENCE.md                  # Comprehensive configuration reference
└── assets/
    └── templates/
        ├── read-only-reviewer.md     # Code reviewer without write access
        ├── security-auditor.json     # Security-focused agent
        ├── docs-writer.md            # Documentation agent
        ├── careful-dev.json          # Development agent with approvals
        └── prompts/
            └── security-auditor.txt  # Security auditor custom prompt
```

## When to use

This skill activates when you:
- Ask to create a new agent
- Want to modify agent configurations
- Mention agent modes, permissions, or tools
- Need specialized agents for code review, security, documentation, etc.
- Ask about agent switching or task delegation

## Example templates

### Read-only Code Reviewer
A subagent that reviews code using git commands without making any modifications. Perfect for getting feedback before implementing changes.

**File**: `assets/templates/read-only-reviewer.md`

### Security Auditor
A security-focused subagent with access to grep and git commands, plus web fetching for CVE lookups. Includes comprehensive security audit instructions.

**Files**: 
- `assets/templates/security-auditor.json`
- `assets/templates/prompts/security-auditor.txt`

### Documentation Writer
A subagent specialized in writing clear, comprehensive documentation without bash access.

**File**: `assets/templates/docs-writer.md`

### Careful Developer
A primary agent that asks for approval before making file changes or running risky commands. Safe mode for development.

**File**: `assets/templates/careful-dev.json`

## Quick start

### Creating an agent with the CLI

```bash
opencode agent create
```

This interactive command will guide you through creating a new agent.

### Creating an agent manually

1. Choose configuration format (JSON or Markdown)
2. For Markdown, create a file in `.opencode/agents/` or `~/.config/opencode/agents/`
3. Add frontmatter with configuration
4. Write agent instructions in Markdown body

Example:

```markdown
---
description: Reviews code for quality
mode: subagent
tools:
  write: false
  edit: false
---

You are a code reviewer. Focus on quality and best practices.
```

### Using a template

Copy one of the templates from `assets/templates/` to your agents directory:

```bash
# Global
cp .opencode/skills/opencode-agents/assets/templates/read-only-reviewer.md \
   ~/.config/opencode/agents/

# Project-specific
cp .opencode/skills/opencode-agents/assets/templates/read-only-reviewer.md \
   .opencode/agents/
```

## Key concepts

### Agent types
- **Primary agents**: Main assistants (switch with Tab key)
- **Subagents**: Specialized helpers (invoked via @ mention or automatically)

### Configuration locations
- Global: `~/.config/opencode/opencode.json` or `~/.config/opencode/agents/*.md`
- Project: `.opencode/config.json` or `.opencode/agents/*.md`

### Permissions
- `allow`: No approval needed
- `ask`: Prompt before execution
- `deny`: Completely disable

### Common patterns
- **Read-only**: Disable write, edit, and bash tools
- **Git-only**: Allow only git commands in bash
- **Careful**: Set permissions to "ask" for dangerous operations
- **Specialized**: Custom prompts with focused tool access

## Resources

- **Main instructions**: `SKILL.md`
- **Complete reference**: `references/REFERENCE.md`
- **Example templates**: `assets/templates/`
- **OpenCode docs**: https://opencode.ai/docs/agents/

## Contributing

Have a useful agent configuration? Consider adding it as a template to help others!

1. Create your agent configuration
2. Test it thoroughly
3. Add it to `assets/templates/`
4. Update this README with a description

## License

MIT
