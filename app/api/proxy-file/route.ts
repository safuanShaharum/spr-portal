import { NextRequest, NextResponse } from "next/server";
import { WP_API as API_URL } from "@/lib/wp-api";

/**
 * Proxy a WordPress-hosted file to avoid CORS issues.
 * Usage: /api/proxy-file?dataset_id=11
 */
export async function GET(req: NextRequest) {
  const datasetId = req.nextUrl.searchParams.get("dataset_id");
  if (!datasetId) {
    return NextResponse.json({ error: "dataset_id required" }, { status: 400 });
  }

  try {
    // Get dataset info
    const dsRes = await fetch(`${API_URL}/spr/v1/datasets/${datasetId}`);
    if (!dsRes.ok) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }
    const ds = await dsRes.json();
    const fileUrl: string = ds.file_url || "";
    if (!fileUrl) {
      return NextResponse.json({ error: "No file URL" }, { status: 404 });
    }

    // Fetch the actual file
    const fileRes = await fetch(fileUrl);
    if (!fileRes.ok) {
      return NextResponse.json({ error: "File fetch failed" }, { status: 502 });
    }

    const buffer = await fileRes.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": fileRes.headers.get("Content-Type") || "application/octet-stream",
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
  }
}
