#!/usr/bin/env bash

# Quick start script for GitArbor TUI

echo "Starting GitArbor TUI..."
echo "Working directory: $(pwd)"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository!"
    echo "Please run GitArbor from within a git repository."
    exit 1
fi

# Run the TUI
bun run index.tsx
