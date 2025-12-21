# 3D Denture Portfolio

An interactive portfolio website featuring a 3D denture model where you can pull out teeth to reveal different sections of your resume and portfolio.

## Features

- 🦷 **Interactive 3D Denture Model** - A realistic denture rendered with Three.js
- 🎯 **Pull Teeth to Explore** - Click on any tooth to pull it out and reveal portfolio content
- 🔄 **Rotation Control** - Drag the arrow bar at the bottom to rotate the 3D model
- 📄 **Content Panels** - Beautiful modal panels that display your resume sections
- ✨ **Smooth Animations** - Polished interactions and transitions

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Customization

### Adding Your Content

Edit `src/App.tsx` to customize the portfolio data. The `portfolioData` array contains all the content that appears when teeth are pulled:

```typescript
const portfolioData: PortfolioItem[] = [
  {
    id: 'tooth-1',
    title: 'About Me',
    description: 'Learn about my background',
    content: `# Your Content Here...`,
    tags: ['About']
  },
  // Add more items...
]
```

### Styling

- `src/App.css` - Main app styles
- `src/components/ContentPanel.css` - Content panel modal styles
- `src/components/RotationControl.css` - Rotation slider styles

### 3D Model

The denture model is procedurally generated in `src/components/DentureScene.tsx`. You can:
- Adjust the number of teeth
- Change colors and materials
- Modify the arch shape
- Add a custom 3D model (GLTF/GLB format)

## Technologies

- **Vite** - Build tool and dev server
- **React** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for react-three-fiber
- **react-markdown** - Markdown rendering for content

## Project Structure

```
src/
├── App.tsx                 # Main app component
├── components/
│   ├── DentureScene.tsx    # 3D denture model
│   ├── ContentPanel.tsx    # Content modal
│   ├── ContentPanel.css
│   ├── RotationControl.tsx # Rotation slider
│   └── RotationControl.css
├── App.css
└── index.css
```

## License

MIT
