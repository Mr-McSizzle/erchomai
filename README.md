# Erchomai Experience

Act as a Senior Creative WebGL Developer and Awwwards-winning UI/UX Engineer. Your task is to build a production-grade, highly immersive, 3D scroll-driven website called "Erchomai" from scratch.

1. TECH STACK & LIBRARIES
You MUST initialize and use the following libraries:

React + Vite + TypeScript (Base framework)

Tailwind CSS (For HTML UI overlays and typography)

@react-three/fiber (For the 3D canvas)

@react-three/drei (For ScrollControls, text, and camera helpers)

framer-motion (For scroll-tied HTML animations and typography fades)

lucide-react (For any minimal UI icons, if needed)

2. DESIGN SYSTEM & MOTION PHILOSOPHY
Color Palette (Strict):

Obsidian Black: #0B0B0B (Background)

Porcelain White: #F5F5F5 (Primary text, particles, figure)

Titanium Silver: #878681 (Secondary text, exoskeleton, wireframes)

Emerald: #00A676 (Accents, final button hover states)

Typography: Use a highly modern, minimal sans-serif (e.g., Inter or a geometric sans). Text should be tracked out cleanly.

Motion Rules: EVERYTHING must feel like precision engineering. High mass, high friction. NO bouncing. NO snapping. NO spring physics. Use smooth, custom easing (e.g., ease-[0.25,1,0.5,1]).

Audio (Web Audio API): Implement a subtle background hum that activates on the user's first click/scroll. Use low ambient resonance (e.g., a low-frequency oscillator) and subtle mechanical white-noise sweeps tied to scroll velocity.

3. THE 3D ARCHITECTURE (CRITICAL INSTRUCTION)
Since you cannot generate custom .gltf models, you must build the 3D scene using procedural R3F geometries that serve as a high-fidelity stand-in for my final assets.

The Figure: Create a beautiful, minimalist, gender-neutral abstract humanoid bust/figure using combined Three.js primitives (e.g., a smooth capsule for the body, a sphere for the head). Give it a matte Porcelain White material.

The Brain: Inside/above the head, place a glowing/intricate core (e.g., a wireframe Icosahedron) representing the exposed brain.

The Exoskeleton: Build parametric, Zaha Hadid-style curved tubes or rings around the figure using TorusKnotGeometry or curved paths.

The Particles: Use Points and BufferGeometry to create thousands of tiny white particles.

4. THE SCROLL EXPERIENCE (0 to 100vh)
Wrap the entire 3D canvas in . Use useScroll and useTransform to map the scroll progress (0 to 1) perfectly to the following 7 scenes:

Hero (Scroll 0):

3D: Matte obsidian background. The white figure stands perfectly still in the center. A subtle, slow "breathing" scale animation (1.0 to 1.02) on the chest area.

HTML UI: Complete silence. No text.

Scroll 1 — Consciousness (Progress 0.15):

3D: Camera slowly pushes in toward the "brain". Thousands of microscopic white particles (Porcelain White) fade in and slowly orbit the brain.

HTML UI: Fade in text (Center): "Every breakthrough begins here."

Scroll 2 — Intelligence (Progress 0.30):

3D: Particles morph into geometric lines shooting outward. They connect to 6 floating geometric nodes.

HTML UI: Text labels appear precisely over the 3D nodes: "Research", "Simulation", "Forecasting", "Synthetic Markets", "Synthetic Customers", "Execution".

Scroll 3 — The Exoskeleton (Progress 0.45):

3D: The floating nodes and lines assemble into a minimal, elegant, parametric architectural framework (Titanium Silver) wrapping around the human figure.

HTML UI: Fade in text (Bottom Left): "Human ambition." (Bottom Right): "Engineered intelligence."

Scroll 4 — The Synthetic World (Progress 0.60):

3D: Background remains black. Around the figure, spawn expansive, translucent 3D wireframe grids representing spatial cities, graphs, and market data. The exoskeleton pulses slightly as if "processing" them.

HTML UI: Fade in text (Center): "Reality is expensive." (Fade in 1 second later): "Simulation isn't."

Scroll 5 — Decision (Progress 0.75):

3D: All particles and wireframes collapse instantly into ONE perfect, bright white line that strikes directly into the figure's brain.

HTML UI: Fade in text (Center): "One decision. Infinite computation."

Scroll 6 — Ouroboros (Progress 0.85):

3D: Camera pulls back. The exoskeleton detaches and rotates, forming a perfect, continuous abstract ring (Ouroboros) around the human. It spins continuously.

HTML UI: A subtle vertical looping list fades in on the left side: Research → Simulation → Prediction → Execution → Feedback → Research.

Scroll 7 — Logo Reveal (Progress 1.0):

3D: The Ouroboros ring compresses into the center, and the human figure dissolves (opacity to 0). Everything morphs into a central point, which then vanishes.

HTML UI: The UI takes over completely. Fade in the massive text logo: "ERCHOMAI". Below it, smaller: "The Future, Arrived." Below that, a sleek, brutalist button with an Emerald hover state: "Begin the Conversation".

5. EXECUTION REQUIREMENTS
Structure: Separate the code cleanly into components: 

, , , and .

Responsiveness: The 3D camera FOV and HTML typography must scale perfectly for both Mobile and Desktop viewports.

Performance: Optimize the particle system using InstancedMesh or raw BufferGeometry to ensure stable 60fps scrolling.

No Boilerplate: Write the complete, functional code for this exact experience. Ensure all imports are correct and the app runs smoothly upon generation.

Build this masterpiece now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/db7b331d-ea9e-4ad1-9e85-ace5c627c9ff).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
