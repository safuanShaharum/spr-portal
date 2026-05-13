"use client";
import { useEffect, useState } from "react";
import DocumentGrid from "./DocumentGrid";

interface Item {
  title: string;
  year?: string;
  url: string | null;
}

interface Props {
  endpoint: string;
}

export default function RemoteDocumentGrid({ endpoint }: Props) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(endpoint)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((data: Item[]) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message));
  }, [endpoint]);

  if (error) {
    return (
      <div className="py-16 text-center text-spr-text-muted text-sm">
        Gagal memuatkan: {error}
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-2 border-spr-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-spr-text-muted text-sm">Memuatkan...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-spr-text-muted text-sm">
        Tiada dokumen tersedia buat masa ini.
      </div>
    );
  }

  return (
    <DocumentGrid
      documents={items.map((it) => ({
        title: it.title,
        year: it.year,
        url: it.url || undefined,
      }))}
    />
  );
}
