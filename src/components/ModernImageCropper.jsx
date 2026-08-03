import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Crop,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Check,
  X,
  Grid,
  Maximize2,
} from "lucide-react";

/**
 * Aspect Ratio Presets
 */
const ASPECT_RATIOS = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 / 1 },
  { label: "16:9", value: 16 / 9 },
  { label: "16:10", value: 16 / 10 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "9:16", value: 9 / 16 },
];

/**
 * Helper to calculate rotated bounding box dimensions
 */
function getRotatedSize(width, height, rotation) {
  const rad = (rotation * Math.PI) / 180;
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
}

/**
 * High-Resolution Canvas Exporter
 */
export async function getCroppedCanvasImage(imageSrc, cropPercent, zoom = 1, rotation = 0) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const rad = (rotation * Math.PI) / 180;
      const rotatedSize = getRotatedSize(img.naturalWidth, img.naturalHeight, rotation);

      // Canvas for full rotated/zoomed original image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const zoomedWidth = rotatedSize.width * zoom;
      const zoomedHeight = rotatedSize.height * zoom;

      canvas.width = Math.round(zoomedWidth);
      canvas.height = Math.round(zoomedHeight);

      ctx.translate(zoomedWidth / 2, zoomedHeight / 2);
      ctx.rotate(rad);
      ctx.scale(zoom, zoom);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      // Crop coordinates relative to natural image dimensions
      const cropX = Math.round((cropPercent.x / 100) * zoomedWidth);
      const cropY = Math.round((cropPercent.y / 100) * zoomedHeight);
      const cropW = Math.max(1, Math.round((cropPercent.width / 100) * zoomedWidth));
      const cropH = Math.max(1, Math.round((cropPercent.height / 100) * zoomedHeight));

      const outCanvas = document.createElement("canvas");
      outCanvas.width = cropW;
      outCanvas.height = cropH;

      const outCtx = outCanvas.getContext("2d");
      outCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      outCanvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to export canvas blob"));
            return;
          }
          const file = new File([blob], "cropped_image.jpeg", { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          resolve({ blob, file, url });
        },
        "image/jpeg",
        0.95
      );
    };
    img.onerror = (err) => reject(err);
  });
}

/**
 * Modern Canva/Google Photos Image Cropper
 * Shows 100% full original image in background with an overlay crop rectangle
 */
