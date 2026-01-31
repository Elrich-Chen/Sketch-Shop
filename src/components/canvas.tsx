"use client";

import { useEffect, useRef, useState } from 'react';
// We import specific tools from the official 'fabric' library
import { Canvas, PencilBrush } from 'fabric'; 

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);

  // --- 1. SETUP THE BOARD ---
  useEffect(() => {
    // If the HTML tag isn't ready, wait.
    if (!canvasRef.current) return;

    // Initialize the Fabric Canvas
    const newCanvas = new Canvas(canvasRef.current, {
      isDrawingMode: true, // Turn on the Pencil
      width: 500,
      height: 500,
      backgroundColor: 'white',
    });

    // Configure the Pencil Brush
    const brush = new PencilBrush(newCanvas);
    brush.color = 'black';
    brush.width = 5;
    newCanvas.freeDrawingBrush = brush;

    // Save it to state so we can use it later
    setFabricCanvas(newCanvas);

    // Cleanup (Destroy the board when we leave the page)
    return () => {
      newCanvas.dispose();
    };
  }, []);

  // --- 2. THE SEARCH FUNCTION ---
  const handleSearch = () => {
    if (fabricCanvas) {
      // Convert the drawing to an Image String (Base64)
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2 // High quality
      });
      
      console.log("Ready for Gemini:", dataURL);
      alert("Image Captured! Check Console.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Controls */}
      <div className="flex gap-2">
        <button 
          onClick={() => fabricCanvas?.clear()} 
          className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600"
        >
          Clear
        </button>
        <button 
          onClick={handleSearch} 
          className="bg-black text-white px-4 py-2 rounded font-bold hover:bg-gray-800"
        >
          Search with Gemini
        </button>
      </div>

      {/* The Canvas Area */}
      <div className="border-4 border-black shadow-xl">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}