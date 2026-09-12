---
title: "Style a Diagram"
tags: ["style", "beautify", "theme"]
description: "Apply custom styles, themes, and colors to make diagrams visually appealing"
---

# Style a Diagram

## Goal

Demonstrate how to apply custom styles to Mermaid diagrams using themes, class definitions, and inline styles.

## Mermaid Styling Syntax Reference

### 1. Theme Configuration (init directive)

Use `%%{init:}%%` at the top of the diagram to configure the theme:

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'primaryColor': '#4CAF50', 'primaryTextColor': '#fff', 'primaryBorderColor': '#388E3C', 'lineColor': '#666', 'secondaryColor': '#FFC107', 'tertiaryColor': '#E3F2FD'}}}%%
flowchart LR
    A[Styled with theme] --> B[Using init directive]
```

**Available themes**: `default`, `neutral`, `dark`, `forest`, `base`

**Common themeVariables**:
- `primaryColor` — Main node fill color
- `primaryTextColor` — Text color inside nodes
- `primaryBorderColor` — Node border color
- `lineColor` — Arrow/line color
- `secondaryColor` — Secondary elements
- `tertiaryColor` — Background/accent color
- `fontSize` — Base font size

### 2. Class Definitions (classDef)

Define reusable style classes with `classDef`:

```mermaid
flowchart TD
    classDef success fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    classDef warning fill:#FFC107,stroke:#F57C00,stroke-width:2px,color:#000
    classDef error fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff
    classDef info fill:#2196F3,stroke:#1565C0,stroke-width:2px,color:#fff
    
    A[Start] --> B{Check}
    B -->|Pass| C[Success]
    B -->|Fail| D[Error]
    B -->|Warn| E[Warning]
    
    class C success
    class D error
    class E warning
    class A info
```

**classDef syntax**: `classDef className prop1:value1,prop2:value2,...`

**Common properties**:
- `fill` — Background color (hex, rgb, or named)
- `stroke` — Border color
- `stroke-width` — Border thickness
- `color` — Text color
- `font-size` — Font size
- `font-weight` — bold/normal
- `rx` / `ry` — Corner radius (for rounded corners)
- `opacity` — Transparency (0-1)

### 3. Inline Styles (style)

Apply styles directly to specific nodes or edges:

```mermaid
flowchart LR
    A[Normal] --> B[Highlighted]
    B --> C[Also normal]
    
    style B fill:#FFD700,stroke:#FF6B00,stroke-width:3px,color:#000
    linkStyle 1 stroke:#FF6B00,stroke-width:2px
```

**style syntax**: `style nodeId prop1:value1,prop2:value2,...`
**linkStyle syntax**: `linkStyle edgeIndex prop1:value1,prop2:value2,...`

### 4. Combined Example

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {'fontSize': '14px'}}}%%
flowchart TD
    classDef startNode fill:#4CAF50,stroke:#2E7D32,stroke-width:2px,color:#fff,rx:20,ry:20
    classDef endNode fill:#F44336,stroke:#C62828,stroke-width:2px,color:#fff,rx:20,ry:20
    classDef processNode fill:#E3F2FD,stroke:#1565C0,stroke-width:1px,color:#0D47A1
    classDef decisionNode fill:#FFF3E0,stroke:#E65100,stroke-width:1px,color:#BF360C
    
    A([Start]):::startNode --> B[Process Data]:::processNode
    B --> C{Valid?}:::decisionNode
    C -->|Yes| D[Save]:::processNode
    C -->|No| E[Retry]:::processNode
    E --> B
    D --> F([End]):::endNode
```

## Steps

1. **Request styling** — Tell the assistant: "Create a flowchart for a deployment pipeline and style it nicely with colors"
2. **Generate styled code** — The assistant should:
   - Add `%%{init:}%%` directive with theme configuration
   - Use `classDef` to define semantic style classes (success, error, warning, etc.)
   - Apply classes to nodes using `:::className` or `class` keyword
3. **Validate** — The assistant calls `editor.validate` to ensure syntax is correct
4. **Review** — Check that the diagram renders with the expected colors and styles

## Expected Result

- A flowchart with colored nodes based on their semantic meaning
- Consistent styling across similar node types
- Custom theme colors applied globally
- No syntax errors

## Tips for Beautiful Diagrams

1. **Use semantic colors**: Green for success/start, Red for errors/end, Blue for process, Orange for decisions
2. **Maintain contrast**: Ensure text is readable against background colors
3. **Be consistent**: Use the same style class for similar node types
4. **Use themes**: The `base` theme with custom `themeVariables` is most flexible
5. **Rounded corners**: Add `rx:10,ry:10` to classDef for rounded rectangles

## Functions Used

- `editor.setCode`
- `editor.validate`
