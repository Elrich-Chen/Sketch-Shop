"use client";

import { useEffect, useRef, useState } from 'react';
// We import specific tools from the official 'fabric' library
import { Canvas, PencilBrush, Line } from 'fabric'; 

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<Canvas | null>(null);
  
  const addGrid = (canvas: Canvas) => {
    const gridSize = 50; // The spacing between lines
    const width = 500;
    const height = 500;
    const gridColor = '#e0e0e0'; // Light Grey

    // 1. Draw Vertical Lines (Loop from Left to Right)
    for (let i = 0; i <= (width / gridSize); i++) {
      const line = new Line([i * gridSize, 0, i * gridSize, height], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: true, // User cannot pick it up
        evented: true,    // Mouse clicks go right through it
      });
      canvas.add(line);
    }

    // 2. Draw Horizontal Lines (Loop from Top to Bottom)
    for (let i = 0; i <= (height / gridSize); i++) {
      const line = new Line([0, i * gridSize, width, i * gridSize], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }
  };

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

    addGrid(newCanvas);
    newCanvas.requestRenderAll();

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
  }, []); //run only once we are saying

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

  const handleClear = () => {
    if (fabricCanvas) {
      
      // 2. The Commands (Now we know it exists, we can write to it)
      fabricCanvas.clear();
      fabricCanvas.set('backgroundColor', 'white');
      addGrid(fabricCanvas);
      fabricCanvas.requestRenderAll();
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Controls */}
      <div className="flex gap-2">
        <button 
          onClick={() => handleClear()} 
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