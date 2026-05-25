# 6.3 Election Pocketbook — Design System

## Overview

6.3 Election Pocketbook is a candidate pledge comparison website for first-time young voters. The design prioritizes informational clarity and trustworthiness through a black-and-white duet system. `{colors.primary}` black anchors every CTA and conversion target; `{colors.canvas}` white carries everything else. Decorative elements are kept to a minimum — typography and layout are the brand voice.

Typography runs on a single typeface: **Pretendard**. Weight 700 is reserved for headlines only; weight 500 for buttons, emphasis, and subheadings; weight 400 for body copy and captions. Headlines are always sentence-case; no letter-spacing is applied.

The single shape signature for interactive elements is the **pill**. Every button, chip, and tag uses `{rounded.pill}` 999px. Cards and containers use `{rounded.xl}` 16px.

**Key Characteristics:**
- Two-color CTA hierarchy: black `{colors.primary}` pill → white `{colors.canvas}` pill → soft gray `{colors.canvas-soft}` pill/chip.
- The pill is the single interactive shape signature — `{rounded.pill}` 999px on every interactive element.
- Every headline is sentence-case, weight 700.
- No gradients, no decorative backgrounds, no unnecessary shadows.
- White sections and black promo bands alternate to create page rhythm.
- Mobile-first — every component is designed at 375px baseline and scaled up.

---

## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#000000`): Every primary CTA pill, footer fill, dark promo bands, and nav primary buttons. The system's only conversion color.
- **Surface Pressed** (`{colors.surface-pressed}` — `#e2e2e2`): Pressed-state fill for white pills.
- **Black Elevated** (`{colors.black-elevated}` — `#282828`): Hover state for translucent white tab-toggle pills.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): Default page background.
- **Canvas Soft** (`{colors.canvas-soft}` — `#efefef`): Category chip fill, form input row fill, subtle pill button fill.
- **Canvas Softer** (`{colors.canvas-softer}` — `#f3f3f3`): Nested input fill on white surfaces.

### Text
- **Ink** (`{colors.ink}` — `#000000`): Every heading and body paragraph on light surfaces.
- **Body** (`{colors.body}` — `#5e5e5e`): Secondary text — captions, subheadings, supporting copy.
- **Hairline Mid** (`{colors.hairline-mid}` — `#4b4b4b`): Muted link text inside footer columns.
- **Mute** (`{colors.mute}` — `#afafaf`): Lowest-priority text — placeholder text, fine print.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): All text on `{colors.ink}` surfaces (footer, dark bands).

### Semantic
No separate error / success / warning color palette. Validation feedback is handled through primary black or text copy.

---

## Typography

### Font Family

The entire system runs on a single typeface: **Pretendard**.

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

| Role | Weight | Usage |
|---|---|---|
| Display / Headline | **700** | All headlines, section titles, card titles |
| Button / Emphasis | **500** | Button labels, emphasized inline text, subheadings |
| Body / Caption | **400** | Default body copy, captions, metadata |

The two active weights never cross roles — 700 is headline-only; 400 is body-only.

### Hierarchy

| Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `{typography.display-xxl}` | 52px | 700 | 73px | Hero headline |
| `{typography.display-xl}` | 36px | 700 | 50px | Page section headlines |
| `{typography.display-lg}` | 32px | 700 | 45px | Promo card headlines |
| `{typography.display-md}` | 24px | 700 | 34px | Card titles, candidate names |
| `{typography.display-sm}` | 20px | 700 | 28px | Sub-card headings |
| `{typography.body-lg}` | 18px | 500 | 25px | Lead paragraphs, larger body |
| `{typography.body-md}` | 16px | 400 | 22px | Default paragraph body |
| `{typography.body-md-strong}` | 16px | 500 | 22px | Bolded inline body, most button labels |
| `{typography.body-sm}` | 14px | 400 | 20px | Captions, secondary metadata |
| `{typography.body-sm-strong}` | 14px | 500 | 20px | Bold caption / chip labels |
| `{typography.caption}` | 12px | 400 | 17px | Fine print, footer secondary lines |
| `{typography.button-large}` | 18px | 500 | 25px | Large buttons inside forms |
| `{typography.button-md}` | 16px | 500 | 22px | Default button label |

### Principles
- **Sentence-case is the voice.** No all-caps headlines.
- **Weight 700 is for headlines; weight 500 is for buttons and emphasis.** Never promote button labels to 700.
- **No letter-spacing.** The typeface is never tracked, positive or negative.
- **One typeface, three weights.** Pretendard 700 / 500 / 400 only.

---

## Layout

