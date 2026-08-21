# DeepSentry — Design System & Design Tokens Specification

> **Master Visual Foundation for Sketch UI/UX Design System**  
> **Aesthetic Direction:** Premium Digital Forensics, Precision, Trust, and High-Clarity Visual Intelligence.

---

## 1. Color Palette & Token Definitions

### 1.1 Canvas & Surface Tokens

| Token Name | HEX Value | Usage & Visual Meaning |
| :--- | :--- | :--- |
| `color.bg.canvas` | `#F7F9FC` | Global page background (Cool-tinted off-white, eliminates glare) |
| `color.bg.surface` | `#FFFFFF` | Primary card background, table surface, modal container |
| `color.bg.surface.subtle` | `#F8FAFC` | Secondary card background, subtle input fill, table header |
| `color.bg.dark.canvas` | `#0F172A` | Deep charcoal for dark cards (Live canvas, Action banner, Monospace inspector) |
| `color.bg.dark.surface` | `#020617` | Pitch black image preview backdrop & heatmap frame |

---

### 1.2 Text & Typography Colors

| Token Name | HEX Value | Usage |
| :--- | :--- | :--- |
| `color.text.primary` | `#0F172A` | Headlines, card titles, prominent metrics, strong emphasis |
| `color.text.secondary` | `#334155` | Secondary headlines, table row text, body copy |
| `color.text.muted` | `#64748B` | Supporting descriptions, metadata labels, helper text |
| `color.text.placeholder` | `#94A3B8` | Form input placeholders, inactive icons, subtle borders |
| `color.text.inverse` | `#FFFFFF` | Text rendered against dark charcoal or colored banners |

---

### 1.3 Brand & Primary Accent

| Token Name | HEX Value | Usage |
| :--- | :--- | :--- |
| `color.brand.primary` | `#2563EB` | Primary buttons, active tabs, selected states, key links |
| `color.brand.hover` | `#1D4ED8` | Hover state for primary action buttons |
| `color.brand.active` | `#1E40AF` | Pressed / active state for buttons |
| `color.brand.tint` | `#EFF6FF` | Soft blue badge background, active navigation background |
| `color.brand.border` | `#BFDBFE` | Subtle border for active badges and highlighted cards |

---

### 1.4 Verdict & Status Forensic Colors

| Category | Token Name | HEX Value | Meaning & Context |
| :--- | :--- | :--- | :--- |
| **REAL / SAFE** | `color.verdict.real.text` | `#047857` | Text for Authentic / Real verdict badge |
| | `color.verdict.real.bg` | `#ECFDF5` | Soft background for Authentic badge |
| | `color.verdict.real.border` | `#A7F3D0` | Border outline for Authentic badge |
| | `color.verdict.real.bar` | `#10B981` | Progress bar fill for Authentic probability |
| **FAKE / SYNTHETIC** | `color.verdict.fake.text` | `#BE123C` | Text for Synthetic / Deepfake verdict badge |
| | `color.verdict.fake.bg` | `#FFF1F2` | Soft background for Deepfake banner |
| | `color.verdict.fake.border` | `#FECDD3` | Border outline for Deepfake badge |
| | `color.verdict.fake.bar` | `#F43F5E` | Progress bar fill for Deepfake probability |
| **REVIEW / UNCERTAIN** | `color.verdict.amber.text` | `#B45309` | Text for Suspicious / Missing EXIF badge |
| | `color.verdict.amber.bg` | `#FFFBEB` | Background for Missing EXIF badge |
| | `color.verdict.amber.border`| `#FDE68A` | Border outline for Warning badge |

---

### 1.5 Border Tokens

| Token Name | HEX Value | Usage |
| :--- | :--- | :--- |
| `color.border.default` | `#E2E8F0` | Default card borders, dividers, table row borders |
| `color.border.strong` | `#CBD5E1` | Input field borders, hover state borders on cards |
| `color.border.dark` | `#1E293B` | Borders inside dark canvas visualizers |

---

## 2. Typography Hierarchy

* **Font Family:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
* **Monospace Family:** `ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace` (Formulas, BBox coords, latency specs)

