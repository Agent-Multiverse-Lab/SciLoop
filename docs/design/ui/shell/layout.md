# Application Shell

Status: draft.

SciLoop uses three visible regions:

```text
AppSidebar | Main workspace | Inspector
```

`AppSidebar` combines global navigation with the contextual list for the selected page. For example, Chats shows recent conversations directly below the AppRail items instead of opening a separate list column. The main workspace owns the primary task, and the Inspector appears only when the user opens Trace, tool, file, source, or error details.

```css
grid-template-columns:
  var(--app-sidebar-width)
  minmax(560px, 1fr)
  var(--inspector-width);
```

Initial dimensions:

```css
--app-sidebar-width: clamp(240px, 22vw, 288px);
--inspector-width: 0px;
--inspector-open-width: clamp(320px, 25vw, 400px);
```

Inside `AppSidebar`, the navigation remains at the top, the contextual list owns the flexible scroll area, and runtime status plus Settings remain pinned to the bottom.

At widths below 1100px, an open Inspector overlays the right edge instead of shrinking the main workspace. At widths below 960px, the whole `AppSidebar` may become a drawer; its navigation and contextual list remain one surface.

See [AppRail and AppSidebar](app-rail.md) for the left shell component and [Visual system](../foundations/visual-system.md) for shared appearance tokens.
