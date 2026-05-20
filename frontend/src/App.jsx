import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import {
  UploadCloud,
  FileText,
  Sparkles,
  ShieldCheck,
  Search,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Layers,
  Zap,
  FileSearch,
  ArrowRight,
  ClipboardCheck,
  Lock,
  Database,
  ScanText,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import "./index.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setAnalysis(null);
    setFileInfo(null);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    if (file.type === "application/pdf") {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please upload a document first.");
      return;
    }

    try {
      setLoading(true);
      setAnalysis(null);
      setFileInfo(null);

      const formData = new FormData();
      formData.append("document", selectedFile);

      const response = await axios.post(
        "http://localhost:5000/api/documents/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Backend response:", response.data);

      setAnalysis(response.data.analysis);
      setFileInfo({
        fileName: response.data.fileName,
        fileType: response.data.fileType,
        extractedText: response.data.extractedText,
        extractedTextPreview: response.data.extractedTextPreview,
      });
    } catch (error) {
      console.error("Document analysis failed:", error);

      const message =
        error.response?.data?.error ||
        "Failed to analyze document. Please check backend, API key, and uploaded file.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <BackgroundGlow />

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProfessionalInfoSection />
        <UploadSection
          selectedFile={selectedFile}
          handleFileChange={handleFileChange}
          handleAnalyze={handleAnalyze}
          loading={loading}
        />

        {loading && <LoadingPanel />}

        {analysis && (
          <ResultsDashboard
            analysis={analysis}
            fileInfo={fileInfo}
            previewUrl={previewUrl}
          />
        )}

        <Footer />
      </div>
    </main>
  );
}

function BackgroundGlow() {
  return (
    <>
      <div className="absolute left-[-120px] top-[-120px] h-96 w-96 rounded-full bg-cyan-500/30 blur-3xl" />
      <div className="absolute right-[-140px] top-[120px] h-[420px] w-[420px] rounded-full bg-violet-600/30 blur-3xl" />
      <div className="absolute bottom-[-160px] left-[25%] h-[460px] w-[460px] rounded-full bg-blue-600/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%)]" />
    </>
  );
}

