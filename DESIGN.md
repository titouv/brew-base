# BrewBase design guidelines 2.2

BrewBase is an independent Homebrew cask browser. These guidelines are a clean,
modern interpretation of Homebrew's visual language, not a copy of the official
Homebrew website guidelines. They define how BrewBase looks, moves and reads.

- Version: 2.2
- Updated: 2026-11-02
- Reference: [brew.sh](https://brew.sh)
- Status: independent project, not affiliated with or endorsed by Homebrew

## Principles

1. **Clean first.** Remove decoration until only hierarchy, content and one
   clear action remain.
2. **Warm, not orange.** The palette is espresso, cream and stone. Amber is a
   signature mark, not a surface color.
3. **Terminal-native.** Commands and cask names use monospace type and look
   like something you can paste into a shell.
4. **Quiet depth.** Hierarchy comes from surface steps and hairline borders.
   There are no gradients, glows or decorative shadows.
5. **One obvious action.** The install command and its copy button are always
   the strongest elements on the page.
6. **Accessible by default.** Keyboard access, visible focus, readable contrast
   and reduced motion are part of the design, not a later pass.
7. **Editorial contrast.** A serif display against sans UI and mono code gives
   the page a current, human tone without adding color or decoration.

## What stays from Homebrew

- The warm brown family, cream type and one amber brand mark
- System sans-serif for prose and monospace for shell content
- Dark code panels with a visible `$` prompt
- Cask and cellar vocabulary: casks, installs, formulae, Cellar
- Flat borders and a practical, unmarketed tone

## What changed from the brew.sh reference

| brew.sh pattern | BrewBase 2.1 |
| --- | --- |
| Centered hero in a 62em column | Split hero and 72rem content grid |
| One flat brown plane | Neutral espresso canvas with three surface steps |
| Amber used for body copy, links and buttons | Cream text and cream actions, amber only in the mark |
| `0.4em` radius nearly everywhere | 6px, 8px and 12px radius scale |
| No elevation | Hairline borders only, no drop shadows or glows |
| Mostly static controls | Explicit hover, focus, pressed and selected states |
| No motion language | 150–240ms transitions with a single easing curve |
| Controls of mixed sizes | 44px primary targets and 36px compact targets |
| All-sans type | Editorial serif display and wordmark over a system sans UI |

Dark remains the signature theme. The warm brown canvas is the brand, so a
light theme is intentionally out of scope.

## Brand and attribution

- The beer icon is a generic Lucide glyph and the only amber element in the
  interface. Do not use the Homebrew logo, the Homebrew wordmark or a redrawn
  version of either.
- Always link to `brew.sh` or `formulae.brew.sh` when referring to Homebrew,
  and keep the non-affiliation notice in the footer.
- Write "Homebrew" as a proper noun. Do not stylize it in all caps or alter its
  capitalization.
- Product names belong to their owners. Use the cask display name from the
  Homebrew API rather than inventing one.

## Color

Use semantic tokens, never raw hex values in components.

| Token | Value | Role |
| --- | --- | --- |
| `brew-bg` | `#141210` | Page canvas |
| `brew-surface` | `#1B1815` | Cards, panels, inputs |
| `brew-raised` | `#23201C` | Hover, selected, nested surfaces |
| `brew-hover` | `#2B2722` | Strong hover fill |
| `brew-code` | `#0D0C0A` | Command and terminal panels |
| `brew-border` | `rgba(246, 238, 226, 0.10)` | Default hairline |
| `brew-border-strong` | `rgba(246, 238, 226, 0.24)` | Hover and selected hairline |
| `brew-text` | `#ECE5DA` | Primary reading text |
| `brew-strong` | `#FBF7F0` | Headings, values, primary actions |
| `brew-muted` | `#B0A89C` | Secondary copy |
| `brew-faint` | `#9A9388` | Metadata and captions |
| `brew-amber` | `#FBB040` | Brand mark only |
| `brew-green` | `#8FD6A4` | Positive growth, success |
| `brew-red` | `#FF9D97` | Negative growth, errors |
| `brew-focus` | `#87C7D8` | Keyboard focus ring |

Rules:

- Amber appears in the header mark and the favicon only. Do not fill buttons,
  chips, borders or headings with amber.
- Primary actions use the cream `brew-strong` fill with `brew-bg` text.
  Selected chips, selected cards and active segments use the same cream fill or
  a neutral raised surface.
- Links use `brew-text` and become `brew-strong` on hover, with an underline.
- Never communicate state with color alone. Pair green and red with an arrow,
  a sign, an icon or a label.
- Contrast targets: primary text and actions meet WCAG AA at 4.5:1 minimum.
  Muted text must remain readable at 12px.
- No gradients. No glows. No translucent colored washes.

## Typography

BrewBase pairs a locally bundled editorial serif with the platform sans and
mono stacks. The serif carries display and brand moments; the UI stays sans.

```css
--font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Helvetica Neue",
  Roboto, sans-serif;
--font-serif: var(--font-instrument-serif), ui-serif, Georgia,
  "Times New Roman", serif;
--font-mono: ui-monospace, "SF Mono", Monaco, Menlo, Consolas, monospace;
```

| Role | Size | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- |
| Display | `clamp(2.5rem, 7vw, 5rem)` | 400 serif | `-0.025em` | Hero only |
| Wordmark | `1.25–1.5rem` | 400 serif | `-0.02em` | Header and footer |
| Section title | `1.5rem` | 700 | `-0.02em` | Browse casks |
| Card title | `0.95rem` | 600 | 0 | Single line, truncate |
| Body | `1rem` | 400 | 0 | Line height `1.6` |
| Lead | `1.125rem` | 400 | 0 | Line height `1.6` |
| Small | `0.875rem` | 400–600 | 0 | Supporting copy |
| Caption | `0.75rem` | 400–600 | `0.02em` | Metadata |
| Label | `0.75rem` | 600 | `0.08em` | Uppercase section labels |
| Code | `0.875rem` | 400 | 0 | Mono, no ligatures |

Rules:

- Headings use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.
- Use tabular numerals for install counts, ranks and percentages.
- Do not use more than three weights on one screen.
- Sentence case for headings and buttons. Uppercase only for small labels.
- Keep body copy at 16px or larger. Never shrink disclaimers below 12px.
- Keep the display hierarchy monochrome. Emphasis comes from size and weight,
  not from a second accent color.
- Use the serif only for the hero display and the wordmark. Never use it for
  body copy, buttons, labels, card titles, data or code.
- The second display line may be italic. Use at most one italic display line
  per page.
- Instrument Serif is bundled locally in `app/fonts` under the SIL Open Font
  License. Do not replace it with a hosted webfont.

## Layout

- Content width: `72rem` maximum, with 16px gutters on mobile and 24px above
  the small breakpoint.
- Grid: single column on mobile, two columns on tablet, three on desktop.
- Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48, 64 and 80.
- Section rhythm: 64px on mobile, 80px on desktop.
- Sticky chrome: a 64px top bar and a full-bleed command bar directly below it.
  Add `scroll-margin-top` to anchor targets so the header never covers a
  heading.
- The command composer stays visible while browsing and must not exceed two
  compact rows on mobile.

## Surfaces, borders and radius

- Surfaces step up in warmth, not in brightness: canvas, surface, raised, hover.
- Default border is a 1px neutral warm hairline. Strong borders are for hover
  and selected states.
- Use `6px` for tiny elements such as check boxes and keycaps, `8px` for
  controls and `12px` for panels and cards. Pills are reserved for tags, chips
  and status.
- No box shadows. No glows. Separate layers with a border and a surface step.
- Backdrop blur is allowed on the sticky top bar and command bar only. Do not
  use it on cards or menus.
- No gradients or patterned backgrounds. The page canvas is a single flat
  color.

## Motion

- Duration: 150ms for hover and color changes, 200ms for menus and transforms,
  240ms maximum for any other transition.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Animate color, border, opacity and small transforms only. Do not animate
  layout properties.
- Pressed buttons may scale to `0.98`. Cards do not bounce or lift.
- Honor `prefers-reduced-motion: reduce` by removing transforms, smooth scroll
  and non-essential transitions.

## Components

### Top bar

- Sticky, 64px tall, translucent page color with a bottom hairline and blur.
- Wordmark in Instrument Serif and cream, with the amber beer mark at 24px.
- Text links are muted by default and become cream on hover. The source action
  is a ghost 40px icon button.
- Hide secondary links before wrapping the bar onto two lines.

### Command composer

- A full-bleed sticky bar under the top bar. It uses the page color, a bottom
  hairline, blur and a single dark code well.
- Render the command in monochrome: `brew` strong, `install` muted, flags
  faint and cask names cream. No syntax rainbow.
- The primary button copies the command immediately and uses the cream fill.
  The attached chevron opens secondary options and must be a separate 36–44px
  target.
- When nothing is selected, the composer is muted and the copy action is
  disabled. Never copy an incomplete command.
- Announce copy success in a live region and show a two-second visual state.
- Close the options menu on outside press and Escape. Menus use borders, not
  shadows.

### Search and filters

- Search sits in a bordered field with a leading icon and a trailing `/`
  keyboard hint on desktop.
- `/` focuses search from anywhere outside an editable field. Escape clears and
  blurs.
- Sort is a segmented control with the selected segment on cream.
- Category chips are pills with a count. Unselected chips are muted with a
  hairline; selected chips use the cream fill.
- Use a single thin dividing rhythm, not a card around the whole toolbar.
- Keep the result count in a live region. Show the selection count beside it.

### Cask cards

- Whole-card selection with a visible check box. Support Enter and Space.
- Icon tile is 44px, cream, and padded so transparent and full-bleed icons
  share the same optical size.
- Show rank, category, description, yearly installs and growth. Truncate names
  and clamp descriptions to two lines.
- Default cards use the surface token and a hairline border. Hover and selected
  states step up to the raised surface and a strong border. No shadows.
- Selected state also changes the check mark. Hover does not carry essential
  information.
- Use a bordered panel with a centered icon for the empty state.

### Menus and footer

- Menus use the surface token, a hairline border and a 12px radius. Items
  include a title and one line of supporting copy.
- The footer uses three columns on desktop and one on mobile. Keep the
  non-affiliation notice visible but low emphasis.
- Empty states explain what happened and offer the action that fixes it.

## Accessibility

- Target WCAG 2.2 AA.
- Primary controls are at least 44px tall. Compact chips are at least 36px.
- Focus is always visible: 2px cyan outline with a 2px offset.
- The page has one `h1`, ordered section headings, a skip link and landmark
  elements.
- Every icon-only control has an accessible name. Decorative icons are hidden.
- Cards use `role="button"` plus `aria-pressed`, or a native control when the
  markup allows it. Keyboard behavior matches click behavior.
- Copy results and result counts use polite live regions.
- Support `prefers-contrast: more` by strengthening muted text and borders.
- Test at 200% zoom without horizontal scrolling, except inside code wells,
  which may scroll horizontally.

## Content

- Use Homebrew terminology: cask, formula, install, Cellar, tap, brew.
- Write "Mac", not "mac", and "Homebrew" as a proper noun.
- Sentence case for headings, buttons, labels and menu items.
- No em dashes. Use a comma, colon or period.
- No Oxford comma.
- No trademark or copyright symbols.
- Prefer concrete verbs: "Browse casks", "Copy command", "Clear filters".
- Keep helper copy under two lines. The interface should explain itself
  without a tour.

## Implementation

- Define colors, fonts and easing in `@theme` in `app/globals.css`. Use the
  generated `brew-*` utilities in components.
- The serif is bundled in `app/fonts` with its OFL license. Do not add another
  webfont, a component library, a gradient or a shadow without updating these
  guidelines first.
- Keep one source of truth for tokens. A raw hex value in a component is a bug.
- Re-check `bun run lint` and `bun run build` before shipping a design change.
- Verify the page at 320px, 768px, 1024px and 1440px, with reduced motion and
  increased contrast enabled.