| Scale Name | Desktop Size | Mobile Size | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `text.hero` | $56\text{px}$ (`3.5rem`) | $36\text{px}$ (`2.25rem`) | Bold ($700$) | $1.12$ | `-0.025em` | Main Home Page Headline |
| `text.h1` | $36\text{px}$ (`2.25rem`) | $28\text{px}$ (`1.75rem`) | Bold ($700$) | $1.20$ | `-0.02em` | Page Headings (Studio, Academy, About) |
| `text.h2` | $26\text{px}$ (`1.625rem`)| $22\text{px}$ (`1.375rem`)| Bold ($700$) | $1.25$ | `-0.015em` | Major Section Titles, Verdict Command Banner |
| `text.h3` | $18\text{px}$ (`1.125rem`)| $16\text{px}$ (`1.0rem`) | Bold ($700$) | $1.35$ | `-0.01em` | Forensic Card Headings, Model Names |
| `text.body` | $15\text{px}$ (`0.9375rem`)| $14\text{px}$ (`0.875rem`)| Regular ($400$)| $1.60$ | `0em` | Explanations, Card Paragraphs, Analysis Notes |
| `text.sm` | $13\text{px}$ (`0.8125rem`)| $12\text{px}$ (`0.75rem`) | Medium ($500$)| $1.50$ | `0em` | Table Cells, Form Labels, Sub-metrics |
| `text.xs` | $11\text{px}$ (`0.6875rem`)| $10\text{px}$ (`0.625rem`)| Semibold ($600$)| $1.40$ | `0.02em` | Status Badges, Timestamps, BBox Labels |

---

## 3. Spacing & Container Scale

* **Base Unit:** $4\text{px}$

| Token | Value | Common Usage |
| :--- | :--- | :--- |
| `space.1` | $4\text{px}$ | Tight badge icon gap, laser line height |
| `space.2` | $8\text{px}$ | Button internal gap, tab padding |
| `space.3` | $12\text{px}$ | Card internal element spacing, table row gap |
| `space.4` | $16\text{px}$ | Standard form field gap, card padding (mobile) |
| `space.6` | $24\text{px}$ | Card padding (desktop), grid gap |
| `space.8` | $32\text{px}$ | Section title bottom margin |
| `space.12` | $48\text{px}$ | Inter-section vertical spacing |
| `space.20` | $80\text{px}$ | Major page section margins |

---

## 4. Border Radius Tokens

| Token | Value | Usage |
| :--- | :--- | :--- |
| `radius.sm` | $6\text{px}$ (`0.375rem`) | Small badges, zoom buttons, tooltip containers |
| `radius.md` | $8\text{px}$ (`0.5rem`) | Form inputs, segmented control buttons |
| `radius.lg` | $12\text{px}$ (`0.75rem`) | Sub-metric boxes, preview image frames |
| `radius.xl` | $16\text{px}$ (`1.0rem`) | Forensic cards, table containers, action banners |
| `radius.2xl`| $24\text{px}$ (`1.5rem`) | Main Upload Dropzone, Hero Canvas container |
| `radius.full`| $9999\text{px}$ | Circular status dots, pills, full-rounded badges |

---

## 5. Shadow & Elevation Tokens

| Token | CSS Definition | Visual Description |
| :--- | :--- | :--- |
| `shadow.xs` | `0 1px 2px 0 rgba(15, 23, 42, 0.04)` | Flat subtle cards, standard buttons |
| `shadow.card` | `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)` | Default state of forensic cards |
| `shadow.hover` | `0 6px 12px -2px rgba(15, 23, 42, 0.06), 0 3px 6px -3px rgba(15, 23, 42, 0.03)` | Card hover state with subtle lift |
| `shadow.modal` | `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)` | Mobile menu drawer, delete confirmation dialog |

---

## 6. Motion & Micro-Interactions

| Interaction | Trigger | Animation Behavior | Duration | Easing |
| :--- | :--- | :--- | :--- | :--- |
| **Card Hover** | Mouse enter | `translateY(-2px)` + `shadow.hover` | $200\text{ms}$ | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **Metric Counter** | Viewport scroll | Numerical count-up ($0 \rightarrow \text{Target}$) | $1000\text{ms}$ | `ease-out` (Cubic) |
| **Progress Bars** | Result load | Bar width fills from $0\% \rightarrow \text{Score}$ | $800\text{ms}$ | `ease-out` (Cubic) |
| **Mobile Drawer** | Menu toggle | Slide down from navbar + opacity fade | $180\text{ms}$ | `ease-in-out` |
| **Laser Sweep** | Infinite loop | Top to bottom vertical sweep line | $2400\text{ms}$ | `ease-in-out alternate` |
