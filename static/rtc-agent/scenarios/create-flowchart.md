---
title: "Create a Flowchart"
tags: ["flowchart", "basic"]
description: "Create a simple flowchart from natural language description"
---

# Create a Flowchart

## Goal

Demonstrate creating a flowchart from a natural language description.

## Steps

1. **Describe the flow** — Tell the assistant: "Create a flowchart for a user login process: start → enter credentials → validate → if valid go to dashboard, if invalid show error and loop back"
2. **Generate code** — The assistant calls `editor.setCode` with the Mermaid flowchart code
3. **Validate** — The assistant calls `editor.validate` to check for syntax errors
4. **Review** — Check the rendered diagram in the editor

## Expected Result

- A flowchart appears showing the login process
- Nodes are connected with arrows showing the decision flow
- No syntax errors in the validation result

## Functions Used

- `editor.setCode`
- `editor.validate`
