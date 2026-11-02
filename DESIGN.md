# BrewBase design guidelines 2.0

BrewBase is an independent Homebrew cask browser. These guidelines are a modern
interpretation of Homebrew's visual language, not a copy of the official
Homebrew website guidelines. They define how BrewBase looks, moves and reads.

- Version: 2.0
- Updated: 2026-11-02
- Reference: [brew.sh](https://brew.sh)
- Status: independent project, not affiliated with or endorsed by Homebrew

## Principles

1. **Warm, not cold.** Brown, amber and cream carry the brand. Avoid blue-gray
   developer-tool defaults, purple gradients and neon accents.
2. **Terminal-native.** Commands, cask names and flags use monospace type and
   look like something you can paste into a shell.
3. **Quiet depth.** Hierarchy comes from layered warm surfaces and hairline
   borders first, shadows second.
4. **One obvious action.** The install command and its copy button are always
   the strongest elements on the page.
5. **Accessible by default.** Keyboard access, visible focus, readable contrast
   and reduced motion are part of the design, not a later pass.
6. **Modern, not trendy.** Use current layout, type and interaction standards
   without chasing effects that will date the interface.

## What stays from Homebrew

- The warm brown, amber and cream palette family
- System sans-serif for prose and monospace for shell content
- Dark code panels with a visible `$` prompt
- Cask and cellar vocabulary: casks, installs, formulae, Cellar
- Flat borders, restrained shadows and a practical, unmarketed tone

## What changed from the brew.sh reference

| brew.sh pattern | BrewBase 2.0 |
| --- | --- |
| Centered hero in a 62em column | Split hero and 72rem content grid |
| One flat brown plane | Espresso canvas with layered surface tokens |
| Amber used for most body copy | Cream primary text, amber reserved for actions and accents |
| `0.4em` radius nearly everywhere | 8px, 12px and 16px radius scale |
| No elevation | Hairline borders plus low ambient shadows on floating chrome |
| Mostly static controls | Explicit hover, focus, pressed and selected states |
| No motion language | 150–240ms transitions with a single easing curve |
| Controls of mixed sizes | 44px primary targets and 36px compact targets |

Dark remains the signature theme. The warm brown canvas is the brand, so a
light theme is intentionally out of scope.

## Brand and attribution

- The beer icon is a generic Lucide glyph. Do not use the Homebrew logo, the
  Homebrew wordmark or a redrawn version of either.
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
| `brew-bg` | `#17130E` | Page canvas |
| `brew-surface` | `#1F1A14` | Cards, panels, sticky chrome |
| `brew-raised` | `#272017` | Hover, nested controls, icon tiles |
| `brew-hover` | `#30271C` | Strong hover fill |
| `brew-code` | `#0F0C08` | Command and terminal panels |
| `brew-border` | `rgba(255, 215, 154, 0.12)` | Default hairline |
| `brew-border-strong` | `rgba(255, 215, 154, 0.26)` | Hover and emphasis hairline |
| `brew-text` | `#F5E9D7` | Primary reading text |
| `brew-strong` | `#FFFAF2` | Headings, values, command output |
| `brew-muted` | `#B6A58C` | Secondary copy |
| `brew-faint` | `#A69680` | Metadata and captions |
| `brew-amber` | `#FBB040` | Primary action, brand accent |
| `brew-amber-soft` | `#FFD79A` | Hover on amber, warm highlight |
| `brew-amber-deep` | `#E2A843` | Inline links |
| `brew-on-amber` | `#241A0C` | Text on amber fills |
| `brew-green` | `#8FD6A4` | Positive growth, success |
| `brew-red` | `#FF9D97` | Negative growth, errors |
| `brew-cyan` | `#87C7D8` | Command flags and focus ring |

Rules:

- Amber is for one primary action per view, plus links, focus and small brand
  moments. Do not use it as a page-wide background wash.
- Never communicate state with color alone. Pair green and red with an arrow,
  a sign, an icon or a label.
- Contrast targets: primary text and actions meet WCAG AA at 4.5:1 minimum.
  Muted text must remain readable at 14px.
- Keep `brew-on-amber` dark. White text on `brew-amber` does not pass contrast.

## Typography

Use the platform stack. It renders natively on macOS and avoids a webfont
request that would slow down the first install command.

```css
--font-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Helvetica Neue",
  Roboto, sans-serif;
--font-mono: ui-monospace, "SF Mono", Monaco, Menlo, Consolas, monospace;
```

| Role | Size | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- |
| Display | `clamp(2.6rem, 5.5vw, 4.4rem)` | 800 | `-0.035em` | One per page |
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

## Layout

- Content width: `72rem` maximum, with 16px gutters on mobile and 24px above
  the small breakpoint.
- Grid: single column on mobile, two columns on tablet, three on desktop.
- Spacing follows a 4px base: 4, 8, 12, 16, 24, 32, 48, 64 and 80.
- Section rhythm: 64px on mobile, 80px on desktop.
- Sticky chrome: a 64px top bar and a compact command composer below it.
  Add `scroll-margin-top` to anchor targets so the header never covers a
  heading.
- The command composer stays visible while browsing. It must not grow taller
  than two compact rows on mobile.

## Surfaces, borders and elevation

- Surfaces step up in warmth, not in brightness: canvas, surface, raised,
  hover.
- Default border is a 1px amber-tinted hairline. Strong borders are for hover
  and selected states.
- Use `6px` for tiny elements such as check boxes and keycaps, `8px` for
  controls, `12px` for secondary panels and `16px` for cards and major panels.
  Pills are reserved for tags, chips and status.
- Shadows are ambient and warm-black, never colored. Use the default shadow for
  floating chrome and the lift shadow only on card hover.
- Backdrop blur is allowed on the sticky top bar and command composer. Do not
  use it on cards, menus or the page background.
- No gradients except a single, low-opacity amber radial glow in the page
  background and behind the hero stats. It supports the brand and must remain
  decorative (`aria-hidden`).

## Motion

- Duration: 150ms for hover and color changes, 200ms for menus and transforms,
  240ms maximum for any other transition.
- Easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Animate color, border, shadow, opacity and small transforms only. Do not
  animate layout properties.
- Pressed buttons may scale to `0.98`. Cards do not bounce or lift far.
- Honor `prefers-reduced-motion: reduce` by removing transforms, smooth scroll
  and non-essential transitions.

## Components

### Top bar

- Sticky, 64px tall, translucent page color with a bottom hairline and blur.
- Brand mark in an amber-tinted tile, wordmark in cream, optional "Independent"
  badge.
- Text links are muted by default and become cream on hover. The GitHub action
  is a bordered 40px icon button.
- Hide secondary links before wrapping the bar onto two lines.

### Command composer

- The strongest surface on the page: a raised panel with a terminal icon, a
  dark code well and a solid amber copy group.
- Render the command with semantic syntax colors: `brew` amber, `install`
  cream, flags cyan or muted, cask names green, prompt faint.
- The primary button copies the command immediately. The attached chevron
  opens secondary options and must be a separate 36–44px target.
- When nothing is selected, the composer is muted and the copy action is
  disabled. Never copy an incomplete command.
- Announce copy success in a live region and show a two-second visual state.
- Close the options menu on outside press and Escape.

### Search and filters

- Search sits on a bordered field with a leading icon and a trailing `/`
  keyboard hint on desktop.
- `/` focuses search from anywhere outside an editable field. Escape clears and
  blurs.
- Sort is a segmented control with the selected segment on amber.
- Category chips are pills with a count. Unselected chips are muted with a
  hairline; selected chips use the amber fill.
- Keep the result count in a live region. Show the selection count beside it.

### Cask cards

- Whole-card selection with a visible check box. Support Enter and Space.
- Icon tile is 44px, white, and padded so transparent and full-bleed icons
  share the same optical size.
- Show rank, category, description, yearly installs and growth. Truncate names
  and clamp descriptions to two lines.
- Selected state changes border, tint and check mark. Hover only shifts surface
  and border. Do not rely on hover for essential information.
- Use a dashed border and a centered icon for the empty state.

### Menus and empty states

- Menus use the surface token, a hairline border, a 12px radius and a soft
  ambient shadow. Items include a title and one line of supporting copy.
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

- Define colors, fonts, shadows and easing in `@theme` in `app/globals.css`.
  Use the generated `brew-*` utilities in components.
- Do not introduce a component library or a webfont without updating these
  guidelines first.
- Keep one source of truth for tokens. A raw hex value in a component is a bug.
- Re-check `bun run lint` and `bun run build` before shipping a design change.
- Verify the page at 320px, 768px, 1024px and 1440px, with reduced motion and
  increased contrast enabled.