### Spacing System
- **Base unit**: 4px. Most values are multiples of 4, with some 6px sub-multiples (10, 14) inside button padding.
- **Tokens**:
  - `{spacing.xxs}` 4px
  - `{spacing.xs}` 6px
  - `{spacing.sm}` 8px
  - `{spacing.md}` 12px
  - `{spacing.lg}` 16px
  - `{spacing.xl}` 20px
  - `{spacing.2xl}` 24px
  - `{spacing.3xl}` 32px
- **Section padding**: marketing bands at `{spacing.3xl}` 32px top/bottom; hero band at `{spacing.3xl} {spacing.3xl}`.
- **Card interior padding**: content cards at `{spacing.2xl}` 24px; form cards at `{spacing.lg}` 16px.
- **Inline gap**: button rows, chip rows, card grids use `{spacing.md}` 12px between siblings.

### Grid & Container
- **Max width**: ~1200px container; centered with desktop gutters of `{spacing.3xl}` 32px, mobile `{spacing.lg}` 16px.
- **Column patterns**:
  - Candidate card grid: 3-up desktop, 2-up tablet, 1-up mobile.
  - Pledge comparison: 2-up side-by-side desktop, 1-up stacked mobile.
  - Tab navigation: full-width single row.
  - FAQ / accordion: full-width single column.

### Whitespace Philosophy
Card-to-card spacing carries the rhythm — `{spacing.3xl}` 32px gutter between stacked cards; inside a card the headline / paragraph / CTA stack is tight at `{spacing.sm}` 8px between siblings. Black bands and the footer have no internal hairlines — content sits on flat ink with white text.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 600px | Nav collapses to hamburger; cards stack 1-up; comparison view full-width. |
| Mobile-Large | 600–767px | Same as Mobile; tab row enables horizontal scroll. |
| Tablet | 768–1119px | Cards 2-up grid; nav stays horizontal. |
| Desktop | 1120–1135px | Full nav row; cards 3-up. |
| Desktop-Large | >= 1136px | Container caps at ~1200px; bands stay edge-to-edge. |

#### Touch Targets
- `button-primary` pill: ~44px tall (10px vertical padding + 24px label line-height).
- `button-large-rounded`: ~56px tall.
- Category chips inflate to >= 44px tall through extra padding on touch viewports.

#### Collapsing Strategy
- **Nav**: full link row + CTA pills at desktop. Collapses to logo + hamburger at mobile.
- **Candidate cards**: desktop 3-up → tablet 2-up → mobile 1-up full-width.
- **Pledge comparison**: desktop 2-up side-by-side → mobile top/bottom stack.
- **Tab navigation**: horizontally scrollable chip row on mobile.

---

## Elevation & Depth

| Level | Treatment | Usage |
|---|---|---|
| Level 0 — Flat | No shadow, no border. | Default — most cards and surfaces. |
| Level 1 — Subtle Drop | `rgba(0, 0, 0, 0.12) 0px 4px 16px 0px` | Elevated card frames on light bands. |
| Level 2 — Card Drop | `rgba(0, 0, 0, 0.16) 0px 4px 16px 0px` | Region select form card, large content cards. |
| Level 3 — Pill Float | `rgba(0, 0, 0, 0.16) 0px 2px 8px 0px` | Floating white pill over dark or photo surfaces. |

### Decorative Depth
- **Black bands as polarity-flip depth**: pure black `{colors.primary}` mid-page bands break white-on-white rhythm. The polarity shift IS the depth cue.
- **Pill geometry as micro-depth**: `{rounded.pill}` 999px applied at varying button heights creates a stack of nested pills that reads as visual hierarchy.

---

## Shapes

### Border Radius Scale

| Token | Value | Usage |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed hero bands, footer fill, raw image edges. |
| `{rounded.md}` | 8px | Form input fields. |
| `{rounded.lg}` | 12px | Smaller secondary card chrome. |
| `{rounded.xl}` | 16px | Canonical card radius — candidate cards, pledge cards, region select form card. |
| `{rounded.pill}` | 999px | Brand signature interactive shape — every pill button, category chip, tab. |
| `{rounded.full}` | 9999px | Circular icon containers. |

---

## Components

### Buttons

**`button-primary`** — the canonical black pill, the conversion target.
- Background `{colors.primary}`, text `{colors.on-dark}`, label `{typography.button-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.pill}`.

**`button-secondary`** — the white pill paired with the black primary.
- Background `{colors.canvas}`, text `{colors.ink}`, same label and padding as `button-primary`, shape `{rounded.pill}`.

**`button-subtle`** — gray pill for tertiary actions inside cards ("View details", "Compare").
- Background `{colors.canvas-soft}`, text `{colors.ink}`, label `{typography.button-md}`, padding `{spacing.md} {spacing.lg}`, shape `{rounded.pill}`.

