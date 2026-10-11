/**
 * Renders the first page of a PDF into an actual image file, entirely in
 * the browser. Used so an admin can "upload a PDF" and have it genuinely
 * become a photo (a snapshot of page 1) rather than just a disguised link
 * to the original document.
 */
export async function renderPdfFirstPageToImageFile(file: File): Promise<File> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  if (!canvas.getContext("2d")) throw new Error("Canvas rendering is not supported in this browser.");

  await page.render({ canvas, viewport }).promise;
  await loadingTask.destroy();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("Failed to capture the PDF's first page.");

  const baseName = file.name.replace(/\.[^./]+$/, "") || "certificate";
  return new File([blob], `${baseName}.png`, { type: "image/png" });
}
