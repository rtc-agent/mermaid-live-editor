---
title: "Fix Syntax Error"
tags: ["debug", "validation"]
description: "Detect and fix syntax errors in Mermaid code"
---

# Fix Syntax Error

## Goal

Demonstrate detecting and fixing syntax errors in existing Mermaid code.

## Steps

1. **Introduce an error** — Tell the assistant: "I have a flowchart but there's a syntax error. Here's the code: `graph TD; A-->B; C-->D`" (missing connection between B and C)
2. **Validate** — The assistant calls `editor.validate` to identify the error
3. **Analyze** — The assistant reads the validation result and identifies the issue
4. **Fix** — The assistant calls `editor.setCode` with corrected code
5. **Re-validate** — The assistant calls `editor.validate` again to confirm the fix

## Expected Result

- Initial validation shows an error or disconnected nodes
- After the fix, validation passes with no errors
- The diagram renders correctly

## Functions Used

- `editor.getCode`
- `editor.validate`
- `editor.setCode`