**`button-compare`** — floating compare button on candidate cards.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.md}`, shape `{rounded.pill}`. Level 3 pill-float shadow.

### Cards & Containers

**`card-candidate`** — candidate card on the list page.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.xl}`. Displays candidate number, name, party, age. Level 0 default.

**`card-candidate-elevated`** — selected/hover state candidate card.
- Adds Level 1 Subtle Drop shadow.

**`card-pledge`** — pledge detail card with accordion.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.xl}`. Pledge title in `{typography.display-sm}`, content in `{typography.body-md}`.

**`card-compare`** — per-candidate column card on the comparison page.
- Background `{colors.canvas}`, text `{colors.ink}`, padding `{spacing.2xl}`, shape `{rounded.xl}`. Level 1 shadow.

**`card-on-dark`** — card placed on a black band.
- Background `{colors.ink}`, text `{colors.on-dark}`, padding `{spacing.2xl}`, shape `{rounded.xl}`.

**`region-select-card`** — main region selection form card on the hero.
- Background `{colors.canvas}`, padding `{spacing.lg}`, shape `{rounded.xl}`. Level 2 Card Drop shadow.

### Inputs & Forms

**`text-input`** — canonical text input.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, body `{typography.body-md}`, padding `{spacing.lg}`, shape `{rounded.md}`.

**`select-input`** — dropdown selector (region select).
- Same styles as `text-input`. Native select or custom dropdown.

### Navigation

**`nav-bar`** — sticky top navigation.
- Background `{colors.canvas}`. Padding `{spacing.lg} {spacing.3xl}`. Adds Level 1 shadow on scroll.

**`tab-bar`** — election type tabs on the candidate list page.
- Tab item: Background `{colors.canvas-soft}`, active state Background `{colors.primary}` text `{colors.on-dark}`, shape `{rounded.pill}`. Horizontally scrollable on mobile.

**`floating-compare-bar`** — bottom floating bar after selecting candidates to compare.
- Background `{colors.canvas}`, Level 2 shadow, shape `{rounded.xl}`. Selected candidate thumbnails + "Compare pledges" `button-primary`.

**`footer`** — deep black footer band.
- Background `{colors.primary}`, text `{colors.on-dark}`, padding `{spacing.3xl} {spacing.3xl}`. Body in `{typography.body-sm}`.

### Signature Components

**`hero-band`** — main hero section.
- Background `{colors.canvas}`, padding `{spacing.3xl}`. Site title `{typography.display-xxl}`, subtitle `{typography.body-lg}`, `region-select-card`.

**`dday-counter`** — election day D-day countdown widget.
- Background `{colors.primary}`, text `{colors.on-dark}`, shape `{rounded.xl}`, padding `{spacing.2xl}`. Number in `{typography.display-xl}` weight 700, label in `{typography.body-sm}`.

**`pledge-accordion`** — pledge accordion item.
- Background `{colors.canvas}`, question in `{typography.body-md-strong}`, padding `{spacing.lg}` 0. Hairline dividers between rows.

**`category-chip`** — policy category filter chip (transport, youth, welfare, etc.).
- Background `{colors.canvas-soft}`, text `{colors.ink}`, label `{typography.body-sm-strong}`, padding `{spacing.sm} {spacing.lg}`, shape `{rounded.pill}`.

**`party-badge`** — party name badge on candidate cards.
- Background `{colors.canvas-soft}`, text `{colors.ink}`, label `{typography.caption}`, padding `{spacing.xxs} {spacing.sm}`, shape `{rounded.pill}`.

**`candidate-number-badge`** — candidate number badge.
- Background `{colors.primary}`, text `{colors.on-dark}`, label `{typography.body-sm-strong}`, shape `{rounded.full}`. 32px circular.

---

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` (`#000000`) for every primary CTA pill. One black pill per visible viewport is the conversion story.
- Use `{rounded.pill}` 999px on every interactive element (buttons, chips, tabs).
- Render cards at `{rounded.xl}` 16px — candidate cards, pledge cards, and region select cards all share this radius.
- Set every headline in `{typography.display-*}` weight 700, sentence-case.
- Use black promo bands mid-page to break white-on-white rhythm.
- Mobile-first — design at 375px baseline first, then scale up to desktop.

### Don't
- Don't introduce a second brand accent color (blue, red, green, etc.). Party colors must never be used as UI accents.
- Don't use party colors as card backgrounds or highlight colors — political neutrality must be maintained at all times.
- Don't use all-caps display headlines. Sentence-case is the voice.
- Don't drop a shadow on every card. Level 0 flat is the default; shadows are reserved for the floating pill and form cards only.
- Don't apply letter-spacing to headlines.
- Don't use `{rounded.full}` 9999px for cards — cards always use `{rounded.xl}` 16px.
- Don't give any candidate or party a visual advantage — every candidate card must use identical size, style, and layout.
