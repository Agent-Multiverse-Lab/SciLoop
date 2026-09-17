# Chat

Status: draft.

## Message surfaces

Message authorship is visible through alignment, surface tone, avatar treatment, and restrained elevation:

- User messages align to the right, use a light-gray surface, and receive the shared subtle user-message shadow.
- Assistant messages align to the left with an assistant avatar and use a white or light-gray flat surface.
- Assistant messages always use `box-shadow: none`, including messages containing tables, code, tools, or expandable details.
- Nested content may use a border when it is functional, such as a table grid or code-block boundary. It does not elevate the assistant message.

```css
.chat-message--assistant {
  box-shadow: var(--shadow-none);
}

.chat-message--user {
  box-shadow: var(--shadow-user-message);
}
```

## Separation

The conversation does not use horizontal divider rules between messages or below the conversation header. Vertical rhythm, alignment, timestamps, and author treatment provide separation.

The same rule applies to adjacent shell regions visible from Chat: AppSidebar groups and Inspector sections use spacing and headings instead of horizontal rules. Vertical column borders and functional component borders remain unchanged.

## React boundary

The first implementation uses one continuous workspace with two sibling regions:

```text
AgentWorkspace
|-- AgentMessageArea
`-- AgentInputArea
```

`AgentMessageArea` owns vertical scrolling. `AgentInputArea` remains in the second grid row and never participates in message scrolling. The two regions do not introduce an outer card or a horizontal separator.

Component presentation uses Tailwind CSS backed by semantic theme variables. Radix remains limited to icons and future interaction primitives; Radix Themes is not part of the visual layer.

Cross-module renderer imports use the `@/` alias for `apps/desktop/src/renderer`. Relative imports remain preferred inside a feature so its internal ownership stays visible.

```text
apps/desktop/src/renderer/features/agent/
  index.ts
  hooks/
    useAgentConversation.ts
  model/
    agent-types.ts
  ui/
    AgentWorkspace.tsx
    AgentMessageArea.tsx
    AgentInputArea.tsx
```
