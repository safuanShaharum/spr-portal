"use client";
import { trackDownload } from "@/lib/analytics/trackDownload";

interface Doc {
  title: string;
  year?: string;
  status?: string;
  url?: string;
}

interface Props {
  documents: Doc[];
}

const DownloadIcon = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function DocumentGrid({ documents }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc, i) => (
        <div key={i} className="bg-white border border-spr-border rounded-xl p-5 hover:shadow-md hover:border-spr-primary/20 transition-all">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-3">
            <svg width="20" height="20" fill="none" stroke="#EF4444" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13 2v7h7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h4 className="text-sm font-semibold text-spr-navy mb-1 leading-snug">{doc.title}</h4>
          {doc.year && <p className="text-xs text-spr-text-muted mb-3">{doc.year}</p>}
          {doc.status ? (
            <span className="text-xs text-spr-text-muted italic">{doc.status}</span>
          ) : doc.url ? (
            <a
              href={doc.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDownload(doc.title)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-spr-primary hover:underline"
            >
              <DownloadIcon />
              Muat Turun PDF
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-spr-text-muted italic">
              <DownloadIcon />
              Fail belum tersedia
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
