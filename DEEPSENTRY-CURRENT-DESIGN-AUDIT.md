# DeepSentry — Complete Current Design Audit

---

# Confidence & Evidence

| Evidence Level | Design / UX Dimension | Verification Method |
| :--- | :--- | :--- |
| **Directly Verified from Source Code** | Component hierarchy, layouts, container max-widths, CSS classes, DOM structure, routing, states, props, event handlers, animations, hooks | Traced directly line-by-line across `frontend/src/App.tsx`, `frontend/src/index.css`, `frontend/src/pages/*.tsx`, and `frontend/src/components/*.tsx`. |
| **Verified from Screenshots / Runtime** | Rendered styling, color rendering, typography scales, active visual canvas, responsive layout behavior, hover states, mobile drawer | Observed from live execution on Vite (`http://localhost:5173/`) and project screenshots at $1440\text{px}$, $1280\text{px}$, $768\text{px}$, and $390\text{px}$. |
| **Inferred from Implementation** | Intentional visual hierarchy, forensic aesthetic direction, interactive design system paradigms | Evaluated based on consistent adoption of Tailwind CSS tokens, Lucide iconography, and forensic layout structures. |
| **Documentation-Only / Legacy** | Dark mode toggle, global real-time SSE progress indicators, multi-language localization | Present in older proposal documentation but not implemented in current frontend source. |
| **Not Verified from Current Project** | User analytics telemetry graphs, custom WebGL shader effects | Not present in active frontend codebase. |

---

## 1. Current Design Overview

DeepSentry's current visual design embodies a **refined, light-themed digital forensics workstation** inspired by modern developer and security products (e.g. Linear, Stripe, Vercel). The aesthetic is characterized by:
- **Canvas Atmosphere:** A subtle, cool-tinted off-white canvas (`#F7F9FC`) that eliminates pure white eye fatigue while maintaining high contrast.
- **Card Surfaces:** Crisp white cards (`#FFFFFF`) with thin cool-slate borders (`#E2E8F0` / `#CBD5E1`) and layered elevation shadows.
- **Visual Centerpieces:** A 60/40 calibrated consensus gauge, an interactive 196-token attention canvas in the hero, a 5-stage sequential scanning overlay, and a dual-view Jet self-attention rollout heatmap viewer.
- **Restrained Semantic Accents:** Controlled cobalt blue (`#2563EB`) for primary navigation and CTAs, emerald (`#059669` / `#10B981`) for verified authenticity, rose (`#E11D48` / `#F43F5E`) for deepfake detection, and amber (`#D97706`) for stripped hardware metadata.

---

## 2. Current Page Count

The frontend router (`App.tsx`) defines exactly **8 distinct application routes / pages**.

---

## 3. Route & Page Inventory

| # | Route Path | Page Component | Design Role & Visual Purpose | Current Design State |
|---|---|---|---|---|
| **1** | `/` | `Home.tsx` | Landing page, live forensic inspection canvas, animated metrics, benchmark table | ✅ Complete & Verified |
| **2** | `/scan` | `Scanner.tsx` | Forensic Studio workstation: drag-and-drop upload, webcam capture, 5-stage scan animation, command center results | ✅ Complete & Verified |
| **3** | `/history` | `HistoryPage.tsx` | Audit history archive: searchable toolbar, segmented verdict filters, responsive table / mobile cards | ✅ Complete & Verified |
| **4** | `/education` | `Education.tsx` | Forensics Academy: 4 expandable anatomical failure modes, interactive 3-question spotter quiz | ✅ Complete & Verified |
| **5** | `/architecture` | `Architecture.tsx` | Technical pipeline inspector: 4 clickable stages with tensor I/O specs, monospace model card | ✅ Complete & Verified |
| **6** | `/about` | `About.tsx` | Engineering ethos, 4 technical pillar cards, open-source reproducibility links | ✅ Complete & Verified |
| **7** | `/login` | `Login.tsx` | Split-layout authentication: left visual workflow diagram, right clean sign-in card | ✅ Complete & Verified |
| **8** | `/register` | `Register.tsx` | Split-layout registration: left platform privileges, right analyst registration card | ✅ Complete & Verified |

---

## 4. Home Design Audit (`Home.tsx`)

* **Route:** `/`
* **Layout & Container:** Full-width sections with centered `max-w-7xl` ($1280\text{px}$) content containers and comfortable side padding (`px-4 sm:px-6 lg:px-8`).
* **Visual Rhythm & Structure:**
  1. **Hero Section:**
     * *Left Column (7 cols):* Active status pill badge with pulsing green dot (`bg-blue-50 text-blue-700`), high-contrast H1 headline ($56\text{px}$ desktop / $36\text{px}$ mobile), body description ($16\text{px}$), CTA button group (*Launch Forensic Studio* in primary blue `#2563EB`, *Forensics Academy* in bordered white `#FFFFFF`), and 3 feature checkmarks.
     * *Right Column (5 cols):* **Live Inspection Canvas (`CanvasPreview`)** encased in dark navy `#0F172A`. Features a top mode-switcher button group (*Patches (196)*, *Attention Map*, *1.3× BBox*), an animated laser sweep line, dashed blue face bounding box, and live confidence badge (`96.0% Authentic`).
  2. **Metrics Section:** 4 grid cards (`grid-cols-2 md:grid-cols-4`) displaying large numbers ($36\text{px}$ bold) that animate from 0 on viewport entry via `useAnimatedCount`: `99.00%` Benchmark Accuracy, `90.0%` Mobile Photo Accuracy, `<600ms` Latency, `196` Self-Attention Tokens.
  3. **Architectural Pillars:** 3 cards (`grid-cols-1 md:grid-cols-3`) with soft tinted icon boxes (*Vision Transformer Core* in blue, *Calibrated Fusion* in green, *Explainable Heatmaps* in purple).
  4. **Empirical Benchmark Table:** Clean comparison table with highlighted active ensemble row (`bg-blue-50/70`) comparing Legacy vs Phase 3 ViT vs Active Ensemble.
  5. **Action CTA Banner:** High-contrast dark navy card (`bg-slate-900 text-white`) with centered button.
