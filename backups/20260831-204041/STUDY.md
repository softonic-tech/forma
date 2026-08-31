# Forensic Study — reference/hero.png

Source file: `reference/hero.png`, 1672×941 px (aspect ratio ≈ 1.777, i.e. 16:9).
Method: cropped into a 3×3 grid plus targeted zoom crops of the subject, corners,
edges, and every seam/label; sampled raw RGB pixel values at key points; boosted
brightness ×8 / contrast ×2.5 and ran auto-contrast on the empty left zone to rule
out any hidden low-contrast text or watermark.

## 1. Canvas & overall read

A single continuous photographic plate — no baked-in UI chrome anywhere. Confirmed
by brightness-boosting every quadrant: **zero hidden text, logos, or nav elements**
exist in the source file, including in the large empty left region. Whatever
headline/nav/CTA the finished site carries must be original real HTML copy that
respects the mood, not a transcription of something in the image.

Overall palette is a near-monochrome cool nocturnal blue/teal grade, crushed
shadows toward pure black, highlights capped at a cool cyan (never warm white).
Reads as premium editorial/fashion-campaign product photography, not a flat
e-commerce shot — think "temple/institution corridor at night" as the set concept.

## 2. Layout regions (as % of the 1672×941 canvas)

| Region | X range | Y range | Content |
|---|---|---|---|
| Empty copy zone | 0% – ~45% | 0% – 100% | Pure dark gradient, no content. Reserved for headline/nav/CTA. |
| Faint ambient glow | ~8% – 25% | ~15% – 55% | Extremely low-contrast soft circular glow/vignette, barely visible even boosted — an atmospheric artifact, not a design element to reproduce literally. |
| Column corridor | ~55% – 100% | 0% – 100% | Row of receding stone/concrete columns, perspective vanishing toward ~x=65–70%. |
| Cyan uplight bands | vertical bands at ~60%, 68%, 78%, 88% | full height | Thin bright cyan-blue light strips between/behind columns, brightest at column bases. |
| Overhead spotlight | centered ~68–72% | 0% – 15% | Soft cool blue-white conical beam from top, hits the hero figure's shoulder/collar. |
| Floor | full width | ~78% – 100% | Dark polished concrete/stone, reflective, mirrors the blue light bands and figure silhouettes faintly. |

## 3. The three figures — shared traits

All three are **headless mannequin-style product figures**: the garment neckline
is the topmost visible point, cut off cleanly with no head, neck skin, or face.
Legs are cut off above the ankle — no feet, no shoes, ever. All three wear the
identical garment style: V-neck short-sleeve scrub top (chest patch pocket +
pen pocket on the wearer's left, slanted pocket at each hip) over drawstring
cargo-style scrub pants (elastic waistband, drawstring tied in a small bow at
center front, one flapped cargo pocket on the outer thigh of each leg, slanted
hand pockets). Fabric is a soft-matte stretch-woven scrub material — visible
soft fold/wrinkle shading, no shine except along light-hit edges. Each garment
has a plain pale woven neck label inside the collar (illegible generic stripe
pattern at native resolution — no legible brand text) and a small pale
logo-like mark near one sleeve hem (also not legible — treat as an abstract
icon, not text). Pose is frontal, relaxed, arms straight at the sides.

## 4. Center figure — the hero subject (dominant)

- **Position**: widest at hip/leg level, x ≈ 45%–90% of canvas; narrows to
  x ≈ 55%–85% at the shoulders. Vertically from the collar top at **y ≈ 10–12%**
  down to where the legs dissolve into shadow/floor around **y ≈ 90–92%**
  (no feet visible — pants simply fade into darkness/reflection before the floor).
  This is the largest and closest-to-camera of the three, roughly centered
  around x ≈ 68% of the full canvas.
- **Color**: teal / dark cyan-teal. Sampled RGB: mid-tone chest ≈ (28,109,137),
  lit shoulder highlight ≈ (53,151,182), shadowed torso side ≈ (2,66,88),
  near-black at the waistband where light falls off ≈ (0,23,34).
- **Lighting**: the overhead spotlight rakes across the collarbone/shoulders,
  creating a bright highlight arc there; the figure's proper-left edge (image
  right) catches a cyan rim-light from the nearest column uplight; the
  proper-right side and center torso fall into deep, near-black shadow. This
  is a hard, directional, high-contrast light — not soft fill.
- **Pose detail**: perfectly frontal and symmetrical, weight even on both legs,
  a very slight natural bend at the knee (not ramrod straight). The drawstring
  bow at the waist hangs slightly off-axis to the figure's right. Sleeve hems
  sit at mid-bicep, with a soft fold where the sleeve seam meets the shoulder.

## 5. Back-left figure — navy

- Position: x ≈ 44%–60%, y ≈ 35% (collar) to ≈ 90% (fade). Noticeably smaller
  and set further back/left than the hero, standing in front of the columns.
- Color: deep navy, almost swallowed by the background — core shadow ≈ (0,3,19),
  lit side ≈ (9,25,50). Only a thin cyan rim-light along its proper-right
  silhouette separates it from the black backdrop.

## 6. Back-right figure — olive/sage

- Position: x ≈ 76%–92%, y ≈ 35% (collar) to ≈ 90% (fade). Same scale as the
  navy figure, mirrored to the right.
- Color: muted olive/moss green, more evenly lit than the navy figure since
  it sits closer to a column uplight band — mid-tone ≈ (56,78,75), shadow
  ≈ (27,44,42). Desaturated, almost khaki-grey-green, the only garment with
  any warmth at all (and even that is very slight).

## 7. Color mood summary for grading generated assets

- Blacks: near-pure, crushed (RGB floor ≈ 1–4 across channels in deep shadow).
- Backdrop gradient: (1,3,12) → (4,13,25), i.e. near-black navy, very slightly
  lighter toward the corridor/right side.
- Key light / highlights: cool cyan-blue, e.g. (74,119,156) in the spotlight beam,
  never exceeding a cool cyan-white — no warm highlights anywhere in the frame.
- Floor reflections: cool blue-grey, e.g. (54,81,105).
- The only hue variety at all is the three garment colors (teal / navy / olive);
  everything else in the frame is neutral-to-cool blue-black.
- This grade must be baked into the generated images themselves (prompted
  color/lighting direction), never applied afterward as a CSS filter.

## 8. Implications for the build

- No text, logo, or nav exists in the source — real HTML nav/headline/CTA will
  be original copy for a scrubs apparel brand, sized and weighted to sit quietly
  in the empty left zone without fighting the photography.
- Because the hero subject and the empty copy zone occupy separate, non-overlapping
  horizontal bands (subject ~45–100%, copy ~0–45%), no text-behind-subject
  compositing is strictly required by the geometry — but the hero subject will
  still be generated and cut out as its own transparent layer (background plate
  behind, cutout subject on top) so it can be measured and positioned in CSS
  with pixel-accurate control, independent of whatever composition the
  background-plate generation produces.
- Target CSS layout: full-bleed section, no fixed width/height, fluid units only;
  background plate as `background-size: cover`; hero cutout absolutely positioned
  at the measured %; nav/headline/CTA absolutely/flex-positioned in the left zone.