export default function ModernImageCropper({
  imageSrc,
  aspectRatio = 16 / 10,
  title = "Crop Image",
  onApply,
  onCancel,
  onReset,
}) {
  const wrapperRef = useRef(null);
  const imageRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Measure rendered image position & size inside viewport wrapper
  const [imageBounds, setImageBounds] = useState(null);

  // Aspect ratio state
  const [selectedAspect, setSelectedAspect] = useState(aspectRatio);

  // Zoom & Rotation states
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Crop box state as percentages (0 to 100) relative to imageBounds
  const [crop, setCrop] = useState({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });

  const [showGrid, setShowGrid] = useState(true);

  // Ref tracking for mouse drag operations
  const dragRef = useRef({
    active: false,
    handle: null, // null for box movement, or 'nw','ne','se','sw','n','s','e','w'
    startX: 0,
    startY: 0,
    initialCrop: { x: 10, y: 10, width: 80, height: 80 },
  });

  // Calculate rendered image bounding rect relative to wrapper
  const measureImageBounds = useCallback(() => {
    if (!imageRef.current || !wrapperRef.current) return;
    const imgRect = imageRef.current.getBoundingClientRect();
    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    if (imgRect.width > 0 && imgRect.height > 0) {
      setImageBounds({
        left: imgRect.left - wrapperRect.left,
        top: imgRect.top - wrapperRect.top,
        width: imgRect.width,
        height: imgRect.height,
      });
    }
  }, []);

  useEffect(() => {
    measureImageBounds();
    window.addEventListener("resize", measureImageBounds);
    return () => window.removeEventListener("resize", measureImageBounds);
  }, [measureImageBounds, zoom, rotation]);

  // Center crop overlay based on current aspect ratio
  const centerCropBox = useCallback(
    (targetAspect = selectedAspect) => {
      let w = 80;
      let h = 80;

      if (imageBounds) {
        const imageRatio = imageBounds.width / imageBounds.height;
        if (targetAspect) {
          if (targetAspect > imageRatio) {
            w = 85;
            h = (w / targetAspect) * imageRatio;
          } else {
            h = 85;
            w = (h * targetAspect) / imageRatio;
          }
        }
      }

      setCrop({
        x: (100 - w) / 2,
        y: (100 - h) / 2,
        width: Math.min(100, w),
        height: Math.min(100, h),
      });
    },
    [imageBounds, selectedAspect]
  );

  useEffect(() => {
    if (imageBounds) {
      centerCropBox(selectedAspect);
    }
  }, [imageBounds, selectedAspect, centerCropBox]);

  const handleResetAll = () => {
    setZoom(1);
    setRotation(0);
    setSelectedAspect(aspectRatio);
    centerCropBox(aspectRatio);
    if (onReset) onReset();
  };

  // Live Canvas Preview Updater
  const updateLivePreview = useCallback(() => {
    if (!previewCanvasRef.current || !imageSrc || !imageBounds) return;
    const canvas = previewCanvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      const rad = (rotation * Math.PI) / 180;
      const rotatedSize = getRotatedSize(img.naturalWidth, img.naturalHeight, rotation);

      const zoomedWidth = rotatedSize.width * zoom;
      const zoomedHeight = rotatedSize.height * zoom;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = Math.round(zoomedWidth);
      tempCanvas.height = Math.round(zoomedHeight);
      const tempCtx = tempCanvas.getContext("2d");

      tempCtx.translate(zoomedWidth / 2, zoomedHeight / 2);
      tempCtx.rotate(rad);
      tempCtx.scale(zoom, zoom);
      tempCtx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      const cropX = Math.round((crop.x / 100) * zoomedWidth);
      const cropY = Math.round((crop.y / 100) * zoomedHeight);
      const cropW = Math.max(1, Math.round((crop.width / 100) * zoomedWidth));
      const cropH = Math.max(1, Math.round((crop.height / 100) * zoomedHeight));

      canvas.width = 160;
      canvas.height = 100;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
    };
  }, [imageSrc, crop, imageBounds, zoom, rotation]);

  useEffect(() => {
    updateLivePreview();
  }, [updateLivePreview]);

  // Pointer drag & resize event handler
  const handlePointerMove = useCallback(
    (e) => {
      const d = dragRef.current;
      if (!d.active || !imageBounds) return;

      const deltaXPercent = ((e.clientX - d.startX) / imageBounds.width) * 100;
      const deltaYPercent = ((e.clientY - d.startY) / imageBounds.height) * 100;

      const init = d.initialCrop;
      const imageRatio = imageBounds.width / imageBounds.height;
      const minSize = 8;

      let newX = init.x;
      let newY = init.y;
      let newW = init.width;
      let newH = init.height;

      if (d.handle === null) {
        // Dragging crop box position
        newX = Math.max(0, Math.min(100 - init.width, init.x + deltaXPercent));
        newY = Math.max(0, Math.min(100 - init.height, init.y + deltaYPercent));
      } else {
        // Resizing from handles
        const handle = d.handle;

        if (handle.includes("e")) newW = Math.max(minSize, Math.min(100 - init.x, init.width + deltaXPercent));
        if (handle.includes("w")) {
          const maxLeft = init.x + init.width - minSize;
          newX = Math.max(0, Math.min(maxLeft, init.x + deltaXPercent));
          newW = init.width + (init.x - newX);
        }
        if (handle.includes("s")) newH = Math.max(minSize, Math.min(100 - init.y, init.height + deltaYPercent));
        if (handle.includes("n")) {
          const maxTop = init.y + init.height - minSize;
          newY = Math.max(0, Math.min(maxTop, init.y + deltaYPercent));
          newH = init.height + (init.y - newY);
        }

        // Apply Aspect Ratio Constraint if active
        if (selectedAspect) {
          const effectiveTargetRatio = selectedAspect / imageRatio;

          if (handle === "e" || handle === "w") {
            newH = Math.max(minSize, Math.min(100 - newY, newW / effectiveTargetRatio));
          } else if (handle === "n" || handle === "s") {
            newW = Math.max(minSize, Math.min(100 - newX, newH * effectiveTargetRatio));
          } else {
            if (newW / newH > effectiveTargetRatio) {
              newW = newH * effectiveTargetRatio;
            } else {
              newH = newW / effectiveTargetRatio;
            }
          }
        }
      }

      setCrop({
        x: Math.max(0, Math.min(100 - minSize, newX)),
        y: Math.max(0, Math.min(100 - minSize, newY)),
        width: Math.max(minSize, Math.min(100 - newX, newW)),
        height: Math.max(minSize, Math.min(100 - newY, newH)),
      });
    },
    [imageBounds, selectedAspect]
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current.active = false;
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", handlePointerUp);
  }, [handlePointerMove]);

  const startDrag = (e, handle = null) => {
    e.preventDefault();
    e.stopPropagation();

    dragRef.current = {
      active: true,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialCrop: { ...crop },
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleApplyCrop = async () => {
    try {
      const result = await getCroppedCanvasImage(imageSrc, crop, zoom, rotation);
      if (onApply) onApply(result);
    } catch (error) {
      console.error("Cropping failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950/95 backdrop-blur-md text-white select-none">
      {/* Top Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-800/80 px-6">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gray-800">
            <Crop className="h-5 w-5 text-gray-200" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="text-xs text-gray-400">View complete original image and adjust crop area before applying</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-gray-600 hover:bg-gray-800 hover:text-white transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Main Full Image Viewport */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
        <div
          ref={wrapperRef}
          className="relative max-h-full max-w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black p-2 shadow-2xl"
          style={{ height: "65vh", width: "100%" }}
        >
          {/* Full Original Image (object-contain ensures entire image is visible) */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Source full view"
            onLoad={measureImageBounds}
            className="max-h-full max-w-full object-contain pointer-events-none transition-transform duration-150 ease-out"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          />

          {/* Crop Overlay aligned strictly over displayed image bounds */}
          {imageBounds && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${imageBounds.left}px`,
                top: `${imageBounds.top}px`,
                width: `${imageBounds.width}px`,
                height: `${imageBounds.height}px`,
              }}
            >
              {/* Dimmed Background Overlay outside crop box */}
              <div
                className="absolute inset-0 bg-black/65 transition-opacity"
                style={{
                  clipPath: `polygon(
                    0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,
                    ${crop.x}% ${crop.y}%,
                    ${crop.x}% ${crop.y + crop.height}%,
                    ${crop.x + crop.width}% ${crop.y + crop.height}%,
                    ${crop.x + crop.width}% ${crop.y}%,
                    ${crop.x}% ${crop.y}%
                  )`,
                }}
              />

              {/* Active Resizable Crop Box */}
              <div
                onPointerDown={(e) => startDrag(e, null)}
                className="absolute pointer-events-auto cursor-move border-2 border-white shadow-2xl group"
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                }}
              >
                {/* Grid Lines */}
                {showGrid && (
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-40 group-hover:opacity-75 transition-opacity">
                    <div className="border-r border-b border-white/70" />
                    <div className="border-r border-b border-white/70" />
                    <div className="border-b border-white/70" />
                    <div className="border-r border-b border-white/70" />
                    <div className="border-r border-b border-white/70" />
                    <div className="border-b border-white/70" />
                    <div className="border-r border-white/70" />
                    <div className="border-r border-white/70" />
                    <div />
                  </div>
                )}

                {/* 4 Corner Drag Handles */}
                <div
                  onPointerDown={(e) => startDrag(e, "nw")}
                  className="absolute -top-2 -left-2 h-4 w-4 rounded-tl-md border-t-3 border-l-3 border-white bg-gray-900 shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                />
                <div
                  onPointerDown={(e) => startDrag(e, "ne")}
                  className="absolute -top-2 -right-2 h-4 w-4 rounded-tr-md border-t-3 border-r-3 border-white bg-gray-900 shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                />
                <div
                  onPointerDown={(e) => startDrag(e, "se")}
                  className="absolute -bottom-2 -right-2 h-4 w-4 rounded-br-md border-b-3 border-r-3 border-white bg-gray-900 shadow-md cursor-nwse-resize hover:scale-125 transition-transform"
                />
                <div
                  onPointerDown={(e) => startDrag(e, "sw")}
                  className="absolute -bottom-2 -left-2 h-4 w-4 rounded-bl-md border-b-3 border-l-3 border-white bg-gray-900 shadow-md cursor-nesw-resize hover:scale-125 transition-transform"
                />

                {/* 4 Edge Drag Handles */}
                <div
                  onPointerDown={(e) => startDrag(e, "n")}
                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-2.5 w-8 rounded-full border border-white/80 bg-white/90 shadow-sm cursor-ns-resize hover:scale-110 transition-transform"
                />
                <div
                  onPointerDown={(e) => startDrag(e, "s")}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-2.5 w-8 rounded-full border border-white/80 bg-white/90 shadow-sm cursor-ns-resize hover:scale-110 transition-transform"
                />
                <div
                  onPointerDown={(e) => startDrag(e, "w")}
                  className="absolute top-1/2 -left-1.5 -translate-y-1/2 h-8 w-2.5 rounded-full border border-white/80 bg-white/90 shadow-sm cursor-ew-resize hover:scale-110 transition-transform"
                />
                <div
                  onPointerDown={(e) => startDrag(e, "e")}
                  className="absolute top-1/2 -right-1.5 -translate-y-1/2 h-8 w-2.5 rounded-full border border-white/80 bg-white/90 shadow-sm cursor-ew-resize hover:scale-110 transition-transform"
                />

                {/* Live Dimensions Pill */}
                <div className="absolute top-2 left-2 rounded-md bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm pointer-events-none">
                  {Math.round(crop.width)}% × {Math.round(crop.height)}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Live Thumbnail Preview */}
        <div className="absolute bottom-6 right-6 hidden md:flex flex-col items-center rounded-2xl border border-gray-800 bg-gray-900/90 p-3 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between w-full mb-2">
            <span className="text-[11px] font-medium text-gray-400">Cropped Preview</span>
          </div>
          <div className="overflow-hidden rounded-lg bg-black border border-gray-800">
            <canvas ref={previewCanvasRef} className="h-20 w-32 object-contain" />
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <footer className="flex shrink-0 flex-col gap-4 border-t border-gray-800/80 bg-gray-900/90 px-6 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        {/* Aspect Ratio Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-medium text-gray-400 shrink-0 mr-1">Aspect Ratio:</span>
          {ASPECT_RATIOS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setSelectedAspect(item.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                selectedAspect === item.value
                  ? "bg-white text-gray-900 font-semibold shadow"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Zoom & Rotation Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 min-w-[150px]">
            <ZoomOut className="h-4 w-4 text-gray-400 shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 w-full appearance-none rounded-lg bg-gray-800 accent-white cursor-pointer"
            />
            <ZoomIn className="h-4 w-4 text-gray-400 shrink-0" />
            <span className="text-xs font-mono text-gray-400 w-8">{zoom.toFixed(1)}x</span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-gray-800 pl-4">
            <button
              type="button"
              onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition"
              title="Rotate Left 90°"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono text-gray-400 w-9 text-center">{rotation}°</span>
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition"
              title="Rotate Right 90°"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`rounded-lg p-1.5 transition ${
              showGrid ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
            title="Toggle Grid Lines"
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 sm:pt-0 border-t border-gray-800 sm:border-t-0">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-gray-700 bg-gray-900 px-5 py-2 text-xs font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyCrop}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-xs font-semibold text-gray-950 shadow-lg hover:bg-gray-100 transition"
          >
            <Check className="h-4 w-4 text-gray-950" />
            Apply Crop
          </button>
        </div>
      </footer>
    </div>
  );
}