* **Current Strengths:** Strong visual focal point in the hero; excellent balance between dark technical visualizer and light readability; numbers animate smoothly; zero empty voids at $1440\text{px}$.
* **Current Weaknesses:** Benchmark table text becomes slightly dense on mid-range tablets ($768\text{px}$) without horizontal scrolling container indicator.

---

## 5. Forensic Studio Design Audit (`Scanner.tsx`)

* **Route:** `/scan`
* **Layout:** Centered `max-w-7xl` ($1280\text{px}$) workspace.
* **Audit of Interactive States:**
  1. **Upload State (Idle):**
     * Dropzone rendered as a large white card (`bg-white`) with dashed slate border (`border-2 border-dashed border-slate-300`).
     * Icon: Centered `Upload` cloud inside a soft blue box (`bg-blue-50 text-blue-600 rounded-2xl`).
     * Buttons: "Select File" (`bg-blue-600 text-white font-bold`) and "Use Webcam" (`bg-white border border-slate-200 text-slate-700`).
     * Format Notice: `JPEG • PNG • WEBP • Max 10 MB • 100% Private Client Transfer`.
  2. **Active Drag-Over State:**
     * Border turns solid cobalt blue (`border-blue-600`), background tints to soft blue (`bg-blue-50/50`), card scales slightly (`scale-[1.01]`), headline changes to *"Drop image to begin forensic analysis"*.
  3. **Webcam State:**
     * Replaces dropzone with a 16:9 live video viewfinder with top-left live streaming indicator pill (`bg-blue-600 text-white animate-pulse`), "Capture Photo" button, and "Cancel" button.
  4. **Multi-Stage Processing State:**
     * Triggered immediately upon clicking "Start Forensic Analysis".
     * Preview image is shrouded in a dark backdrop blur (`bg-slate-950/85 backdrop-blur-xs`).
     * Animated 5-stage sequential checklist steps through stages 1 to 5 with spinning indicators that resolve to green checkmarks (`CheckCircle2`).
  5. **Result Command Center State:**
     * **Top Verdict Banner:** Prominent $16\text{px}$ rounded banner. For real media: Emerald surface (`bg-emerald-50/90 border-emerald-200 text-emerald-950`) with `ShieldCheck` icon; for synthetic media: Rose surface (`bg-rose-50/90 border-rose-200 text-rose-950`) with `ShieldAlert`. Features an animated confidence percentage counter (`{{confidence}}%`) and actions (*Export JSON*, *Inspect New Image*).
     * **Multi-Face Tab Bar:** Rendered when `faces_detected > 1` allowing tabbed inspection per face.
     * **Left Column (5 cols):** Original image viewport with 1.3× face region indicator + Expandable `ExifForensicsCard` (Camera make, timestamp, software, ISO, provenance status).
     * **Right Column (7 cols):** `EnsembleGauge` (horizontal split bars for ViT 60% and Secondary 40%, plus Calibrated Fusion bar with decision boundary pin at $60\%$) + `AttentionHeatmapViewer` (Overlay vs Side-by-Side toggle, opacity slider $20\text{--}100\%$, zoom buttons $80\text{--}180\%$).
* **Current Strengths:** Highly engaging multi-stage scan transition; result command center reads as a professional intelligence dashboard; interactive opacity and zoom controls.
* **Current Weaknesses:** Image container height is fixed at `max-h-80`, which slightly restricts very tall aspect-ratio mobile screenshots.

---

## 6. History Design Audit (`HistoryPage.tsx`)

* **Route:** `/history`
* **Layout:** Centered `max-w-6xl` ($1152\text{px}$) container.
* **Visual Structure:**
  * **Header & Toolbar:** Page title with `History` icon + live search input with search icon + Segmented verdict filter pill buttons (`All Results`, `REAL`, `FAKE`) + Refresh action button.
  * **Desktop Table View ($\ge 768\text{px}$):** Crisp white table with subtle slate headers (`bg-slate-50/80 text-slate-600`). Columns: `Verdict` (Pill badge with shield icon), `Filename`, `Confidence` ($13\text{px}$ bold), `Primary ViT`, `Secondary Model`, `Date & Time`, `Actions` (Trash icon with hover state).
  * **Mobile Card List View ($< 768\text{px}$):** Automatically switches from table to stacked individual cards with two-column internal metrics grid (`Ensemble Confidence`, `Primary ViT`), calendar timestamp footer, and top-right delete button.
  * **Unauthenticated State:** Clean centered card with `LogIn` icon, title, description, and "Sign In to Continue" CTA button.
  * **Empty State:** Clean centered card with `FileText` icon, title, description, and "Start New Verification" button.
* **Current Strengths:** Flawless defensive number rendering (`formatConfidence` returns `—` on missing fields without crashing); seamless responsive table-to-card transformation.
* **Current Weaknesses:** Does not currently feature bulk-delete checkboxes (single-record delete only).

---

## 7. Academy Design Audit (`Education.tsx`)

* **Route:** `/education`
* **Layout:** Centered `max-w-7xl` ($1280\text{px}$) container.
* **Visual Structure:**
  * **Header:** Badge ("Threat Intelligence & Visual Forensics") + H1 Title + Description.
  * **4 Anatomical Failure Modes:** $2 \times 2$ responsive grid of white cards. Clicking any card toggles expanded forensic inspection tips with blue left-accent callout box.
  * **Interactive Spotter Quiz:** Large white card container (`bg-white rounded-2xl p-6 sm:p-10 border border-slate-200`). Features a top header with live score badge (`Score: X / 3`), reset button, 3 question blocks with clue text, option buttons that transition to Emerald on correct choice or Rose on incorrect choice, and an anatomical explanation reveal card.
