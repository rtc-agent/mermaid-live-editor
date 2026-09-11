---
title: "Create a Sequence Diagram"
tags: ["sequence", "interactions"]
description: "Create a sequence diagram showing interactions between objects"
---

# Create a Sequence Diagram

## Goal

Demonstrate creating a sequence diagram showing message exchanges between participants.

## Steps

1. **Describe the interaction** — Tell the assistant: "Create a sequence diagram for an HTTP request: Client sends GET request to Server, Server queries Database, Database returns data, Server sends response to Client"
2. **Generate code** — The assistant calls `editor.setCode` with the Mermaid sequence diagram code
3. **Validate** — The assistant calls `editor.validate` to check for syntax errors
4. **Check diagram type** — The assistant calls `editor.getDiagramType` to confirm it's a sequence diagram
5. **Review** — Check the rendered diagram in the editor

## Expected Result

- A sequence diagram appears showing the HTTP request flow
- Participants (Client, Server, Database) are shown with vertical lifelines
- Messages are shown as arrows between participants
- The diagram type is confirmed as "sequence"
- No syntax errors in the validation result

## Functions Used

- `editor.setCode`
- `editor.validate`
- `editor.getDiagramType`
