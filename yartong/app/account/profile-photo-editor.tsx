"use client";

import { useEffect, useRef, useState } from "react";

const OUTPUT_SIZE = 420;

type Props = {
  currentImage: string | null;
  displayName: string;
};

export function ProfilePhotoEditor({ currentImage, displayName }: Props) {
  const [imageValue, setImageValue] = useState(currentImage ?? "");
  const [source, setSource] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cameraRef = useRef<HTMLInputElement | null>(null);
  const galleryRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => () => {
    if (source?.startsWith("blob:")) URL.revokeObjectURL(source);
  }, [source]);

  function chooseFile(file?: File) {
    if (!file || !file.type.startsWith("image/")) return;
    if (source?.startsWith("blob:")) URL.revokeObjectURL(source);
    setSource(URL.createObjectURL(file));
    setZoom(1);
    setPreviewOpen(false);
    setEditorOpen(true);
  }

  function applyCrop() {
    const image = imageRef.current;
    if (!image) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const naturalW = image.naturalWidth;
    const naturalH = image.naturalHeight;
    const baseScale = Math.max(OUTPUT_SIZE / naturalW, OUTPUT_SIZE / naturalH);
    const scale = baseScale * zoom;
    const drawW = naturalW * scale;
    const drawH = naturalH * scale;
    const x = (OUTPUT_SIZE - drawW) / 2;
    const y = (OUTPUT_SIZE - drawH) / 2;
    ctx.drawImage(image, x, y, drawW, drawH);
    setImageValue(canvas.toDataURL("image/jpeg", 0.84));
    setEditorOpen(false);
  }

  const initials = (displayName || "Y").slice(0, 1).toUpperCase();

  return (
    <div className="relative">
      <input type="hidden" name="image" value={imageValue} />
      <button type="button" onClick={() => setPreviewOpen(true)} className="group relative grid h-24 w-24 place-items-center overflow-hidden rounded-full border-4 border-white bg-blue-50 text-2xl font-black text-[#0b376f] shadow-md ring-1 ring-slate-200 transition hover:shadow-lg active:scale-[0.98]" aria-label="View and edit profile photo">
        {imageValue ? <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageValue})` }} /> : initials}
        <span className="absolute inset-x-0 bottom-0 bg-slate-950/70 py-1.5 text-center text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100">View photo</span>
      </button>

      <input ref={cameraRef} hidden type="file" accept="image/*" capture="user" onChange={(event) => chooseFile(event.target.files?.[0])} />
      <input ref={galleryRef} hidden type="file" accept="image/*" onChange={(event) => chooseFile(event.target.files?.[0])} />

      {previewOpen ? <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/65 p-4 backdrop-blur-sm" onClick={() => setPreviewOpen(false)}>
        <div className="w-full max-w-sm rounded-3xl bg-white p-5 text-slate-950 shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-black">Profile photo</h2><p className="mt-1 text-xs text-slate-500">Preview, replace or remove your photo.</p></div><button type="button" onClick={() => setPreviewOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-lg">×</button></div>
          <div className="mx-auto mt-5 grid h-52 w-52 place-items-center overflow-hidden rounded-full bg-blue-50 text-5xl font-black text-[#0b376f] ring-4 ring-slate-100 shadow-lg">
            {imageValue ? <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${imageValue})` }} /> : initials}
          </div>
          <div className="mt-6 grid gap-2">
            <button type="button" onClick={() => cameraRef.current?.click()} className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0b1b36] px-4 py-3 text-sm font-black text-white active:scale-[0.99]"><span>◉</span> Take a photo</button>
            <button type="button" onClick={() => galleryRef.current?.click()} className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 active:scale-[0.99]"><span>▧</span> Change from gallery</button>
            <button type="button" onClick={() => { setImageValue(""); setPreviewOpen(false); }} disabled={!imageValue} className="flex w-full items-center justify-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"><span>×</span> Delete profile photo</button>
          </div>
        </div>
      </div> : null}

      {editorOpen && source ? <div className="fixed inset-0 z-[110] grid place-items-center bg-slate-950/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl bg-white p-5 text-slate-950 shadow-2xl">
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-black">Adjust profile photo</h2><p className="mt-1 text-xs text-slate-500">Use the zoom control to fit the photo inside the circle.</p></div><button type="button" onClick={() => setEditorOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-lg">×</button></div>
          <div className="relative mx-auto mt-5 h-72 w-72 overflow-hidden rounded-full bg-slate-100 ring-4 ring-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imageRef} src={source} alt="Crop preview" className="h-full w-full object-cover" style={{ transform: `scale(${zoom})` }} />
          </div>
          <label className="mt-5 block text-xs font-bold text-slate-600">Zoom<input className="mt-2 w-full accent-[#0b1b36]" type="range" min="1" max="2.4" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
          <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setEditorOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold">Cancel</button><button type="button" onClick={applyCrop} className="rounded-xl bg-[#0b1b36] px-5 py-2.5 text-sm font-black text-white">Use photo</button></div>
        </div>
      </div> : null}
    </div>
  );
}