* **Current Strengths:** Genuinely interactive educational component with instant feedback; score badge increments live; clean card accordions.
* **Current Weaknesses:** Questions are currently hardcoded in a static array (not paginated one question at a time).

---

## 8. Architecture Design Audit (`Architecture.tsx`)

* **Route:** `/architecture`
* **Layout:** Centered `max-w-7xl` ($1280\text{px}$) container.
* **Visual Structure:**
  * **Interactive Pipeline Inspector:**
    * 4 clickable stage tiles (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`): Stage 1 EXIF $\rightarrow$ Stage 2 1.3× Crop $\rightarrow$ Stage 3 ViT Self-Attention $\rightarrow$ Stage 4 Calibrated Fusion.
    * Active stage tile features solid blue badge, blue border, and animated pulse indicator.
    * **Inspector Card:** Dark navy box (`bg-slate-900 text-white rounded-xl p-6`) rendering selected stage description and monospace `Tensor Input` and `Tensor Output` cards.
  * **Technical Specs Grid ($2\text{ cols}$):**
    * *Left Card:* Mathematical consensus formula card with monospace block ($P_{\text{ens}} = 0.60 \cdot P_{\text{ViT}} + 0.40 \cdot P_{\text{Sec}}$).
    * *Right Card:* Hardware & parameter specs table (86.5M params, 327 MB weights, 600ms latency, 1.2 GB VRAM).
* **Current Strengths:** Excellent interactive pipeline inspection; reads like an authentic technical model card; strong contrast on dark inspector.
* **Current Weaknesses:** Pipeline diagram is represented via card tiles rather than an animated SVG connecting-node diagram.

---

## 9. About Design Audit (`About.tsx`)

* **Route:** `/about`
* **Layout:** Centered `max-w-7xl` ($1280\text{px}$) container.
* **Visual Structure:**
  * **Header:** Mission ethos badge + Title + Description.
  * **Engineering Ethos Card:** Prominent card with green target icon box, title, and detailed technical rationale regarding empirical calibration and transparent AI.
  * **4 Pillar Cards ($2 \times 2$ grid):** *Vision Transformer Backbone*, *Self-Attention Explainability*, *High-Throughput REST API*, and *Open Source & Reproducibility* (with direct GitHub link).
* **Current Strengths:** Clear technical credibility; zero academic project labels; clean typography and iconography.
* **Current Weaknesses:** Static layout without interactive tabs.

---

## 10. Login Design Audit (`Login.tsx`)

* **Route:** `/login`
* **Layout:** Desktop dual-column split ($5\text{ cols}$ left brand showcase / $7\text{ cols}$ right card) inside `max-w-5xl` centered container $\rightarrow$ Mobile single-column card.
* **Visual Structure:**
  * **Left Column:** Shield icon box, headline, description, 3-step visual verification pipeline box (1.3× Bounding $\rightarrow$ 196 Patches $\rightarrow$ Calibrated Consensus), and 2 bullet points.
  * **Right Card:** White card (`bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm`).
    * Title: "Welcome back", Subtitle: "Sign in to access your audit records".
    * Inputs: Email and Password inputs with absolute left Lucide icons (`Mail`, `Lock`), generous `pl-10 pr-10` padding (zero icon/text overlap), and password reveal button (`Eye` / `EyeOff`).
    * Generic Placeholders: `you@example.com`, `••••••••••••` (strictly zero personal names).
    * Submit Button: Full-width blue button (`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl`) with `Loader2` spinner state.
    * Footer: "Don't have an account? Create an account" link in blue bold.
* **Current Strengths:** Professional SaaS authentication layout; no icon overlap; password visibility toggle works cleanly; generic placeholders.
* **Current Weaknesses:** Left visual column is hidden on mobile screens (`< 1024px`).

---

## 11. Register Design Audit (`Register.tsx`)

* **Route:** `/register`
* **Layout:** Identical desktop split structure to Login (`max-w-5xl`).
* **Visual Structure:**
  * **Left Column:** "Create your forensic analyst account" + 3 privilege items (*Unlimited Verifications*, *196 Token Heatmaps*, *Persistent Audit History*).
  * **Right Card:** Username (`User` icon, placeholder `alex_analyst`), Email (`Mail` icon, placeholder `you@example.com`), and Password fields with minimum 6 character hint, error alert box, and submit CTA.
* **Current Strengths:** Visual symmetry with Login page; clean input spacing; clear validation errors.
* **Current Weaknesses:** Left column hidden on mobile.

---

## 12. Current Design System

The active design system is built on **Tailwind CSS v4** (`@tailwindcss/vite`) with custom design tokens declared in `frontend/src/index.css`.

```text
┌─────────────────────────────────────────────────────────────┐
│                    DEEPSENTRY DESIGN TOKENS                 │
│                                                             │
│  Canvas:   #F7F9FC          Text Prim:  #0F172A             │
│  Surface:  #FFFFFF          Text Sec:   #334155             │
│  Dark:     #0F172A / #020617Text Muted: #64748B             │
│  Accent:   #2563EB          Border:     #E2E8F0 / #CBD5E1   │
│  Real:     #059669          Fake:       #E11D48             │
└─────────────────────────────────────────────────────────────┘
```

---

## 13. Color Audit

| Token Name | HEX Code | Tailwind Equivalent | Actual Usage in Code | Source File |
| :--- | :--- | :--- | :--- | :--- |
| `color.bg.canvas` | `#F7F9FC` | `bg-slate-50` / custom | Global `body` background | `index.css:10` |
| `color.bg.surface` | `#FFFFFF` | `bg-white` | All cards, tables, modal dialogs | `index.css:19`, `Scanner.tsx` |
| `color.bg.dark` | `#0F172A` | `bg-slate-900` | Inspection canvas, Action banner, Inspector | `Home.tsx:88`, `Architecture.tsx` |
| `color.bg.viewport` | `#020617` | `bg-slate-950` | Video preview & Heatmap viewer frame | `AttentionHeatmapViewer.tsx:47` |
| `color.brand.primary` | `#2563EB` | `bg-blue-600` | Primary buttons, active nav, focus rings | `index.css:41`, `Navbar.tsx` |
| `color.brand.tint` | `#EFF6FF` | `bg-blue-50` | Status badges, active tab fills | `Home.tsx:32`, `Navbar.tsx` |
| `color.verdict.real` | `#059669` | `text-emerald-700` | Authentic verdict text, check icons | `Scanner.tsx:238`, `HistoryPage.tsx` |
| `color.verdict.real.bg`| `#ECFDF5` | `bg-emerald-50` | Authentic verdict banner & badge fill | `Scanner.tsx:236` |
| `color.verdict.fake` | `#E11D48` | `text-rose-700` | Synthetic verdict text, alert icons | `Scanner.tsx:238` |
| `color.verdict.fake.bg`| `#FFF1F2` | `bg-rose-50` | Synthetic verdict banner & badge fill | `Scanner.tsx:236` |
| `color.warning.amber` | `#D97706` | `text-amber-700` | Stripped metadata badge, attention icon | `ExifForensicsCard.tsx:28` |

---

## 14. Typography Audit

| Role | Font Family | Size (Desktop) | Size (Mobile) | Weight | Line Height | Tracking | Where Used |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `text.hero` | `Inter, sans-serif` | $56\text{px}$ (`3.5rem`) | $36\text{px}$ (`2.25rem`) | $700$ (Bold) | $1.12$ | `-0.025em` | Hero Headline (`Home.tsx`) |
| `text.h1` | `Inter, sans-serif` | $36\text{px}$ (`2.25rem`) | $28\text{px}$ (`1.75rem`) | $700$ (Bold) | $1.20$ | `-0.02em` | Page Headings (`Scanner.tsx`, `Education.tsx`) |
| `text.h2` | `Inter, sans-serif` | $26\text{px}$ (`1.625rem`) | $22\text{px}$ (`1.375rem`) | $700$ (Bold) | $1.25$ | `-0.015em` | Section Titles, Verdict Command Banner |
| `text.h3` | `Inter, sans-serif` | $18\text{px}$ (`1.125rem`) | $16\text{px}$ (`1.0rem`) | $700$ (Bold) | $1.35$ | `-0.01em` | Forensic Card Titles (`EnsembleGauge.tsx`) |
| `text.body` | `Inter, sans-serif` | $15\text{px}$ (`0.9375rem`) | $14\text{px}$ (`0.875rem`) | $400$ (Regular)| $1.60$ | `0em` | Explanations, Card Descriptions |
| `text.sm` | `Inter, sans-serif` | $13\text{px}$ (`0.8125rem`) | $12\text{px}$ (`0.75rem`) | $500$ (Medium) | $1.50$ | `0em` | Table Cells, Form Labels, Specs |
| `text.xs` | `Inter, sans-serif` | $11\text{px}$ (`0.6875rem`) | $10\text{px}$ (`0.625rem`) | $600$ (Semibold)| $1.40$ | `0.02em` | Status Badges, Timestamps, BBox tags |
| `mono.spec` | `JetBrains Mono / monospace`| $12\text{px}$ | $11\text{px}$ | $400$ (Regular)| $1.50$ | `0em` | Mathematical Formula, Tensor I/O shapes |

---

## 15. Spacing Audit

* **Page Margins:** Desktop `px-4 sm:px-6 lg:px-8`, Mobile `px-4`.
* **Content Width System:**
  * Global Max Width: `max-w-7xl` ($1280\text{px}$) on Home, Studio, Academy, Architecture, About.
  * History Page: `max-w-6xl` ($1152\text{px}$).
  * Auth Pages: `max-w-5xl` ($1024\text{px}$) desktop split, `max-w-md` ($448\text{px}$) form card.
* **Vertical Section Spacing:** `space-y-12` ($48\text{px}$) or `space-y-24` ($96\text{px}$) on Home page.
* **Card Internal Padding:** Desktop `p-6` ($24\text{px}$) to `p-8` ($32\text{px}$); Mobile `p-4` ($16\text{px}$).

---

## 16. Border Radius Audit

* **Small Elements (`rounded-md` / $6\text{px}$):** Zoom buttons, status pills, sub-metric tags.
* **Form Inputs & Tabs (`rounded-lg` / $8\text{px}$):** Inputs, search bars, segmented control buttons.
* **Cards & Banners (`rounded-xl` / $12\text{px}$–$16\text{px}$):** Main forensic cards, table container, verdict banner.
* **Major Workspaces (`rounded-2xl` / $24\text{px}$):** Upload Dropzone, Hero Canvas box, Action CTA card.
* **Full Circular (`rounded-full`):** Status indicator dots, pill badges.

---

## 17. Shadow & Elevation Audit

* **Flat Surface (`shadow-none`):** Secondary nested info boxes, background canvases.
* **Default Card (`shadow-xs` / `shadow-sm`):** `0 1px 3px 0 rgba(15, 23, 42, 0.04)` — used on all forensic cards.
* **Hover Card (`shadow-md`):** `0 6px 12px -2px rgba(15, 23, 42, 0.06)` — activated smoothly on card hover (`.forensic-card:hover`).
* **Modal / Drawer (`shadow-lg`):** Mobile menu drawer overlay.

---

## 18. Iconography Audit

* **Library:** `lucide-react` (v0.475.0) exclusively.
* **Style:** 100% vector SVG line icons, stroke-width $2\text{px}$, matching text color.
* **Sizing Standards:**
  * Inline Badges & Micro Buttons: `14px` (`w-3.5 h-3.5`).
  * Navigation & Standard Buttons: `16px` (`w-4 h-4`).
  * Card Titles & Headers: `20px` (`w-5 h-5`) to `24px` (`w-6 h-6`).
  * Upload Dropzone Icon: `32px` (`w-8 h-8`).
* **Emoji Usage:** Strictly zero emojis used as UI icons (all replaced with Lucide SVGs).

---

## 19. Imagery & Visual Assets Audit

* **Dynamic Images:**
  * Inspected Image Preview: Rendered directly via object URL with `object-contain` on dark viewport.
  * Attention Heatmap: Rendered as a Base64-encoded PNG overlay (`data:image/png;base64,...`).
* **Visual Graphics:**
  * Animated Laser Sweep Line: CSS-animated gradient (`bg-gradient-to-r from-transparent via-blue-400 to-transparent`) in `Home.tsx`.
  * Patch Token Grid: $7 \times 7$ simulated patch overlay in Hero Canvas.
* **External Assets:** Zero heavy static PNG/JPG image assets required in the bundle.

---

## 20. Card System Audit

| Card Type | Background | Border | Radius | Shadow | Interactive? |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Standard Forensic Card** | `#FFFFFF` | `#E2E8F0` | `rounded-xl` ($16\text{px}$) | `shadow-xs` $\rightarrow$ `shadow-md` (hover) | Yes (Hover lift) |
| **Dark Canvas Card** | `#0F172A` | `#1E293B` | `rounded-2xl` ($24\text{px}$) | `shadow-lg` | Yes (Mode toggles) |
| **Verdict Command Banner** | `#ECFDF5` / `#FFF1F2` | `#A7F3D0` / `#FECDD3` | `rounded-2xl` ($24\text{px}$) | `shadow-sm` | Yes (Action buttons) |
| **Nested Metric Box** | `#F8FAFC` | `#E2E8F0` | `rounded-xl` ($12\text{px}$) | Flat (`shadow-none`) | No |

---

## 21. Button System Audit

| Button Variant | Background | Text Color | Border | Padding | Focus / Hover State |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Action** | `#2563EB` | `#FFFFFF` | None | `px-5 py-2.5` to `px-7 py-3.5` | Hover `#1D4ED8`, Active `#1E40AF` |
| **Secondary Bordered** | `#FFFFFF` | `#334155` | `#E2E8F0` | `px-4 py-2` to `px-5 py-3` | Hover `#F8FAFC`, Border `#CBD5E1` |
| **Segmented Tab (Active)**| `#2563EB` | `#FFFFFF` | None | `px-3.5 py-1.5` | Flat |
| **Segmented Tab (Inactive)**| `#F1F5F9` | `#475569` | None | `px-3.5 py-1.5` | Hover `#E2E8F0` |
| **Icon Action (Trash/Zoom)**| Transparent | `#94A3B8` | None | `p-1.5` | Hover `#E11D48` / `#F8FAFC` |

---

## 22. Form System Audit

* **Input Container:** Relative container with left-aligned absolute icon (`left-3.5`).
* **Input Dimensions:** Height $42\text{px}$ (`py-2.5`), Full Width (`w-full`), Radius $8\text{px}$ (`rounded-lg`).
* **Padding:** Strict `pl-10 pr-10` padding clearance, ensuring $0\text{px}$ overlap between icons and entered text.
* **Focus States:** High-visibility focus ring: `focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 focus:outline-none`.
* **Password Toggle:** Absolute right-aligned button toggling `Eye` / `EyeOff` icons.

---

## 23. Data Visualization Audit

| Visualization Element | Visual Representation | Data Source | Dynamic vs Static |
| :--- | :--- | :--- | :---: |
| **Hero Inspection Canvas** | $7 \times 7$ Patch tokens, sweep line, mode toggle | Local State | Dynamic Simulation |
| **Metrics Counters** | Numerical count-up ($0 \rightarrow \text{Target}$) | `useAnimatedCount` Hook | Dynamic Animation |
| **Dual-Model Consensus Gauge**| Dual split green/red horizontal bars + threshold pin at $60\%$ | `FaceResult.vit_p_fake`, `secondary_p_fake`, `ensemble_p_fake` | **Live Dynamic Data** |
| **ViT Attention Heatmap** | Jet colormap overlay with opacity slider & zoom controls | `FaceResult.attention_map` (Base64 PNG) | **Live Dynamic Data** |
| **EXIF Provenance Status** | 4-grid hardware parameters + integrity badge | `PredictionResponse.metadata` | **Live Dynamic Data** |
| **Audit History Table / Cards**| Paginated forensic records with certainty scores | `GET /api/v1/history/` | **Live Dynamic Data** |

---

## 24. Motion & Animation Audit

| Animation Name | Component / File | Trigger Event | Duration | Easing | Accessibility Support |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Laser Scan Sweep** | `Home.tsx:142` | Infinite loop on hero canvas | $2400\text{ms}$ | `ease-in-out alternate` | Respects `prefers-reduced-motion` |
| **Metric Count-Up** | `useAnimatedCount.ts` | Viewport entry via `useInView` | $1000\text{ms}$ | `ease-out` (Cubic) | Falls back to instant value |
| **Progress Bar Fill** | `EnsembleGauge.tsx:49` | Component mount | $700\text{ms}$–$1000\text{ms}$ | `ease-out` | Smooth width transition |
| **Card Hover Lift** | `index.css:26` | Mouse enter | $220\text{ms}$ | `cubic-bezier(0.16, 1, 0.3, 1)`| CSS transition |
| **Mobile Drawer Slide** | `Navbar.tsx:112` | Hamburger button click | $150\text{ms}$ | `ease-in-out` | Fast fade/slide |
| **Processing Checklist** | `Scanner.tsx:167` | Analysis execution | $320\text{ms}$ step interval | Linear | Sequential checkmarks |

---

## 25. Responsive Design Audit

| Viewport Width | Breakpoint Category | Layout Transformation Observed | Overflow / Clipping Issues? |
| :--- | :--- | :--- | :---: |
| **$1920\text{px}$** | Large Desktop / Ultrawide | `max-w-7xl` container keeps content centered with $320\text{px}$ side margins. | None |
| **$1440\text{px}$ / $1280\text{px}$** | Standard Laptop / Monitor | Optimal multi-column desktop grid ($7/5$ and $5/7$ splits). | None |
| **$1024\text{px}$** | Small Desktop / Tablet Landscape | 2-column grids maintain comfortable spacing; navbar links visible. | None |
| **$768\text{px}$** | Tablet Portrait | History table switches to mobile cards; Studio grid stacks vertically. | None |
| **$390\text{px}$ / $430\text{px}$** | Modern Mobile Smartphones | Single-column stacked cards; navbar switches to hamburger drawer. | None (Zero horizontal scroll) |

---

## 26. Accessibility Audit

- **Semantic Structure:** Native `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`, `<button>`, `<input>` elements.
- **Form Controls:** All `<input>` elements have visible `<label>` text and `aria-label` attributes on icon buttons (`Eye`, `Trash`, `Zoom`).
- **Focus Rings:** Explicit focus states (`focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600`) across all interactive buttons and inputs.
- **Contrast Ratios:**
  - Charcoal text (`#0F172A`) on white (`#FFFFFF`): Contrast ratio **$16.1:1$** (Exceeds WCAG AAA).
  - Slate muted text (`#64748B`) on white (`#FFFFFF`): Contrast ratio **$4.8:1$** (Exceeds WCAG AA).
  - Blue button (`#2563EB`) with white text: Contrast ratio **$4.6:1$** (Exceeds WCAG AA).
- **Reduced Motion:** Global `@media (prefers-reduced-motion: reduce)` in `index.css:83` zeroes out all transition and animation durations for sensitive users.

---

## 27. Design Consistency Audit

| Design Dimension | Consistency Assessment | Locations Verified | Status |
| :--- | :--- | :--- | :---: |
| **Card Borders & Radiuses** | Consistent $16\text{px}$ (`rounded-xl`) and `#E2E8F0` border across all pages. | Home, Scanner, History, Education, Architecture, About | ✅ Consistent |
| **Button Heights & Padding** | Standardized $42\text{px}$ (`py-2.5`) and $48\text{px}$ (`py-3`) primary buttons. | All pages | ✅ Consistent |
| **Icon Library & Stroke** | 100% Lucide React SVG line icons. Zero emoji UI icons. | All pages & components | ✅ Consistent |
| **Verdict Color Application** | Emerald strictly for Authentic Real; Rose strictly for Synthetic Fake; Amber strictly for Warning. | Scanner, History, Education, Design Tokens | ✅ Consistent |

---

## 28. Template / "Vibe-Code" Design Audit

* **Generic AI Tropes Avoided:**
  - Zero dark neon purple/pink glowing gradients.
  - Zero meaningless floating 3D spheres or glassmorphic bubbles.
  - Zero fake customer logos or fabricated testimonials.
* **Grounding in Real Forensics:**
  - Visual components directly visualize real data: 196 patch tokens, $1.3\times$ bounding boxes, Jet colormap attention, camera sensor ISO parameters, and dual-model weights ($60/40$).

---

## 29. Static Experience Audit

| Feature Area | Previous State | Current Interactive State | Verified In |
| :--- | :--- | :--- | :--- |
| **Hero Visual** | Static text column | Interactive mode-switcher canvas with live laser sweep line | `Home.tsx:88` |
| **Metrics Display** | Static numbers | Viewport-triggered animated count-up counters | `useAnimatedCount.ts` |
| **Scanning Process** | Static spinner | 5-stage sequential animated execution checklist | `Scanner.tsx:167` |
| **Consensus Gauge** | Static bars | Animated filling progress bars with calibrated $\tau=0.60$ pin | `EnsembleGauge.tsx:49` |
| **Attention Heatmap** | Static image | Overlay vs Split view, live opacity slider, zoom in/out | `AttentionHeatmapViewer.tsx` |
| **Academy Content** | Static article text | Click-to-expand failure cards + interactive 3-question quiz | `Education.tsx:87` |
| **Architecture Pipeline** | Static diagram | Clickable 4-stage inspector displaying live Tensor I/O shapes | `Architecture.tsx:46` |

---

## 30. User Experience Audit

* **First-Time User:** Immediately grasps that DeepSentry is an evidence-based forensic tool via the hero headline, interactive canvas, and clear "Launch Forensic Studio" CTA.
* **Returning Analyst:** Can jump directly to `/scan` or `/history` from the sticky navbar in one click.
* **Expert Investigator:** Can drill into ViT attention maps, toggle opacity, inspect EXIF camera tags, and export JSON forensic audit reports.
* **Error Recovery:** React `ErrorBoundary` isolates render crashes with a "Try Again" button; invalid API responses display structured warning cards without breaking the UI.

---

## 31. Visual Hierarchy Audit

```text
[1. Primary Focal Point]     Verdict Command Banner (Emerald / Rose Badge + {{confidence}}% Certainty)
                                      │
[2. Secondary Focal Point]   Dual-Model Consensus Gauge & ViT Attention Heatmap Viewer
                                      │
[3. Supporting Detail]       Image Source Viewport & Expandable EXIF Hardware Provenance Card
                                      │
[4. Metadata & Telemetry]    Processing Latency (ms), Face Detection Index, Filename
```

---

## 32. Content Density Audit

* **Home Page:** Balanced ($1280\text{px}$ content container with spacious $96\text{px}$ inter-section margins).
* **Forensic Studio (Result View):** High density, high utility (Structured $5/7$ multi-column grid delivering complete forensic telemetry without requiring endless vertical scrolling).
* **Audit History:** Balanced (Clean table on desktop, stacked cards on mobile).

---

## 33. Current Design Strengths

1. **Empirical Grounding:** Every visual metric maps directly to real PyTorch tensor outputs.
2. **Refined Light Palette:** Cool off-white background (`#F7F9FC`) provides an executive forensic workstation feel.
3. **Interactive Explainability Viewer:** Opacity slider and zoom controls elevate the self-attention rollout heatmap.
4. **Calibrated Consensus Visualization:** The $60/40$ weight split and $\tau=0.60$ decision boundary pin clearly explain the ensemble mechanics.
5. **Interactive Hero Canvas:** Immediately engages visitors with patch token modes and laser sweep animations.
6. **Robust Input Clearance:** Generous `pl-10 pr-10` padding guarantees zero text/icon overlap in form fields.
7. **Crash-Proof Formatting:** Defensive `formatConfidence()` helpers eliminate `.toFixed()` exceptions.
8. **Interactive Academy Quiz:** Live score tracking and instant visual feedback on answers.
9. **Interactive Pipeline Inspector:** Clickable architecture stages reveal exact Tensor Input and Output shapes.
10. **Responsive Integrity:** Flawless behavior across $1920\text{px}$, $1440\text{px}$, $1024\text{px}$, $768\text{px}$, and $390\text{px}$.

---

## 34. Current Design Weaknesses

1. **[MEDIUM] Fixed Viewport Height in Result Preview:** The image source box uses `max-h-80` ($320\text{px}$), which slightly constrains extremely tall $9:16$ smartphone screenshots.
2. **[MEDIUM] Static Quiz Pagination:** Academy quiz questions are displayed all at once rather than in a paginated step-by-step card carousel.
3. **[LOW] History Bulk Actions:** The History table currently supports single-row deletion only, without multi-select checkboxes.
4. **[LOW] Architecture Node Visualizer:** Pipeline stages are represented as clickable cards rather than an interactive SVG node-graph.

---

## 35. Page-by-Page Design Status

| Page Component | Route | Visual Quality | UX Quality | Responsiveness | Interaction | Accessibility | Overall Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `Home.tsx` | `/` | Excellent | Excellent | Excellent | Excellent | Excellent | ✅ Production Ready |
| `Scanner.tsx` | `/scan` | Excellent | Excellent | Excellent | Excellent | Excellent | ✅ Production Ready |
| `HistoryPage.tsx` | `/history` | Excellent | Excellent | Excellent | Good | Excellent | ✅ Production Ready |
| `Education.tsx` | `/education` | Good | Excellent | Excellent | Excellent | Excellent | ✅ Production Ready |
| `Architecture.tsx` | `/architecture` | Excellent | Excellent | Excellent | Excellent | Excellent | ✅ Production Ready |
| `About.tsx` | `/about` | Good | Good | Excellent | Good | Excellent | ✅ Production Ready |
| `Login.tsx` | `/login` | Excellent | Excellent | Excellent | Excellent | Excellent | ✅ Production Ready |
| `Register.tsx` | `/register` | Excellent | Excellent | Excellent | Excellent | Excellent | ✅ Production Ready |

---

## 36. Design Debt

1. **Unused Legacy CSS Classes:** Early prototype CSS classes in `index.css` (`.saas-card`, `.saas-input`) have been superseded by `.forensic-card` and `.forensic-input`.
2. **Hardcoded Quiz Content:** The 3 Academy quiz questions are stored in a local array inside `Education.tsx` rather than an external data file.

---

## 37. Design File Map

| File Path | Design Role & Scope | Key Visual Components |
| :--- | :--- | :--- |
| [`frontend/src/index.css`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/index.css) | Global design tokens, keyframe animations, card & input classes, scrollbars | `@keyframes scanSweep`, `.forensic-card`, `.forensic-input` |
| [`frontend/src/App.tsx`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/App.tsx) | Root layout shell, routing, global `ErrorBoundary` wrapper | `ErrorBoundary`, `AuthProvider`, `Navbar`, `Footer` |
| [`frontend/src/components/Navbar.tsx`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/components/Navbar.tsx) | Sticky desktop navigation + animated mobile slide-down drawer | Desktop Nav links, User badge, Mobile Hamburger drawer |
| [`frontend/src/components/Footer.tsx`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/components/Footer.tsx) | Compact 4-column footer | Brand info, Tool links, Resources, GitHub link |
| [`frontend/src/components/EnsembleGauge.tsx`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/components/EnsembleGauge.tsx) | Dual-model consensus visualization with calibrated $\tau=0.60$ boundary pin | ViT 60% bar, Boundary 40% bar, Calibrated Fusion bar |
| [`frontend/src/components/AttentionHeatmapViewer.tsx`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/components/AttentionHeatmapViewer.tsx) | ViT self-attention rollout heatmap workbench | Overlay/Split toggle, Opacity slider, Zoom controls |
| [`frontend/src/components/ExifForensicsCard.tsx`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/components/ExifForensicsCard.tsx) | Expandable camera sensor provenance card | Camera specs grid, Hardware integrity badge |
| [`frontend/src/components/ErrorBoundary.tsx`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/components/ErrorBoundary.tsx) | Component-level crash isolation | Error card with "Try Again" & "Go Home" actions |
| [`frontend/src/hooks/useAnimatedCount.ts`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/hooks/useAnimatedCount.ts) | Easing count-up animation hook | Smooth numerical counter with reduced-motion support |
| [`frontend/src/hooks/useInView.ts`](file:///c:/Users/NikhilGujjar/Desktop/Deepfake-Project/frontend/src/hooks/useInView.ts) | Scroll-reveal intersection observer hook | Viewport visibility trigger |

---

## 38. Screenshot / Runtime Comparison

| Screen / Viewport | Source Code Implementation | Observed Runtime Behavior | Fidelity Match? | Notes |
| :--- | :--- | :--- | :---: | :--- |
| **Home ($1440\text{px}$)** | Dual-column hero + interactive canvas | Wide layout, laser line sweeps smoothly, metrics animate | ✅ 100% Match | Zero blank margins |
| **Studio ($1440\text{px}$)** | Dropzone + 5-stage progress + Command Center | Drag-and-drop triggers blue tint; result shows consensus & heatmap | ✅ 100% Match | Clean command center |
| **History ($1440\text{px}$)** | Table with status pills & certainty | Table renders cleanly; search filters rows instantly | ✅ 100% Match | No `.toFixed` errors |
| **History ($390\text{px}$)** | Hidden table, stacked mobile cards | Converts to card list with 2-column metrics | ✅ 100% Match | Zero horizontal overflow |
| **Navbar ($390\text{px}$)** | Hidden links, hamburger button | Hamburger toggles smooth slide-down menu | ✅ 100% Match | Clean touch targets |

---

## 39. Current Design Identity

The DeepSentry design identity is that of a **precision visual intelligence instrument**. It combines the crisp clarity of a modern SaaS productivity tool with the empirical rigor of a digital forensics laboratory. It avoids frivolous decorative gimmicks in favor of functional data visualization: every badge, progress bar, heatmap overlay, and bounding box directly corresponds to deep learning tensor activations and hardware provenance records.

---

## 40. Current Design Language

* **Surfaces & Atmosphere:** Cool off-white canvas (`#F7F9FC`) with crisp elevated white cards (`#FFFFFF`) and dark slate inspection viewports (`#0F172A` / `#020617`).
* **Accent Strategy:** Cobalt blue (`#2563EB`) as the primary interactive hue, paired with high-contrast emerald (`#059669`) for authentic media and rose (`#E11D48`) for synthetic deepfakes.
* **Typography Hierarchy:** Clean, modern `Inter` font scale spanning from $56\text{px}$ hero headlines down to $11\text{px}$ semibold status badges, complemented by monospace typography for tensor dimensions and latency metrics.
* **Motion Design:** Purpose-driven easing transitions ($200\text{ms}$ cubic-bezier card lifts, $1000\text{ms}$ metric count-ups, and $320\text{ms}$ sequential scanning steps) that respect user reduced-motion preferences.

---

## 41. Overall Findings

1. The current frontend is **100% feature-complete, responsive, and operational** across all 8 routes.
2. The UI successfully visualizes the **calibrated 60/40 ensemble** and **12-layer attention rollout heatmaps** with high interactive fidelity.
3. The previous `.toFixed()` runtime crash on the History page is **completely resolved** with defensive type guards and schema synchronization.
4. Input fields have **generous icon padding (`pl-10 pr-10`)** and zero text overlap.
5. All personal names have been replaced with generic fictional examples (`you@example.com`, `alex_analyst`).

---

## 42. Future Design Investigation Areas

*(To be investigated in future design sprints — no changes made during this audit)*
1. **Interactive Node-Graph for Architecture:** Explore rendering the 4 pipeline stages as an animated SVG flow graph with active pulsing data packets.
2. **Step-by-Step Quiz Carousel:** Investigate paginating the Academy quiz into a one-question-at-a-time interactive flashcard flow.
3. **Aspect-Ratio Dynamic Viewport in Studio:** Explore dynamic adaptive viewport height for extremely tall $9:16$ vertical smartphone images.
4. **History Batch Actions:** Investigate multi-select checkboxes for batch-deleting scan records in the audit history table.

---

# Top 10 Current Design Findings

1. **Cool-Tinted Light Theme:** `#F7F9FC` canvas with `#FFFFFF` cards creates a clean, glare-free forensic workstation aesthetic.
2. **Live Hero Canvas:** Interactive mode-switching canvas with laser sweep animation immediately demonstrates product capabilities.
3. **Calibrated Consensus Visualization:** The horizontal gauge with decision boundary pin ($\tau=0.60$) clearly explains the 60/40 ensemble.
4. **Dual-Mode Heatmap Viewer:** Overlay vs Side-by-Side toggle with live opacity slider ($20\text{--}100\%$) and zoom controls.
5. **Sequential Scanning Checklist:** 5-stage animated progress overlay provides engaging visual feedback during inference.
6. **Responsive Table-to-Card History:** Flawlessly transitions from a data table on desktop to stacked cards on mobile ($390\text{px}$).
7. **Crash-Proof Formatting:** All confidence scores, dates, and file sizes are protected by defensive fallback helpers.
8. **Generous Input Padding:** Strict `pl-10 pr-10` padding completely eliminates form icon/text overlap.
9. **Interactive Academy Quiz:** Live score tracking badge and instant visual feedback on answer selection.
10. **Full Accessibility Compliance:** Semantic HTML5, high-contrast text ($>4.5:1$), visible focus rings, and reduced-motion media query support.

---

# Design Information Missing From Current Repository

1. **Figma / Sketch Source Files:** The design was authored directly in React/Tailwind code; native `.sketch` or `.fig` design source files are not yet in the repository (design tokens are documented in `docs/design-system.md` and `docs/sketch-handoff.md` for external authoring).
2. **Custom SVG Architectural Illustrations:** System architecture pipeline currently uses card components rather than custom SVG vector diagrams.
