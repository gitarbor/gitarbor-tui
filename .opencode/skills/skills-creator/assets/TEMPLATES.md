# Skill Templates

Quick-start templates for creating Agent Skills.

## Template 1: Minimal Skill

Use for simple, instruction-only skills.

```markdown
---
name: skill-name
description: Brief description of what this skill does and when to use it (include keywords).
---

## When to use this skill
Use when...

## Instructions
1. First step
2. Second step
3. Third step

## Examples
Example input:
\`\`\`
Sample input
\`\`\`

Expected output:
\`\`\`
Sample output
\`\`\`
```

## Template 2: Skill with Scripts

Use for skills that include executable code.

```markdown
---
name: automation-skill
description: Describe what this automates and when to use it.
license: MIT
compatibility: List required tools or packages
---

## When to use this skill
Use when user needs to...

## What this skill does
Brief overview of capabilities.

## Installation
\`\`\`bash
# Install dependencies
pip install required-package
\`\`\`

## Instructions

### Basic usage
1. Run the script: \`python scripts/main.py --input file.txt\`
2. Review output in \`output/\` directory
3. Handle any errors by checking logs

### Advanced options
See \`python scripts/main.py --help\` for all options.

## Script reference
- \`scripts/main.py\` - Primary entry point
- \`scripts/validate.py\` - Input validation
- \`scripts/utils.py\` - Helper functions

## Examples
\`\`\`bash
# Example 1: Basic processing
python scripts/main.py --input data.csv

# Example 2: With options
python scripts/main.py --input data.csv --format json --output results/
\`\`\`

## Troubleshooting
Common issues:
- **Error**: "Module not found" → Install dependencies
- **Error**: "Permission denied" → Check file permissions
```

## Template 3: Comprehensive Skill

Use for complex skills with references and assets.

```markdown
---
name: advanced-skill
description: Comprehensive description with specific keywords for agent activation.
license: MIT
compatibility: Required environment and tools
metadata:
  author: your-name
  version: "1.0"
  category: category-name
  tags: tag1, tag2, tag3
---

# Skill Name

Brief introduction and purpose.

## When to use this skill
Use when user:
- Needs to do X
- Wants to achieve Y
- Mentions keywords: A, B, C

## What this skill does
High-level overview of capabilities.

## Prerequisites
- Tool A (install: \`command\`)
- Tool B (install: \`command\`)
- Environment requirements

## Quick start
\`\`\`bash
# 1. Setup
./scripts/setup.sh

# 2. Basic usage
python scripts/main.py --input sample.txt

# 3. Verify output
ls output/
\`\`\`

## Detailed instructions

### Task 1: Description
1. Step-by-step instructions
2. Include code examples
3. Reference assets: \`assets/templates/config.yaml\`

### Task 2: Description
1. More instructions
2. Reference documentation: [API Reference](references/API.md)

## Examples

### Example 1: Basic scenario
\`\`\`python
# Sample code
import module
result = module.process(data)
\`\`\`

### Example 2: Advanced scenario
See [references/EXAMPLES.md](references/EXAMPLES.md) for detailed examples.

## Common patterns
- Pattern 1: When to use and how
- Pattern 2: Best practices
- Pattern 3: Optimization tips

## Configuration
Default config in \`assets/config.yaml\`:
\`\`\`yaml
setting1: value1
setting2: value2
\`\`\`

Customize by copying to \`~/.skill-name/config.yaml\`

## Reference documentation
- [API Reference](references/API.md) - Complete API documentation
- [Configuration Guide](references/CONFIG.md) - All configuration options
- [Troubleshooting](references/TROUBLESHOOTING.md) - Common issues and solutions
- [Examples](references/EXAMPLES.md) - Real-world use cases

## Best practices
1. Best practice one with explanation
2. Best practice two with explanation
3. Best practice three with explanation

## Troubleshooting
See [references/TROUBLESHOOTING.md](references/TROUBLESHOOTING.md) for detailed solutions.

Quick fixes:
- Issue 1: Solution
- Issue 2: Solution

## Version history
See metadata.version for current version. Full changelog available in repository.
```

