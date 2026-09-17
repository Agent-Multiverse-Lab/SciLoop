# UI Design

Status: draft. This directory records approved interface decisions before implementation.

## Current stage

The current design stage covers the application shell and its global navigation. Page-level designs will be added only after the shell is agreed.

## Documents

- [Application shell](shell/layout.md): region ownership, dimensions, and responsive behavior.
- [AppRail and AppSidebar](shell/app-rail.md): unified navigation and contextual-list structure, interaction, and implementation placement.
- [Visual system](foundations/visual-system.md): monochrome palette and radius scale shared by UI components.
- [Chat](pages/chat.md): message surfaces, authorship elevation, and content separation.

The current three-region shell reference image is stored under [`assets/`](assets/app-rail-concept.png).

## Organization rule

UI design documents are grouped by responsibility:

```text
docs/design/ui/
  README.md
  foundations/  Shared color, type, spacing, radius, and motion decisions
  shell/        App-level structure such as AppSidebar, workspace, and Inspector
  pages/        Chat, Agents, Workspaces, and Settings designs when ready
  assets/       Images referenced by UI design documents
```

Do not create empty page documents as placeholders. Add a document when that part enters active design.
