# Sujood Gang — Design Tokens

Status: **DRAFT(ai)** — palette derived from the brand logo (`assets/`) and the
approved layout reference (light, airy, dot-grid hero). Pending client approval.

All tokens live in [`app/globals.css`](app/globals.css). Components must use
token-backed utilities (`bg-primary`, `text-muted-foreground`, `shadow-card`, …)
— **no hard-coded hex/oklch values in components**. Changing a token in
`globals.css` restyles the entire app.

## Color

Brand hexes extracted from the logo: deep forest `#105112`/`#173F18`, kelly
`#286822`/`#317D2B`/`#57C34D`, lime burst `#AAE832`/`#C6F144`, chrome silver,
black, white. Stored as oklch for perceptual consistency.

| Token                                  | Light value                                     | Role                                                                               |
| -------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| `--background`                         | warm ivory `oklch(0.985 0.004 110)`             | page canvas (pair with `.bg-dot-grid`)                                             |
| `--foreground`                         | green-tinted near-black `oklch(0.24 0.035 150)` | headlines, body                                                                    |
| `--primary`                            | deep kelly `oklch(0.48 0.13 145)` (≈ `#15701A`) | buttons, links — white text passes AA                                              |
| `--lime`                               | `oklch(0.86 0.21 130)` (≈ `#AAE832`)            | **small pops only**: pills, highlights, badges. Never body text, never large fills |
| `--muted` / `--secondary` / `--accent` | green-tinted light gray                         | cards, soft surfaces                                                               |
| `--muted-foreground`                   | sage-slate                                      | secondary copy                                                                     |
| `--border` / `--input`                 | chrome-tinted gray                              | hairlines, dot grid                                                                |
| `--ring`                               | mid green `oklch(0.6 0.16 138)`                 | focus — darker than lime so the indicator meets 3:1 on ivory                       |

Dark mode (`.dark`) is defined and on-brand (green-black canvas, brighter
green primary) but the site ships light-first.

## Typography

- Sans: **Geist** via `next/font` (`--font-sans`) — DRAFT(ai) placeholder; brand
  font is a one-line swap in `app/layout.tsx`.
- Mono: Geist Mono (`--font-geist-mono`).
- Display sizes (fluid, for heroes): `text-display` (~44→80px, -3% tracking),
  `text-display-sm` (~32→52px). Standard Tailwind scale for everything else.
- The logo's script lettering is logo-only. Never set UI text in script.

## Spacing, radius, shadow

- `--spacing-section` → `py-section`: fluid 64–128px vertical rhythm.
- Radius scale derives from `--radius: 0.625rem` (buttons/cards match the
  layout reference's soft corners).
- `shadow-soft` (subtle lift), `shadow-card` (cards/media) — green-black tinted,
  never pure black.

## Motion

- Durations: `--duration-fast` 150ms (hovers), `--duration-base` 250ms
  (reveals), `--duration-slow` 450ms (hero entrances).
- Easings: `--ease-out-soft` (decelerating, default), `--ease-in-out-soft`.
- `prefers-reduced-motion: reduce` collapses all durations to 0.01ms globally —
  baked into the tokens, nothing extra needed per component.
- Character: calm fades and small translates. No springs, no parallax.

## Utilities

- `.bg-dot-grid` — faint 24px dot grid using `--border`, per the layout
  reference hero.