## Template 4: Tool Integration Skill

Use for skills that integrate with specific tools.

```markdown
---
name: tool-integration
description: Integrate with [Tool Name] to perform specific tasks. Use when user needs to work with [Tool Name] or mentions [keywords].
license: MIT
compatibility: Requires [Tool Name] version X.Y or higher
metadata:
  author: integration-team
  version: "1.0"
  tool-version: "2.5+"
allowed-tools: Bash(tool-name:*)
---

# Tool Name Integration

Automate and enhance [Tool Name] workflows.

## When to use this skill
Use when:
- User mentions [Tool Name]
- User needs to perform tasks with [Tool Name]
- Keywords: tool-name, feature1, feature2

## What this skill does
- Integration capability 1
- Integration capability 2
- Integration capability 3

## Setup

### Installation
\`\`\`bash
# Install the tool
brew install tool-name  # or equivalent

# Verify installation
tool-name --version
\`\`\`

### Configuration
\`\`\`bash
# Initialize configuration
tool-name init

# Set required options
tool-name config set option1 value1
\`\`\`

## Common workflows

### Workflow 1: Task name
\`\`\`bash
tool-name command --option value
\`\`\`

### Workflow 2: Task name
\`\`\`bash
tool-name command2 --flag
\`\`\`

## Integration with scripts
The skill includes helper scripts:
- \`scripts/wrapper.sh\` - Enhanced tool wrapper
- \`scripts/batch.sh\` - Batch processing

Example:
\`\`\`bash
./scripts/wrapper.sh --input data/ --output results/
\`\`\`

## Best practices
- Practice 1: When to use this approach
- Practice 2: How to optimize
- Practice 3: Common pitfalls to avoid

## Tool-specific tips
- Tip 1: Specific to [Tool Name]
- Tip 2: Integration advice
```

## Template 5: Domain-Specific Skill

Use for specialized domain knowledge (finance, legal, science, etc.).

```markdown
---
name: domain-skill
description: Domain-specific expertise for [specific tasks]. Use when user needs help with [domain] tasks or mentions [domain keywords].
metadata:
  author: domain-experts
  version: "1.0"
  domain: domain-name
  expertise-level: intermediate
---

# Domain Skill Name

Expert guidance for [domain] tasks.

## When to use this skill
Use when user:
- Needs domain-specific knowledge
- Asks about domain concepts
- Mentions: keyword1, keyword2, keyword3

## Domain overview
Brief explanation of the domain and what this skill covers.

## Key concepts
- Concept 1: Explanation
- Concept 2: Explanation
- Concept 3: Explanation

## Common tasks

### Task 1: Description
1. Domain-specific steps
2. Include formulas or calculations if relevant
3. Reference standards or regulations

### Task 2: Description
1. More domain-specific guidance
2. Include examples from the domain
3. Reference best practices

## Terminology
See [references/GLOSSARY.md](references/GLOSSARY.md) for domain terms.

Quick reference:
- Term 1: Definition
- Term 2: Definition

## Standards and regulations
- Standard 1: When it applies
- Regulation 1: Compliance requirements

See [references/COMPLIANCE.md](references/COMPLIANCE.md) for details.

## Examples

### Real-world scenario 1
Problem: Description
Solution: Step-by-step approach
Result: Expected outcome

### Real-world scenario 2
See [references/CASE_STUDIES.md](references/CASE_STUDIES.md) for more examples.

## Best practices in [domain]
1. Practice specific to domain
2. Industry standards
3. Common patterns

## Resources
- [Domain Reference](references/DOMAIN_REF.md) - Comprehensive domain knowledge
- [Calculations Guide](references/CALCULATIONS.md) - Formulas and methods
- External resources: Links to authoritative sources
```

## Template 6: Diagnostic/Troubleshooting Skill

Use for skills focused on debugging and problem-solving.

