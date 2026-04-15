import { NextRequest, NextResponse } from 'next/server';

/**
 * Google Drive proxy for:
 * - subtitle text files (mode=text)
 * - mp3 streaming (mode=audio)
 *
 * Usage:
 *   /api/gdrive-proxy?mode=text&url=<google-drive-share-url>
 *   /api/gdrive-proxy?mode=audio&url=<google-drive-share-url>
 */

const ALLOWED_DRIVE_HOSTS = new Set([
  'drive.google.com',
  'docs.google.com',
  'drive.usercontent.google.com',
]);

function safeParseUrl(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

function extractFileId(rawInput: string): string {
  const input = rawInput.trim();
  if (/^[a-zA-Z0-9_-]{20,}$/.test(input)) return input;

  const parsed = safeParseUrl(input);
  if (parsed) {
    const idParam = parsed.searchParams.get('id');
    if (idParam) return idParam;

    const pathMatch = parsed.pathname.match(/\/d\/([^/]+)/);
    if (pathMatch) return pathMatch[1];
  }

  const fallbackPath = input.match(/\/d\/([^/]+)/);
  if (fallbackPath) return fallbackPath[1];

  const fallbackId = input.match(/[?&]id=([^&]+)/);
  if (fallbackId) return fallbackId[1];

  return '';
}

function readSetCookieHeader(headers: Headers): string {
  const headersWithExtras = headers as Headers & { getSetCookie?: () => string[] };
  if (typeof headersWithExtras.getSetCookie === 'function') {
    const cookies = headersWithExtras
      .getSetCookie()
      .map((c) => c.split(';')[0]?.trim())
      .filter(Boolean);
    if (cookies.length > 0) return cookies.join('; ');
  }

  const raw = headers.get('set-cookie');
  if (!raw) return '';

  // Fallback parser for combined Set-Cookie headers.
  const pieces = raw.split(/,(?=[^;,\s]+=)/g);
  const cookies = pieces
    .map((p) => p.split(';')[0]?.trim())
    .filter(Boolean);
  return cookies.join('; ');
}

function decodeEscapedGoogleUrl(value: string): string {
  return value
    .replace(/\\u003d/g, '=')
    .replace(/\\u0026/g, '&')
    .replace(/\\u0025/g, '%')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&');
}

function extractConfirmDownloadUrl(html: string, fileId: string): string | null {
  const downloadUrlMatch = html.match(/"downloadUrl":"([^"]+)"/);
  if (downloadUrlMatch) {
    const decoded = decodeEscapedGoogleUrl(downloadUrlMatch[1]);
    if (decoded.startsWith('http://') || decoded.startsWith('https://')) return decoded;
    if (decoded.startsWith('/')) return `https://drive.google.com${decoded}`;
  }

  const confirmInputMatch = html.match(/name="confirm"\s+value="([^"]+)"/i);
  if (confirmInputMatch?.[1]) {
    return `https://drive.google.com/uc?export=download&confirm=${encodeURIComponent(confirmInputMatch[1])}&id=${encodeURIComponent(fileId)}`;
  }

  const confirmHrefMatch = html.match(/confirm=([0-9A-Za-z_]+)(?:&amp;|&)id=/);
  if (confirmHrefMatch?.[1]) {
    return `https://drive.google.com/uc?export=download&confirm=${encodeURIComponent(confirmHrefMatch[1])}&id=${encodeURIComponent(fileId)}`;
  }

  return null;
}

async function fetchDriveFile(fileId: string, rangeHeader: string | null): Promise<Response> {
  const baseUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
  const baseHeaders = new Headers({
    Accept: '*/*',
    'User-Agent': 'Mozilla/5.0',
  });
  if (rangeHeader) baseHeaders.set('Range', rangeHeader);

  let response = await fetch(baseUrl, {
    headers: baseHeaders,
    redirect: 'follow',
  });

  const contentType = response.headers.get('content-type') || '';
  if (response.ok && !contentType.includes('text/html')) {
    return response;
  }

  const html = await response.text();
  const confirmUrl = extractConfirmDownloadUrl(html, fileId);
  if (!confirmUrl) {
    throw new Error(
      'Could not resolve Google Drive download link. Ensure file is shared as "Anyone with the link".',
    );
  }

  const confirmHeaders = new Headers(baseHeaders);
  const cookieHeader = readSetCookieHeader(response.headers);
  if (cookieHeader) confirmHeaders.set('Cookie', cookieHeader);

  response = await fetch(confirmUrl, {
    headers: confirmHeaders,
    redirect: 'follow',
  });

  return response;
}

function copyHeaderIfPresent(from: Headers, to: Headers, name: string) {
  const value = from.get(name);
  if (value) to.set(name, value);
}

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get('url')?.trim();
  const mode = request.nextUrl.searchParams.get('mode') === 'audio' ? 'audio' : 'text';

  if (!rawUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const parsedUrl = safeParseUrl(rawUrl);
  if (parsedUrl && !ALLOWED_DRIVE_HOSTS.has(parsedUrl.hostname)) {
    return NextResponse.json(
      { error: 'Only Google Drive URLs are supported by this proxy' },
      { status: 400 },
    );
  }

  const fileId = extractFileId(rawUrl);
  if (!fileId) {
    return NextResponse.json({ error: 'Could not extract file ID from URL' }, { status: 400 });
  }

  try {
    const rangeHeader = mode === 'audio' ? request.headers.get('range') : null;
    const driveResponse = await fetchDriveFile(fileId, rangeHeader);
    if (!driveResponse.ok) {
      return NextResponse.json(
        { error: `Google Drive returned ${driveResponse.status}` },
        { status: driveResponse.status },
      );
    }

    if (mode === 'audio') {
      const headers = new Headers();
      copyHeaderIfPresent(driveResponse.headers, headers, 'content-type');
      copyHeaderIfPresent(driveResponse.headers, headers, 'content-length');
      copyHeaderIfPresent(driveResponse.headers, headers, 'content-range');
      copyHeaderIfPresent(driveResponse.headers, headers, 'accept-ranges');
      copyHeaderIfPresent(driveResponse.headers, headers, 'cache-control');
      copyHeaderIfPresent(driveResponse.headers, headers, 'etag');
      copyHeaderIfPresent(driveResponse.headers, headers, 'last-modified');
      copyHeaderIfPresent(driveResponse.headers, headers, 'content-disposition');
      if (!headers.get('content-type')) headers.set('content-type', 'audio/mpeg');
      if (!headers.get('accept-ranges')) headers.set('accept-ranges', 'bytes');

      return new NextResponse(driveResponse.body, {
        status: driveResponse.status,
        headers,
      });
    }

    const text = await driveResponse.text();
    if (/^\s*<!doctype html/i.test(text) || /^\s*<html/i.test(text)) {
      return NextResponse.json(
        { error: 'Google Drive returned HTML instead of subtitle text. Check sharing permission.' },
        { status: 502 },
      );
    }

    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