function Navbar() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
          <FileSearch className="h-6 w-6 text-cyan-300" />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-wide">DocuFlow AI</h1>
          <p className="text-xs text-slate-400">
            AI Document Analysis Platform
          </p>
        </div>
      </div>

      <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
        <a href="#overview" className="transition hover:text-white">
          Overview
        </a>
        <a href="#upload" className="transition hover:text-white">
          Analyze
        </a>
        <a href="#results" className="transition hover:text-white">
          Results
        </a>
      </div>

      <a
        href="#upload"
        className="rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white backdrop-blur-xl transition hover:bg-white/20"
      >
        Analyze Document
      </a>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 backdrop-blur-xl">
          <Sparkles className="h-4 w-4" />
          AI-powered document understanding platform
        </div>

        <h2 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Turn complex documents into{" "}
          <span className="gradient-text">clear insights.</span>
        </h2>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          DocuFlow AI helps users upload documents and instantly understand what
          they contain. It reads the document, identifies its category,
          summarizes the content, extracts important details, highlights missing
          information, and suggests useful next steps.
        </p>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
          This platform is useful for reviewing resumes, invoices, contracts,
          reports, forms, and business documents faster without manually reading
          every page.
        </p>

        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <a
            href="#upload"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-7 py-4 font-semibold text-white shadow-2xl shadow-blue-900/40 transition hover:scale-[1.03]"
          >
            Analyze Document
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </a>

          <a
            href="#overview"
            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
          >
            Learn How It Works
          </a>
        </div>

        <DocumentTypeRow />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="glass-card rounded-[2rem] p-5"
      >
        <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Analysis Preview</p>
              <h3 className="text-xl font-bold">
                Document Intelligence Report
              </h3>
            </div>

            <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-300">
              Ready
            </div>
          </div>

          <div className="space-y-4">
            <PreviewRow
              icon={<Brain className="h-5 w-5 text-cyan-300" />}
              title="Document Classification"
              value="Identifies whether the uploaded file is a resume, invoice, contract, report, or another supported document."
            />

            <PreviewRow
              icon={<FileText className="h-5 w-5 text-violet-300" />}
              title="Smart Summary"
              value="Generates a short, readable summary so users can understand the document quickly."
            />

            <PreviewRow
              icon={<Search className="h-5 w-5 text-blue-300" />}
              title="Key Information Extraction"
              value="Finds names, dates, emails, amounts, organizations, skills, and important terms."
            />

            <PreviewRow
              icon={<AlertTriangle className="h-5 w-5 text-amber-300" />}
              title="Missing Detail Detection"
              value="Highlights missing or incomplete information based on the document type."
            />

            <PreviewRow
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-300" />}
              title="Visual Evidence"
              value="Shows the uploaded PDF visually and highlights important values used during analysis."
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function DocumentTypeRow() {
  const documentTypes = [
    "Resumes",
    "Invoices",
    "Contracts",
    "Reports",
    "Forms",
    "Letters",
    "Business Documents",
  ];

  return (
    <div className="mt-10">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
        Documents it can analyze
      </p>

      <div className="flex flex-wrap gap-3">
        {documentTypes.map((type, index) => (
          <span
            key={index}
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200 backdrop-blur-xl transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

function PreviewRow({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
      <div className="flex gap-3">
        <div className="mt-1">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-300">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ProfessionalInfoSection() {
  return (
    <section id="overview" className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InfoCard
          icon={<ScanText className="h-6 w-6 text-cyan-300" />}
          title="What this website does"
          description="DocuFlow AI reads uploaded documents and converts them into structured, easy-to-understand insights. It helps users quickly understand the document without reading everything manually."
        />

        <InfoCard
          icon={<ClipboardCheck className="h-6 w-6 text-violet-300" />}
          title="Why it is useful"
          description="It saves time by identifying the document type, generating a summary, extracting important details, and showing missing or incomplete information that may need attention."
        />

        <InfoCard
          icon={<Database className="h-6 w-6 text-blue-300" />}
          title="How it helps users"
          description="Users can review resumes, contracts, reports, invoices, forms, and business files faster while receiving a clear report with risks and recommended next steps."
        />
      </div>
    </section>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card-soft rounded-[2rem] p-6 transition duration-300 hover:scale-[1.02] hover:bg-white/10"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-white">{title}</h3>

      <p className="mt-4 text-sm leading-7 text-slate-300">{description}</p>
    </motion.div>
  );
}

function UploadSection({
  selectedFile,
  handleFileChange,
  handleAnalyze,
  loading,
}) {
  return (
    <section id="upload" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Upload
        </p>

        <h2 className="mt-3 text-4xl font-black md:text-5xl">
          Analyze your document
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-slate-300">
          Upload a document and let the system extract text, classify the
          document, summarize the content, identify key details, and detect
          missing information.
        </p>
      </div>

      <div className="glass-card mx-auto max-w-4xl rounded-[2rem] p-6 md:p-8">
        <label
          htmlFor="document-upload"
          className="group flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-white/20 bg-white/[0.06] px-6 py-14 text-center transition hover:border-cyan-300/60 hover:bg-cyan-300/[0.08]"
        >
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-cyan-400/20 to-violet-500/20">
            <UploadCloud className="h-10 w-10 text-cyan-200 transition group-hover:scale-110" />
          </div>

          <h3 className="text-2xl font-bold">
            Upload a document for analysis
          </h3>

          <p className="mt-3 max-w-lg text-slate-300">
            The platform reads your file and produces a structured report with
            the document type, summary, extracted details, missing fields, risks,
            recommended actions, and visual PDF highlights.
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Supported file formats: PDF, DOCX, TXT
          </p>

          <input
            id="document-upload"
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            className="file-input-hidden"
          />
        </label>

        {selectedFile && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/10">
                  <FileText className="h-6 w-6 text-cyan-300" />
                </div>

                <div>
                  <p className="font-semibold text-white">
                    {selectedFile.name}
                  </p>

                  <p className="text-sm text-slate-400">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 px-6 py-3 font-semibold text-white shadow-xl shadow-blue-900/30 transition hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-5 w-5" />
                {loading ? "Analyzing..." : "Analyze Now"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingPanel() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="glass-card mx-auto max-w-4xl rounded-[2rem] p-8 text-center">
        <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-white/10 border-t-cyan-300" />

        <h3 className="text-2xl font-bold">Analyzing your document...</h3>

        <p className="mt-3 text-slate-300">
          Extracting text, classifying document type, finding key information,
          and preparing the visual highlight preview.
        </p>
      </div>
    </section>
  );
}

function ResultsDashboard({ analysis, fileInfo, previewUrl }) {
  const keyDetails = analysis.keyDetails || {};

  return (
    <section id="results" className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-300">
            Results
          </p>

          <h2 className="mt-3 text-4xl font-black md:text-5xl">
            Document intelligence report
          </h2>

          {fileInfo?.fileName && (
            <p className="mt-3 text-sm text-slate-400">
              File analyzed: {fileInfo.fileName}
            </p>
          )}
        </div>

        <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-5 py-2 text-sm font-semibold text-emerald-200">
          Analysis completed
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ResultCard
          icon={<Layers className="h-6 w-6 text-cyan-300" />}
          title="Document Type"
          className="lg:col-span-1"
        >
          <p className="text-3xl font-black">
            {analysis.documentType || "Unknown"}
          </p>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
              style={{ width: `${analysis.confidenceScore || 0}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-300">
            Confidence Score: {analysis.confidenceScore || 0}%
          </p>
        </ResultCard>

        <ResultCard
          icon={<FileText className="h-6 w-6 text-violet-300" />}
          title="Summary"
          className="lg:col-span-2"
        >
          <p className="leading-8 text-slate-200">
            {analysis.summary || "No summary generated."}
          </p>
        </ResultCard>

        <ResultCard
          icon={<FileText className="h-6 w-6 text-cyan-300" />}
          title="Uploaded Document Preview With Highlights"
          className="lg:col-span-3"
        >
          <VisualDocumentPreview
            fileUrl={previewUrl}
            fileType={fileInfo?.fileType}
            extractedText={fileInfo?.extractedText}
            analysis={analysis}
          />
        </ResultCard>

        <ResultCard
          icon={<Search className="h-6 w-6 text-blue-300" />}
          title="Extracted Key Details"
          className="lg:col-span-2"
        >
          <DetailGroup title="Names" items={keyDetails.names} />
          <DetailGroup title="Emails" items={keyDetails.emails} />
          <DetailGroup title="Phone Numbers" items={keyDetails.phoneNumbers} />
          <DetailGroup title="Dates" items={keyDetails.dates} />
          <DetailGroup title="Amounts" items={keyDetails.amounts} />
          <DetailGroup title="Addresses" items={keyDetails.addresses} />
          <DetailGroup title="Organizations" items={keyDetails.organizations} />
          <DetailGroup title="Skills" items={keyDetails.skills} />
          <DetailGroup
            title="Important Terms"
            items={keyDetails.importantTerms}
          />

          {!hasAnyDetails(keyDetails) && (
            <p className="text-sm text-slate-400">
              No key details were extracted from this document.
            </p>
          )}
        </ResultCard>

        <ResultCard
          icon={<AlertTriangle className="h-6 w-6 text-amber-300" />}
          title="Missing Details"
        >
          <ListItems items={analysis.missingDetails} type="warning" />
        </ResultCard>

        <ResultCard
          icon={<ShieldCheck className="h-6 w-6 text-rose-300" />}
          title="Risks or Issues"
        >
          <ListItems items={analysis.risksOrIssues} type="risk" />
        </ResultCard>

        <ResultCard
          icon={<Zap className="h-6 w-6 text-emerald-300" />}
          title="Recommended Actions"
          className="lg:col-span-2"
        >
          <ListItems items={analysis.recommendedActions} type="success" />
        </ResultCard>
      </div>
    </section>
  );
}

function VisualDocumentPreview({ fileUrl, fileType, extractedText, analysis }) {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.05);

  const highlightTerms = buildHighlightTerms(analysis);

  if (!fileUrl || fileType !== "application/pdf") {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6">
        <p className="text-sm leading-7 text-slate-300">
          Visual page preview with highlights is currently available for PDF
          files. DOCX and TXT files can still be analyzed, but they will use
          extracted text instead of a page-level visual preview.
        </p>

        {extractedText && (
          <div className="mt-5 max-h-[420px] overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
              {extractedText}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-sm leading-7 text-slate-300">
          The PDF below is rendered visually. Highlighted text shows values that
          were extracted and used in the document intelligence report.
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((value) => Math.max(0.75, value - 0.1))}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <span className="min-w-14 text-center text-sm text-slate-400">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={() => setScale((value) => Math.min(1.6, value + 0.1))}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-white/20"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <HighlightLegend
          label="Email"
          className="border-cyan-300/20 bg-cyan-300/15 text-cyan-100"
        />
        <HighlightLegend
          label="Phone"
          className="border-violet-300/20 bg-violet-300/15 text-violet-100"
        />
        <HighlightLegend
          label="Date"
          className="border-blue-300/20 bg-blue-300/15 text-blue-100"
        />
        <HighlightLegend
          label="Amount"
          className="border-emerald-300/20 bg-emerald-300/15 text-emerald-100"
        />
        <HighlightLegend
          label="Skill / Term"
          className="border-amber-300/20 bg-amber-300/15 text-amber-100"
        />
      </div>

      <div className="pdf-preview-container max-h-[760px] overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <p className="p-6 text-sm text-slate-400">Loading PDF preview...</p>
          }
          error={
            <p className="p-6 text-sm text-rose-300">
              Could not load PDF preview.
            </p>
          }
        >
          {Array.from(new Array(numPages || 0), (_, index) => (
            <div
              key={`page_${index + 1}`}
              className="mb-6 flex justify-center rounded-2xl bg-white/5 p-4"
            >
              <Page
                pageNumber={index + 1}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                customTextRenderer={({ str }) =>
                  highlightPdfText(str, highlightTerms)
                }
              />
            </div>
          ))}
        </Document>
      </div>

      {highlightTerms.length === 0 && (
        <p className="text-sm text-amber-200">
          No extracted values were available for visual highlighting. The PDF can
          still be viewed above.
        </p>
      )}
    </div>
  );
}

function highlightPdfText(text, highlightTerms) {
  if (!text || !highlightTerms.length) return text;

  let result = text;

  highlightTerms.forEach((term) => {
    const escapedTerm = escapeRegExp(term.value);

    if (!escapedTerm) return;

    const regex = new RegExp(`(${escapedTerm})`, "gi");

    result = result.replace(
      regex,
      `<mark class="pdf-highlight ${getPdfHighlightClass(term.type)}">$1</mark>`
    );
  });

  return result;
}

function buildHighlightTerms(analysis) {
  const keyDetails = analysis?.keyDetails || {};

  const terms = [
    ...(keyDetails.emails || []).map((value) => ({ value, type: "email" })),
    ...(keyDetails.phoneNumbers || []).map((value) => ({
      value,
      type: "phone",
    })),
    ...(keyDetails.dates || []).map((value) => ({ value, type: "date" })),
    ...(keyDetails.amounts || []).map((value) => ({ value, type: "amount" })),
    ...(keyDetails.names || []).map((value) => ({ value, type: "term" })),
    ...(keyDetails.organizations || []).map((value) => ({
      value,
      type: "term",
    })),
    ...(keyDetails.skills || []).map((value) => ({ value, type: "skill" })),
    ...(keyDetails.importantTerms || []).map((value) => ({
      value,
      type: "term",
    })),
  ];

  return terms
    .map((item) => ({
      ...item,
      value: String(item.value || "").trim(),
    }))
    .filter((item) => item.value.length > 1)
    .filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (other) => other.value.toLowerCase() === item.value.toLowerCase()
        )
    );
}

function getPdfHighlightClass(type) {
  const classes = {
    email: "pdf-highlight-email",
    phone: "pdf-highlight-phone",
    date: "pdf-highlight-date",
    amount: "pdf-highlight-amount",
    skill: "pdf-highlight-skill",
    term: "pdf-highlight-term",
  };

  return classes[type] || "pdf-highlight-term";
}

function HighlightLegend({ label, className }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasAnyDetails(keyDetails) {
  return Object.values(keyDetails).some(
    (value) => Array.isArray(value) && value.length > 0
  );
}

function ResultCard({ icon, title, children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-card rounded-[2rem] p-6 transition duration-300 hover:scale-[1.015] ${className}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
          {icon}
        </div>

        <h3 className="text-xl font-bold">{title}</h3>
      </div>

      {children}
    </motion.div>
  );
}

function DetailGroup({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-5">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span
            key={`${title}-${index}`}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-slate-100"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ListItems({ items, type }) {
  const safeItems = Array.isArray(items) ? items : [];

  const styles = {
    warning: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    risk: "border-rose-300/20 bg-rose-300/10 text-rose-100",
    success: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  };

  if (safeItems.length === 0) {
    return <p className="text-sm text-slate-400">No items found.</p>;
  }

  return (
    <div className="space-y-3">
      {safeItems.map((item, index) => (
        <div
          key={index}
          className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${styles[type]}`}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-6 py-10">
      <div className="glass-card-soft rounded-[2rem] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-bold text-white">DocuFlow AI</h3>
            <p className="mt-1 text-sm text-slate-400">
              AI-powered document classification, summarization, extraction,
              visual highlighting, and missing-detail detection.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Lock className="h-4 w-4" />
            Designed for secure document intelligence workflows
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;