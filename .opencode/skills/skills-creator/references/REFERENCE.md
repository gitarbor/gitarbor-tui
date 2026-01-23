# Skills Creator Reference

This reference provides detailed examples and edge cases for creating Agent Skills.

## Complete skill examples

### Example 1: PDF Processing Skill

```markdown
---
name: pdf-processing
description: Extract text and tables from PDF files, fill forms, merge documents. Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction.
license: Apache-2.0
compatibility: Requires pdfplumber, PyPDF2 Python packages
metadata:
  author: example-org
  version: "1.2"
  category: document-processing
---

# PDF Processing

## When to use this skill
Use this skill when the user needs to:
- Extract text or tables from PDF files
- Fill PDF forms programmatically
- Merge multiple PDF documents
- Split PDF files
- Add watermarks or annotations

## Instructions

### Extracting text from PDFs
1. Use the pdfplumber library for text extraction
2. Handle multi-page documents by iterating through pages
3. Preserve formatting when possible

Example:
```python
import pdfplumber

with pdfplumber.open('document.pdf') as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        print(text)
```

### Filling PDF forms
1. Use PyPDF2 for form filling
2. Get field names first using scripts/get_form_fields.py
3. Update fields with new values

See [FORMS.md](references/FORMS.md) for field specifications.

### Merging PDFs
1. Use PyPDF2.PdfMerger
2. Add files in desired order
3. Write to output file

Run: `python scripts/merge.py input1.pdf input2.pdf -o output.pdf`

## Best practices
- Always validate PDF files before processing
- Handle encrypted PDFs appropriately
- Check file permissions before writing
- Use try-catch for better error handling
```

### Example 2: Git Workflow Skill

```markdown
---
name: git-workflow
description: Automate common git operations including branch management, commit conventions, and pull request creation. Use when user needs help with git commands, branching strategies, or version control workflows.
license: MIT
compatibility: Requires git CLI and gh (GitHub CLI) for PR operations
metadata:
  author: devtools-team
  version: "2.0"
allowed-tools: Bash(git:*) Bash(gh:*)
---

# Git Workflow

## When to use this skill
Use when the user:
- Needs to create branches following naming conventions
- Wants to commit with conventional commit messages
- Needs to create or manage pull requests
- Asks about git workflows or branching strategies
- Mentions git, commits, branches, or PRs

## Branch naming conventions

Follow this pattern: `<type>/<short-description>`

Types:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or changes

Example: `feature/add-user-authentication`

## Commit message format

Use conventional commits:
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(auth): add JWT token validation

Implement middleware to validate JWT tokens on protected routes.
Includes error handling for expired and invalid tokens.

Closes #123
```

## Common workflows

### Creating a feature branch
```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "feat: add new feature"
git push -u origin feature/new-feature
```

### Creating a pull request
```bash
gh pr create --title "Add new feature" --body "Description of changes"
```

See [references/WORKFLOWS.md](references/WORKFLOWS.md) for advanced patterns.

## Best practices
- Keep commits atomic and focused
- Write descriptive commit messages
- Pull from main before creating new branches
- Run tests before pushing
- Review your own PR before requesting reviews
```

## Common mistakes to avoid

### 1. Vague descriptions
❌ Bad:
```yaml
description: Helps with files
```

✅ Good:
```yaml
description: Process CSV and JSON files by parsing, validating, and transforming data. Use when user needs to read, write, or convert structured data files.
```

### 2. Invalid naming
❌ Bad:
```yaml
name: My-Skill  # Uppercase
name: -skill    # Starts with hyphen
name: skill--name  # Consecutive hyphens
```

✅ Good:
```yaml
name: my-skill
name: data-processor
name: git-workflow
```

### 3. Too much in main file
❌ Bad: 1000+ line SKILL.md with everything inline

✅ Good: Concise SKILL.md with references to separate files:
```markdown
For detailed API reference, see [API.md](references/API.md)
For troubleshooting, see [TROUBLESHOOTING.md](references/TROUBLESHOOTING.md)
```

### 4. Missing activation keywords
❌ Bad:
```yaml
description: Process documents
```

✅ Good:
```yaml
description: Process Word documents (.docx) by extracting text, images, and metadata. Use when user mentions Word files, .docx, document processing, or needs to extract content from Microsoft Word documents.
```

### 5. Unclear instructions
❌ Bad:
```markdown
## Instructions
Use the script to process files.
```

✅ Good:
```markdown
## Instructions
1. Identify the input file type (CSV, JSON, or XML)
2. Run the appropriate parser: `python scripts/parse.py --input file.csv --type csv`
3. Validate the output using the schema in assets/schemas/
4. Handle any validation errors by checking references/ERROR_CODES.md
```

## Edge cases to handle

### Missing dependencies
Include compatibility field and clear error messages:
```yaml
compatibility: Requires Python 3.8+, pip packages: pandas, numpy
```

In instructions:
```markdown
If you encounter import errors, ensure dependencies are installed:
```bash
pip install pandas numpy
```
```

### Platform-specific behavior
Document platform differences:
```markdown
## Platform notes
- **macOS/Linux**: Use forward slashes in paths
- **Windows**: Use backslashes or raw strings in Python
- **All platforms**: Use `os.path.join()` for cross-platform compatibility
```

### Large files
Provide guidance for resource-intensive operations:
```markdown
## Performance considerations
- For files > 100MB, use streaming parsers
- Process in chunks to avoid memory issues
- Consider using `scripts/batch_process.py` for multiple large files
```

### Error handling
Include troubleshooting guidance:
```markdown
## Common errors