```markdown
---
name: diagnostic-skill
description: Diagnose and fix issues with [system/tool]. Use when user reports errors, bugs, or problems with [specific system].
metadata:
  author: support-team
  version: "1.0"
  category: troubleshooting
---

# System Diagnostic Skill

Identify and resolve issues with [System Name].

## When to use this skill
Use when:
- User reports an error or issue
- System is not working as expected
- Keywords: error, bug, not working, issue, problem

## Diagnostic process

### Step 1: Gather information
Run diagnostics:
\`\`\`bash
python scripts/diagnose.py
\`\`\`

### Step 2: Identify the issue
Check common patterns:
1. Error type A → Solution path 1
2. Error type B → Solution path 2
3. Error type C → Solution path 3

### Step 3: Apply solution
Follow the appropriate solution guide below.

## Common issues and solutions

### Issue 1: Error message or symptom
**Symptoms:** What the user experiences
**Cause:** Why it happens
**Solution:**
\`\`\`bash
# Commands to fix
fix-command --option
\`\`\`

### Issue 2: Error message or symptom
**Symptoms:** Description
**Cause:** Root cause
**Solution:** See [references/SOLUTIONS.md](references/SOLUTIONS.md#issue-2)

## Diagnostic tools
- \`scripts/diagnose.py\` - System health check
- \`scripts/logs.py\` - Log analyzer
- \`scripts/test.py\` - Component testing

## Decision tree
\`\`\`
Is service running?
├─ No → Start service: systemctl start service-name
└─ Yes
    └─ Is service responding?
        ├─ No → Check logs: journalctl -u service-name
        └─ Yes → Check configuration
\`\`\`

## Prevention
Best practices to avoid issues:
1. Preventive measure 1
2. Preventive measure 2
3. Regular maintenance tasks
```

## Directory structure templates

### Minimal (instructions only)
```
skill-name/
└── SKILL.md
```

### With scripts
```
skill-name/
├── SKILL.md
└── scripts/
    ├── main.py
    └── utils.py
```

### With references
```
skill-name/
├── SKILL.md
└── references/
    ├── REFERENCE.md
    └── EXAMPLES.md
```

### Full structure
```
skill-name/
├── SKILL.md
├── scripts/
│   ├── main.py
│   ├── validate.py
│   └── lib/
│       └── helpers.py
├── references/
│   ├── API.md
│   ├── EXAMPLES.md
│   └── TROUBLESHOOTING.md
└── assets/
    ├── templates/
    │   └── config.yaml
    └── data/
        └── schema.json
```

## Quick reference: Required vs optional

### Required
- ✅ Directory with skill name
- ✅ SKILL.md file
- ✅ Frontmatter with `name` and `description`
- ✅ Name matches directory name
- ✅ Valid YAML frontmatter

### Optional but recommended
- 📝 License field
- 📝 Metadata for version and author
- 📝 Scripts directory for executable code
- 📝 References directory for detailed docs
- 📝 Assets directory for templates
- 📝 Examples section in SKILL.md
- 📝 Troubleshooting guidance

### Optional (use when needed)
- ⚙️ Compatibility field (only if specific requirements)
- ⚙️ Allowed-tools field (experimental)
- ⚙️ Multiple reference files (if skill is complex)
- ⚙️ Assets for templates or data

## Naming conventions

### Skill names (lowercase with hyphens)
- ✅ `pdf-processing`
- ✅ `git-workflow`
- ✅ `data-analysis`
- ❌ `PDF-Processing` (no uppercase)
- ❌ `pdf_processing` (use hyphens, not underscores)
- ❌ `pdf--processing` (no consecutive hyphens)

### Script names (descriptive, extension indicates language)
- ✅ `process.py`
- ✅ `validate.sh`
- ✅ `analyze.js`
- ✅ `batch_process.py` (underscores OK in scripts)

### Reference names (UPPERCASE for visibility)
- ✅ `REFERENCE.md`
- ✅ `API.md`
- ✅ `EXAMPLES.md`
- ✅ `TROUBLESHOOTING.md`
- ✅ `glossary.md` (lowercase also acceptable)
