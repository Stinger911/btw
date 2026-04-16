# Design System Specification: Behind the Wall / За Стеной

## 1. Overview & Creative North Star

### Creative North Star: "The Fractured Terminal"
This design system rejects the "clean" corporate future for a vision of "The Fractured Terminal"—a high-fidelity, industrial interface emerging from a gritty, distorted reality. It is designed to feel like an encrypted terminal found within the "Wall." 

The system moves beyond standard grid-based UI by utilizing **Intentional Asymmetry** and **Aggressive Brutalism**. We do not use rounded corners (`0px` radius throughout); we lean into hard edges, overlapping layers, and "glitched" transitions. The experience should feel heavy, mechanical, and illuminated by the artificial glow of neon data.

---

## 2. Colors

The palette is rooted in absolute darkness, punctuated by high-frequency accents that mimic the bioluminescence and optical sensors found in the source imagery.

### Tonal Logic
- **Primary (`#8ff5ff` / Cyan):** Represents "Data & Connectivity." Used for primary actions and active states.
- **Secondary (`#ff7073` / Red):** Represents "Conflict & Warnings." Used for aggressive alerts and critical UI triggers.
- **Tertiary (`#ffc965` / Amber):** Represents "Industrial Intelligence." Used for warnings, technical labels, and sub-navigation.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for structural sectioning. Use background shifts:
- A `surface-container-low` (`#131315`) section should sit against a `surface` (`#0e0e10`) background. 
- Use **vertical white space** or **texture shifts** to separate content blocks.

### The "Glass & Gradient" Rule
To add depth to the "Fractured Terminal," use semi-transparent `surface` colors with a heavy `backdrop-blur` (20px+) for floating panels. 
- **Signature Gradient:** For high-impact CTAs, use a linear gradient from `primary` (`#8ff5ff`) to `primary-container` (`#00eefc`) at a 45-degree angle. This simulates a "plasma glow" rather than a flat digital fill.

---

## 3. Typography

The typography strategy pits the industrial geometry of **Space Grotesk** against the functional clarity of **Inter**.

- **Display & Headlines (Space Grotesk):** These are your "Industrial Headers." Use all-caps for `display-lg` and `headline-sm` to mimic technical readouts. Letter spacing should be tightened for large displays and widened (+5%) for smaller labels to ensure "high-tech" legibility.
- **Body & Titles (Inter):** Inter provides the "Human Element." It should remain clean and legible against the chaotic, gritty backgrounds. 
- **Hierarchy as Identity:** Use `label-sm` (`#ffc965`) in all-caps for metadata. This creates a "coding terminal" aesthetic where the most technical information is the most visually distinct.

---

## 4. Elevation & Depth

In a world of hard edges, depth is achieved through **Tonal Layering** and **Luminous Bloom**.

- **Layering Principle:** Stack `surface-container` tiers to create hierarchy. A card should be `surface-container-highest` (`#262528`) placed on a `surface-dim` (`#0e0e10`) background. 
- **Ambient Shadows (The Glow):** Do not use black shadows. Instead, use "Bloom." If a component needs to float, apply a large-blur (40px) shadow using a low-opacity version of the component's accent color (e.g., `primary` at 10% opacity). This mimics the way neon light interacts with smoke and grit.
- **The "Ghost Border" Fallback:** If a container requires a boundary, use the `outline-variant` (`#48474a`) at 20% opacity. It must feel like a "scanned" line, not a physical border.
- **Gritty Textures:** Overlay a 5% opacity "noise" or "grain" texture across the entire `background`. This breaks the digital smoothness and aligns with the "gritty" requirement of the creative brief.

---

## 5. Components

### Buttons
- **Primary:** Rectangular, `0px` radius. `primary` background with `on-primary` text. Add a "glitch" hover state where the button shifts 2px horizontally with a secondary color ghosting effect.
- **Secondary:** Transparent background with a `Ghost Border` and `primary` text.
- **Tertiary:** Text-only in `tertiary` color, all-caps, with a preceding `>` character (e.g., `> ACCESS DATA`).

### Input Fields
- **State:** No background fill. Only a bottom-border (2px) using `outline`.
- **Active:** Bottom-border shifts to `primary` with a subtle glow (bloom) effect. Label moves to `label-sm` in `primary` color.

### Cards & Lists
- **Rule:** No dividers. Use a `surface-container-high` background for the card and a 4px left-accent bar in `primary` or `secondary` to denote category.
- **Glitch Elements:** Incorporate "scanline" overlays (horizontal lines at 2% opacity) across high-priority cards.

### Navigation
- **Industrial Tab Bar:** Use `0px` radius containers. Active states should not use a fill; instead, use a `primary` glow on the text and a "bracket" design: `[ HOME ]`.

---

## 6. Do's and Don'ts

### Do
- **DO** use absolute `0px` border radius everywhere.
- **DO** use asymmetry. Align text to the left but place technical metadata (`label-sm`) in the top-right corner of containers.
- **DO** leverage the "Cyan vs. Red" dichotomy. Use Cyan for user-controlled actions and Red for "system-controlled" or "dangerous" information.

### Don't
- **DON'T** use soft shadows or rounded corners. It breaks the industrial, futuristic immersion.
- **DON'T** use 100% opaque borders. They feel "web-template" and lack the sophisticated, layered depth of a high-end terminal.
- **DON'T** use standard transitions. Favor "step-end" animations or "glitch" frames over smooth "ease-in-out" curves.