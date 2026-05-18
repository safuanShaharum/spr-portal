import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

// Triggered by WordPress when Excel master file is updated.
// WP plugin posts here → script runs in background → frontend rebuilt.
//
// Auth: shared secret in `REBUILD_TOKEN` env var. Sent as either:
//   - Authorization: Bearer <token>
//   - X-Rebuild-Token: <token>
//
// Force Node runtime so we can spawn child processes.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const expected = process.env.REBUILD_TOKEN;
  if (!expected) {
    return NextResponse.json({ ok: false, error: 'REBUILD_TOKEN not configured' }, { status: 500 });
  }

  const authHeader = req.headers.get('authorization') || '';
  const headerToken = req.headers.get('x-rebuild-token') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const got = bearer || headerToken;

  if (got !== expected) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const appDir = process.env.APP_DIR || join(process.cwd());
  const script = join(appDir, 'deploy.sh');

  // Fire and forget — return immediately, deploy continues in background.
  // Logs ke deploy.log (sebab pm2 reload akan kill kalau tunggu inline).
  const child = spawn('bash', [script], {
    detached: true,
    stdio: 'ignore',
    cwd: appDir,
    env: { ...process.env, APP_DIR: appDir },
  });
  child.unref();

  return NextResponse.json({
    ok: true,
    message: 'Rebuild triggered',
    pid: child.pid,
    timestamp: new Date().toISOString(),
  });
}

// GET for healthcheck — confirms endpoint exists & token is configured.
// Does NOT trigger deploy.
export async function GET() {
  return NextResponse.json({
    ok: true,
    configured: Boolean(process.env.REBUILD_TOKEN),
    hint: 'POST with Authorization: Bearer <REBUILD_TOKEN> to trigger',
  });
}
