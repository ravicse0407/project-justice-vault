import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Hash, 
  ShieldCheck, 
  ArrowRight,
  RotateCw,
  Eye
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast, setActiveTab } = useApp();

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast("Please choose a document to upload first.", "warning");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status ${res.status}`);
      }

      const data = await res.json();
      setUploadResult(data);
      showToast("Document indexed and cryptographically signed with SHA-256!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to upload and process document.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-full">
          Document AI & Cryptographic Verification Pipeline
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0b1e36] tracking-tight mt-2">
          Verify & Ingest Citizen Document
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload certificates, notifications, or identity proofs (PDF, PNG, JPG). 
          Justice Vault generates SHA-256 checksums, extracts text via OCR fallback, and indexes claims.
        </p>
      </div>

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition ${
          isDragOver 
            ? 'border-cyan-500 bg-cyan-50/50' 
            : file 
              ? 'border-emerald-400 bg-emerald-50/20' 
              : 'border-slate-300 hover:border-slate-400 bg-white'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
        />

        <div className="w-14 h-14 rounded-2xl bg-[#0b1e36] text-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <UploadCloud className="w-7 h-7" />
        </div>

        {file ? (
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900">{file.name}</p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB • Click or drop to replace
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800">
              Drag and drop your document here, or <span className="text-cyan-700 font-bold underline">browse</span>
            </p>
            <p className="text-xs text-slate-400">
              Supported: PDF, PNG, JPG, JPEG (Max 10 MB)
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      {file && !uploadResult && (
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="inline-flex items-center space-x-2 bg-[#0b1e36] hover:bg-[#162e4e] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-sm disabled:opacity-50"
          >
            {uploading ? (
              <>
                <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>Computing SHA-256 & Extracting Text...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Process & Verify Document</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Upload & Verification Results */}
      {uploadResult && (
        <div className="bg-white border border-emerald-300 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                Verification & Extraction Successful
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {uploadResult.filename}
              </h3>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Assigned Document ID</span>
              <span className="font-mono font-bold text-slate-900">{uploadResult.document_id}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Detected Domain</span>
              <span className="font-semibold text-slate-900">{uploadResult.classified_service}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Status & Pages</span>
              <span className="font-semibold text-slate-900">{uploadResult.status} ({uploadResult.page_count} page)</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Digest */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Cryptographic SHA-256 Checksum
            </span>
            <div className="bg-slate-900 text-cyan-300 p-3 rounded-lg text-xs font-mono break-all border border-slate-800 select-all">
              {uploadResult.sha256}
            </div>
          </div>

          {/* OCR Notice if applicable */}
          {uploadResult.ocr_fallback_notice && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{uploadResult.ocr_fallback_notice}</span>
            </div>
          )}

          {/* Extracted Text Preview */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Extracted Text / OCR Preview
            </span>
            <div className="bg-slate-50 p-3.5 rounded-lg text-xs text-slate-700 font-mono leading-relaxed border border-slate-200">
              {uploadResult.extracted_text_preview}
            </div>
          </div>

          {/* CTA to Ask Vault */}
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                setFile(null);
                setUploadResult(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              Upload another document
            </button>

            <button
              onClick={() => setActiveTab('ask')}
              className="inline-flex items-center space-x-1.5 bg-[#0b1e36] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#162e4e] transition"
            >
              <span>Query Against This Document</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