### "File not found"
- Check that the path is correct
- Verify file permissions
- Use absolute paths if relative paths fail

### "Parse error"
- Validate input format matches expected schema
- Check for special characters or encoding issues
- See [TROUBLESHOOTING.md](references/TROUBLESHOOTING.md) for detailed solutions
```

## Progressive disclosure example

Main SKILL.md (kept concise):
```markdown
---
name: data-analysis
description: Analyze datasets, generate charts, create summary reports. Use for data analysis, visualization, statistics, or when user mentions pandas, charts, or data exploration.
---

# Data Analysis

## When to use
Use when user needs to analyze data, create visualizations, or generate statistical reports.

## Quick start
1. Load data: `python scripts/load_data.py data.csv`
2. Analyze: `python scripts/analyze.py --stats --charts`
3. Export results: `python scripts/export.py --format pdf`

## Detailed guides
- [Complete API reference](references/API.md) - Full documentation
- [Chart types and customization](references/CHARTS.md) - Visualization options
- [Statistical methods](references/STATISTICS.md) - Available analyses
- [Export formats](references/EXPORT.md) - Output options

## Examples
See [references/EXAMPLES.md](references/EXAMPLES.md) for real-world use cases.
```

references/API.md (detailed reference, loaded on demand):
```markdown
# Data Analysis API Reference

## Loading data
### From CSV
### From JSON
### From databases
...
(detailed documentation continues)
```

## Metadata best practices

### Version tracking
```yaml
metadata:
  version: "2.1.0"
  changelog: "See CHANGELOG.md for version history"
  last-updated: "2024-01-15"
```

### Author and maintenance info
```yaml
metadata:
  author: team-name
  maintainer: email@example.com
  repository: https://github.com/org/skills
```

### Categorization
```yaml
metadata:
  category: development
  tags: git, version-control, automation
  difficulty: intermediate
```

### Dependencies tracking
```yaml
metadata:
  requires-packages: pandas>=2.0, numpy>=1.24
  requires-tools: git, gh
  min-python-version: "3.8"
```

## Script organization patterns

### Simple script structure
```
scripts/
├── main.py        # Primary entry point
└── utils.py       # Helper functions
```

### Modular structure
```
scripts/
├── process.py     # Main processing
├── validate.py    # Validation logic
├── export.py      # Export functionality
└── lib/
    ├── parser.py
    ├── formatter.py
    └── helpers.py
```

### Multi-language structure
```
scripts/
├── python/
│   └── analyze.py
├── bash/
│   └── setup.sh
└── javascript/
    └── visualize.js
```

## Testing skills

Before finalizing, test the skill by:

1. **Validation check**: Verify frontmatter and naming
2. **Activation test**: Ensure description triggers correctly
3. **Instruction clarity**: Can an agent follow the steps?
4. **Script execution**: Do scripts run without errors?
5. **Reference loading**: Are referenced files accessible?
6. **Edge cases**: Test with unusual inputs
7. **Error handling**: Verify error messages are helpful

## Skill versioning strategy

Use semantic versioning in metadata:
- **Major (1.0.0)**: Breaking changes to skill interface
- **Minor (0.1.0)**: New features, backward compatible
- **Patch (0.0.1)**: Bug fixes, documentation updates

Example changelog in metadata:
```yaml
metadata:
  version: "2.1.0"
  changelog: |
    2.1.0: Added support for XML files
    2.0.0: Restructured API, breaking changes
    1.5.2: Fixed bug in CSV parser
    1.5.0: Added JSON support
```

## Advanced patterns

### Skill composition
Reference other skills when appropriate:
```markdown
This skill works well with:
- `file-validation` - For input validation
- `report-generator` - For output formatting
```

### Conditional logic
Provide decision trees for complex scenarios:
```markdown
## Decision tree
1. Is input a URL?
   - Yes: Use `scripts/fetch_remote.py`
   - No: Continue to step 2
2. Is input a local file?
   - Yes: Use `scripts/process_local.py`
   - No: Return error "Invalid input"
```

### State management
For multi-step processes:
```markdown
## Multi-step workflow
The skill maintains state in `.skill-state/`:
1. Step 1 creates `.skill-state/parsed.json`
2. Step 2 reads parsed data and creates `.skill-state/analyzed.json`
3. Step 3 reads analyzed data and generates final output
4. Clean up: `rm -rf .skill-state/`
```
