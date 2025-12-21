# How to Add a 3D Denture Model

## Step 1: Download a 3D Model

### Best Sources:
1. **Sketchfab** (https://sketchfab.com)
   - Search for "denture"
   - Filter by "Downloadable" and "Free"
   - Look for GLTF or GLB format

2. **CGTrader** (https://www.cgtrader.com)
   - Search "denture" in free models
   - Medical/dental category

3. **TurboSquid** (https://www.turbosquid.com)
   - Some free models available

### Format Requirements:
- **Preferred**: GLTF (.gltf) or GLB (.glb) - these work directly in the browser
- **STL Files**: STL files are common for 3D printing but need to be converted for web use
  - **Option 1: Blender** (free, recommended)
    1. Download Blender: https://www.blender.org
    2. File → Import → STL
    3. Select your STL file
    4. File → Export → glTF 2.0
    5. Choose GLB format (smaller file size)
  - **Option 2: Online Converters**
    - https://products.aspose.app/3d/conversion (STL to GLTF)
    - https://www.creators3d.com/online-stl-to-gltf-converter
    - https://convertmodel.com
  - **Option 3: Command Line Tools**
    - Use `assimp` or `gltf-pipeline` if you're comfortable with command line
- **Other Formats**: OBJ/FBX also need conversion using the same methods

## Step 2: Add the Model to Your Project

1. Create a `public/models` folder in your project root:
   ```
   public/
     models/
       denture.glb  (or denture.gltf)
   ```

2. Place your downloaded model file in `public/models/`

## Step 3: Update the Code

The `DentureScene.tsx` component has been set up to support both:
- **Procedural model** (current default - simple geometric shapes)
- **3D model file** (when you add one)

### Option A: Replace with 3D Model (Recommended)

If your model has individual teeth that can be selected, update `DentureScene.tsx` to load the model.

### Option B: Use Model as Base, Keep Procedural Teeth

You can load the denture base from the model and still use the procedural teeth for interactivity.

## Example: Loading a GLTF Model

Here's how you would modify `DentureScene.tsx` to load a model:

```typescript
import { useGLTF } from '@react-three/drei'

// In your component:
const { scene } = useGLTF('/models/denture.glb')

return (
  <primitive 
    object={scene} 
    scale={1} 
    position={[0, 0, 0]}
    rotation={[0, rotation, 0]}
  />
)
```

## Tips:

1. **Model Size**: Make sure the model isn't too large (under 5MB is ideal for web)
2. **Optimization**: Use GLB format (binary) instead of GLTF for smaller file sizes
3. **Positioning**: You may need to adjust the model's position, scale, and rotation
4. **Individual Teeth**: If the model has separate tooth meshes, you can make them interactive

## Need Help?

If you find a model and need help integrating it, share:
- The model file format
- Whether teeth are separate meshes or one combined mesh
- Any specific requirements

I can help you modify the code to work with your specific model!

