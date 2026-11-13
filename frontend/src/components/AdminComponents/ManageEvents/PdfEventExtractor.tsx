import { apiUrl } from "../../../api";
import React, { useState, useRef } from "react";
import {
  Sparkles,
  UploadCloud,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
  ClipboardPaste,
} from "lucide-react";
import { getAuthHeaders } from "../../../utils/auth";
import type { EventFormData } from "./AddEvents";

interface PdfEventExtractorProps {
  onEventExtracted: (extractedData: Partial<EventFormData>) => void;
  setParentStatusMessage?: (
    msg: { type: "success" | "error"; text: string } | null
  ) => void;
}

export const PdfEventExtractor: React.FC<PdfEventExtractorProps> = ({
  onEventExtracted,
  setParentStatusMessage,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [extractedFileName, setExtractedFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTextInput, setShowTextInput] = useState<boolean>(false);
  const [pastedText, setPastedText] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setErrorMessage(null);

    // Validate mime type
    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!validTypes.includes(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage(
        "Please select a valid PDF document or image file (PDF, PNG, JPG)."
      );
      return;
    }

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage("File is too large. Please select a file under 15MB.");
      return;
    }

    setSelectedFile(file);
    // Auto start extraction
    processFile(file);
  };

  const processFile = async (file: File) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setExtractedFileName(null);

    try {
      const reader = new FileReader();

      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
      });

      reader.readAsDataURL(file);
      const dataUrl = await base64Promise;

      // Extract raw base64 string
      const base64Data = dataUrl.includes(";base64,")
        ? dataUrl.split(";base64,")[1]
        : dataUrl;

      const response = await fetch(apiUrl("/api/ai/extract-pdf"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          pdfBase64: base64Data,
          mimeType: file.type || "application/pdf",
          fileName: file.name,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Failed to extract event data");
      }

      if (!result.event) {
        throw new Error("No event data was returned by AI");
      }

      // Populate form
      onEventExtracted(result.event);
      setExtractedFileName(file.name);

      if (setParentStatusMessage) {
        setParentStatusMessage({
          type: "success",
          text: `✨ Successfully extracted "${result.event.title}" from ${file.name}! Form fields have been auto-populated.`,
        });
      }
    } catch (err: any) {
      console.error("AI extraction error:", err);
      const msg = err.message || "Failed to analyze document with AI";
      setErrorMessage(msg);
      if (setParentStatusMessage) {
        setParentStatusMessage({
          type: "error",
          text: `Extraction failed: ${msg}`,
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processText = async () => {
    if (!pastedText.trim()) {
      setErrorMessage("Please enter or paste circular text to analyze.");
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setExtractedFileName(null);

    try {
      const response = await fetch(apiUrl("/api/ai/extract-text"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          rawText: pastedText,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "Failed to extract event data from text");
      }

      onEventExtracted(result.event);
      setExtractedFileName("Pasted Circular Text");

      if (setParentStatusMessage) {
        setParentStatusMessage({
          type: "success",
          text: `✨ Successfully extracted "${result.event.title}" from text! Form fields have been auto-populated.`,
        });
      }
    } catch (err: any) {
      console.error("AI extraction error:", err);
      const msg = err.message || "Failed to analyze text with AI";
      setErrorMessage(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setExtractedFileName(null);
    setErrorMessage(null);
    setPastedText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 rounded-2xl p-6 border border-blue-200/80 shadow-sm relative overflow-hidden mb-2">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Sparkles size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">
                AI Auto-Fill from Notice
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Drag & drop a university circular, exam notice, or schedule PDF to automatically detect and fill all event fields.
            </p>
          </div>
        </div>

        {/* Toggle between File upload and text paste */}
        <button
          type="button"
          onClick={() => {
            setShowTextInput(!showTextInput);
            setErrorMessage(null);
          }}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white/80 border border-blue-200 hover:bg-white transition-all shadow-xs"
        >
          {showTextInput ? (
            <>
              <UploadCloud size={14} /> Upload PDF instead
            </>
          ) : (
            <>
              <ClipboardPaste size={14} /> Paste notice text instead
            </>
          )}
        </button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span className="flex-1">{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Success Banner */}
      {extractedFileName && !isAnalyzing && (
        <div className="mb-4 flex items-center justify-between p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600 shrink-0" />
            <span>
              Extracted from <span className="font-bold underline">{extractedFileName}</span>. Review the form below and make any edits if needed!
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="ml-3 text-[11px] text-green-700 hover:text-green-900 underline font-medium cursor-pointer"
          >
            Upload another file
          </button>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      {!showTextInput ? (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isAnalyzing && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative ${isDragging
              ? "border-blue-500 bg-blue-100/60 scale-[1.005]"
              : isAnalyzing
                ? "border-indigo-300 bg-indigo-50/50 cursor-wait"
                : "border-blue-300/80 bg-white/70 hover:bg-white hover:border-blue-400 hover:shadow-sm"
            }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf,image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
            disabled={isAnalyzing}
          />

          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-4 gap-3">
              <div className="relative">
                <Loader2 size={36} className="text-blue-600 animate-spin" />
                <Sparkles size={16} className="text-amber-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-slate-800">
                  Analyzing document with Gemini AI...
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Extracting title, dates (DD-MM-YYYY), timings, department, and target audience
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 gap-2.5">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full shadow-inner">
                <UploadCloud size={28} />
              </div>

              <div>
                <span className="text-sm font-bold text-slate-800 block">
                  Drag and drop university circular PDF here
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block">
                  or <span className="text-blue-600 underline font-semibold">browse file</span> from your computer
                </span>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <FileText size={12} /> PDF documents
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FileSpreadsheet size={12} /> Notice scans (PNG, JPG)
                </span>
                <span>•</span>
                <span>Up to 15MB</span>
              </div>

              {selectedFile && !extractedFileName && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                  <FileText size={13} />
                  <span>{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReset();
                    }}
                    className="hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Text Paste Alternative */
        <div className="flex flex-col gap-3">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste circular, exam schedule, or notification announcement text here..."
            rows={4}
            disabled={isAnalyzing}
            className="w-full p-3 rounded-xl border border-blue-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={processText}
              disabled={isAnalyzing || !pastedText.trim()}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Analyzing text...
                </>
              ) : (
                <>
                  <Sparkles size={13} /> Extract Event Details
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
