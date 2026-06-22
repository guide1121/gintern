# Design

## Color Strategy

Restrained — tinted neutrals + accent ≤10%. Primary blue carries CTA and interactive elements. Mint accent for badges and status only.

### Palette

```css
:root {
  /* Background — near-white with faint cool tint */
  --bg: oklch(0.975 0.008 195);           /* #F1FAFA */

  /* Surface — cards, panels */
  --surface: oklch(0.960 0.012 195);       /* slightly darker than bg */

  /* Primary — blue, CTA buttons, links, active states */
  --primary: oklch(0.760 0.080 220);       /* #7FC1E8 */
  --primary-light: oklch(0.880 0.050 220); /* #BFE2F5 — icon bg, avatar placeholder */

  /* Primary text on button — dark blue, NOT white */
  --primary-ink: oklch(0.360 0.060 220);   /* #1E4E68 */

  /* Accent — mint, badges, verified marks, success state */
  --accent: oklch(0.780 0.090 170);        /* #7DD0B8 */
  --accent-ink: oklch(0.330 0.050 165);    /* #1B4B3D */

  /* Ink — body text */
  --ink: oklch(0.280 0.030 175);           /* #223A35 — heading/primary text */
  --muted: oklch(0.410 0.030 180);         /* #3A5C5C — secondary/body text */

  /* Border */
  --border: oklch(0.920 0.020 170);        /* #D6F0E8 — card dividers */
}
```

### Color Rules

- No pastel-on-pastel for text — always dark shade on light background
- CTA buttons use `--primary` bg with `--primary-ink` text (dark blue on blue, not white)
- Mint accent only for: badges, verified marks, success states, small highlights
- If CTA button looks too faded, bump primary one shade darker

## Typography

### Font Stack

```css
:root {
  /* UI font — headings, buttons, nav, labels */
  --font-ui: 'Mitr', sans-serif;

  /* Body font — paragraphs, review content, secondary text */
  --font-body: 'Noto Sans Thai Looped', sans-serif;
}
```

### Scale (fixed rem, product register)

| Role | Size | Weight | Font |
|------|------|--------|------|
| Display / Hero | 2rem | 500 | Mitr |
| H1 | 1.5rem | 500 | Mitr |
| H2 | 1.25rem | 500 | Mitr |
| H3 | 1.125rem | 500 | Mitr |
| Body | 1rem (16px) | 400 | Noto Sans Thai Looped |
| Small / Caption | 0.875rem | 400 | Noto Sans Thai Looped |
| Button / Label | 0.875rem–1rem | 500 | Mitr |

### Typography Rules

- `text-wrap: balance` on h1–h3
- `text-wrap: pretty` on review body text
- Body line length capped at 65–75ch
- Line height: 1.6 for Thai body text (Thai glyphs need more breathing room)

## Layout

### Spacing

Tailwind default 4px base. Key spacing tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `gap-2` | 8px | Inline elements, icon + label |
| `gap-3` | 12px | Card internal padding compact |
| `gap-4` | 16px | Card internal padding standard |
| `gap-6` | 24px | Section gaps, between cards |
| `gap-8` | 32px | Major section separators |
| `gap-12` | 48px | Page section spacing |

### Border Radius

| Element | Radius | Tailwind |
|---------|--------|----------|
| Cards / Containers | 16px | `rounded-2xl` |
| Buttons / Inputs | 12px | `rounded-xl` |
| Badges / Pills | 9999px | `rounded-full` |
| Avatar | 9999px | `rounded-full` |

### Card Style

- **Elevated by Default (นูนตั้งแต่แรก)** — การ์ด กล่องข้อความ และปุ่มต่างๆ จะถูกกำหนดให้มีสไตล์ที่ยกตัวนูนขึ้นมาตั้งแต่เริ่มต้น (Elevated) โดยใช้เงานุ่มแบรนด์ (`Tinted Shadows` ที่อิงสีหมึกเขียวอมน้ำเงินเข้ม `--color-ink`) เพื่อสร้างชั้นและมิติความลึกที่สมจริงโดยไม่ต้องรอให้โต้ตอบ
- ระดับเงาเริ่มต้น (Default):
  - การ์ดมาตรฐาน คอนเทนเนอร์ และปุ่มหลัก: ใช้ `shadow-md` (เงาระดับปานกลางเพื่อให้ดูลอยเด่นชัดขึ้นมาแต่แรก)
  - กล่องข้อความย่อยและฟิลด์อินพุต: ใช้ `shadow-md` หรือ `shadow-sm`
  - หน้าต่าง Modal: ใช้ `shadow-2xl` เพื่อสร้างระยะลอยตัวที่สูงที่สุด
- เมื่อโฮเวอร์ (On Hover):
  - เพื่อลดความเป็น "AI template" (หลีกเลี่ยงการเคลื่อนไหวและการขยายขนาดที่มากเกินไป) การ์ดและปุ่มจะ**ไม่มีการขยายขนาด (no scale)** หรือขยับตำแหน่ง (no translation) แต่จะเปลี่ยนเฉดเงาจากเดิมให้นุ่มลึกขึ้น (เช่น เปลี่ยนเป็น `hover:shadow-lg` หรือคงระดับเงาเดิมและปรับแสง/ความสว่างของพื้นหลังแทน) ทำให้ UI ดูมีสติ มั่นคง และเป็นมืออาชีพมากขึ้น

### Grid

- Mobile-first
- Review feed: single column on mobile, `repeat(auto-fit, minmax(340px, 1fr))` on desktop
- Landing page filters: sticky top on mobile, sidebar on desktop

## Components

### Review Card (Post-style)

```
┌─────────────────────────────┐
│ [Avatar] Name               │
│ ★★★★☆ 4.0  ·  Intern       │
│ Company Name  ·  Position   │
│                             │
│ Review body text...         │
│                             │
│ [Image grid if present]     │
│                             │
│ Mentor ████░ 4  Learning ███░░ 3 │
│ Workload ████░ 4  Culture █████ 5 │
│                             │
│ 💰 15,000 บาท/เดือน        │
│                             │
│ ♡ 12   💬 3                 │
└─────────────────────────────┘
```

### Interactive States

- Default → Hover → Focus → Active → Disabled
- Loading: skeleton shimmer, not spinner
- Empty state: illustration + encouraging copy, not "ไม่มีข้อมูล"

## Motion

- 150–250ms transitions for interactive elements
- Ease-out-quart curve
- Reduced motion: crossfade or instant
- No page-load choreography — content appears immediately
- Card hover: เพื่อความสงบและเรียบหรูของ UI จะหลีกเลี่ยงการขยายขนาด (no scale) และไม่ขยับตำแหน่ง (no translation) ตอน Hover โดยเปลี่ยนมาเน้นที่การโต้ตอบด้วยระดับเงาที่นุ่มนวลลึกขึ้น (`hover:shadow-lg`) พร้อมการปรับพื้นหลังเล็กน้อย 200ms แบบ ease-out

## Accessibility

- WCAG AA throughout
- All interactive elements keyboard-navigable
- Focus visible ring using `--primary`
- `prefers-reduced-motion` respected on all animations
- Touch targets ≥ 44px on mobile
