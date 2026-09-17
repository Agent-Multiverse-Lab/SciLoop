# Visual System

Status: draft.

## Color

The interface is flat, white, and monochrome. It does not use brand colors, accent colors, gradients, glass effects, raised cards, glow, or decorative color.

```css
--surface-primary: #ffffff;
--surface-hover: #eeeeee;
--surface-active: #e2e2e2;
--surface-active-hover: #d8d8d8;
--text-primary: #111111;
--text-secondary: #4a4a4a;
--text-disabled: #a0a0a0;
--border-default: #dedede;
--focus-default: #666666;
```

Status differences use gray mark shapes plus explicit text, never color alone.

## Radius

Components select from a restrained radius ladder instead of introducing one-off values:

```css
--radius-none: 0;
--radius-xs: 3px;
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
```

Recommended starting points:

| Element | Token |
| --- | --- |
| Structural columns and vertical separators | `--radius-none` |
| AppRail hover surfaces and buttons | `--radius-sm` |
| Inputs, user messages, tool cards, and composer | `--radius-md` |
| Dialogs and independent overlays | `--radius-lg` |

The AppSidebar container itself remains undecided. Test `0`, `4px`, `6px`, and `8px` in the real Electron window before selecting a token. Values above `8px` are outside the current design system. Natural circles such as status dots are exempt from the ladder.

## Elevation

Elevation communicates message authorship rather than general hierarchy:

```css
--shadow-none: none;
--shadow-user-message: 0 2px 8px rgb(17 17 17 / 8%);
```

- Assistant messages always use `--shadow-none`.
- User-message bubbles use `--shadow-user-message`.
- Panels, navigation items, cards, tool results, and Inspector sections remain flat.

## Separators

Do not use horizontal rules to separate headers, navigation groups, messages, or Inspector sections. Create those groups with whitespace, alignment, and typography.

Vertical one-pixel borders may separate the AppSidebar, workspace, and Inspector. Functional component borders remain available for inputs, buttons, tables, code blocks, and focus states.
