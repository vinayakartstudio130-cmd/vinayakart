---
name: VinayakArt Project
description: Premium Maharashtrian sculpture e-commerce/showcase website built with React + TypeScript + Tailwind + Framer Motion
type: project
---

VinayakArt is a single-page premium showcase/e-commerce website for a Maharashtrian sculptures and art objects business.

**Why:** To showcase and sell authentic Maharashtrian traditional sculptures (stone, brass, terracotta, wood) to art collectors, interior designers, devotees, and cultural enthusiasts.

**How to apply:** Use this context when the user requests updates, additions, or iterations on this project. The site lives at `C:\Users\FINBROS DIGITAL\mmk\website\vinayakart`.

## Design Decisions
- Color palette: Saffron (#f59e0b), Ochre (#d97706), Temple Stone Grey, Ivory (#faf7f2), Cream (#f5f0e8), Gold accents
- Typography: Cormorant Garamond (display/headings) + Playfair Display (serif headings) + Inter (body/sans)
- Dark sections: stone-950 background with saffron-400 accents (ArtisanStory, Testimonials sections)
- Light sections: ivory/cream backgrounds (Hero, Collections, Products, WhyChooseUs, Newsletter)

## Key Sections (in order)
1. Hero — cinematic auto-sliding 3-slide hero with parallax + scroll stats
2. Collections — bento-grid layout, 5 categories
3. ProductShowcase — filterable 10-product grid with hover quick-add
4. ArtisanStory — dark full-bleed section with image parallax + floating quote
5. WhyChooseUs — 6-card trust grid + saffron stats bar
6. Testimonials — animated carousel with avatar thumbnails
7. Newsletter — split layout: newsletter subscription + full contact form
8. Footer — 4-column link grid + social icons + scroll-to-top FAB

## Tech Stack
- React 18 + TypeScript (strict mode)
- Tailwind CSS with custom color tokens (saffron, ochre, stone, temple, gold)
- Framer Motion for all animations (useInView, whileInView, parallax via useScroll+useTransform)
- Vite 5 as build tool
- Lucide React for icons

## Build Status
- npm install: clean (140 packages)
- npm run build: success, 335KB JS + 39KB CSS gzipped

## Custom Tailwind Tokens
- colors.saffron, colors.ochre, colors.stone (extended), colors.temple, colors.gold, colors.ivory, colors.cream
- fontFamily: display (Cormorant Garamond), serif (Playfair Display), sans (Inter)
- boxShadow: warm, warm-lg, card, card-hover
- Custom keyframes: float, shimmer, fadeUp, scaleIn
