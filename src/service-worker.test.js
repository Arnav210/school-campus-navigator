import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const scope = 'https://example.com/school-campus-navigator/';
const source = readFileSync(new URL('../dist/sw.js', import.meta.url), 'utf8');

function worker() {
  const handlers = {};
  const state = { deleted: [], installed: [], claimed: false, skipped: false };
  const cached = new Map();
  const cache = {
    addAll: async (requests) => { state.installed = requests; },
    match: async (request) => cached.get(request.url || request),
  };
  const context = {
    URL, Request,
    self: {
      registration: { scope },
      addEventListener: (type, handler) => { handlers[type] = handler; },
      skipWaiting: async () => { state.skipped = true; },
      clients: { claim: async () => { state.claimed = true; } },
    },
    caches: {
      open: async (name) => { state.cacheName = name; return cache; },
      keys: async () => ['dnhs-navigator-v1', state.cacheName, 'another-app'],
      delete: async (name) => { state.deleted.push(name); },
    },
    fetch: async () => { throw new Error('offline'); },
  };
  runInNewContext(source, context);
  return {
    state, cached, context, cache,
    lifecycle(type) {
      let task;
      handlers[type]({ waitUntil: (promise) => { task = promise; } });
      return task;
    },
    request(path, mode = 'navigate', method = 'GET') {
      let response;
      handlers.fetch({
        request: { url: new URL(path, scope).href, mode, method },
        respondWith: (promise) => { response = promise; },
      });
      return response;
    },
  };
}

test('production worker precaches HTML and every matching bundle that exists on disk', async () => {
  const w = worker();
  await w.lifecycle('install');
  const urls = w.state.installed.map((request) => request.url);
  const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  const assets = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css))"/g)];
  assert.ok(assets.length >= 2);
  for (const [, path] of assets) assert.ok(urls.includes(new URL(path, scope).href));
  assert.ok(urls.includes(scope + 'index.html'));
  for (const request of w.state.installed) {
    assert.equal(request.cache, 'reload');
    const file = request.url.slice(scope.length);
    assert.ok(existsSync(new URL(`../dist/${file}`, import.meta.url)), file);
  }
  assert.equal(w.state.skipped, true);
});

test('failed precache leaves the previous worker active', async () => {
  const w = worker();
  w.cache.addAll = async () => { throw new Error('missing asset'); };
  await assert.rejects(w.lifecycle('install'), /missing asset/);
  assert.equal(w.state.skipped, false);
});

test('activation removes legacy app caches and preserves other apps', async () => {
  const w = worker();
  await w.lifecycle('install');
  await w.lifecycle('activate');
  assert.deepEqual(w.state.deleted, ['dnhs-navigator-v1']);
  assert.equal(w.state.claimed, true);
});

test('online navigation requests fresh HTML rather than the obsolete cached shell', async () => {
  const w = worker();
  w.cached.set(scope + 'index.html', 'offline HTML');
  w.context.fetch = async (_request, options) => {
    assert.equal(options.cache, 'no-store');
    return { ok: true, body: 'current HTML' };
  };
  assert.equal((await w.request('')).body, 'current HTML');
  assert.equal(w.cached.get(scope + 'index.html'), 'offline HTML');
});

test('offline and Pages 404 deep links use the matching precached HTML', async () => {
  const w = worker();
  w.cached.set(scope + 'index.html', 'offline HTML');
  assert.equal(await w.request('map'), 'offline HTML');
  w.context.fetch = async () => ({ ok: false, status: 404 });
  assert.equal(await w.request('map'), 'offline HTML');
});

test('offline bundles use the current cache; unrelated requests are left alone', async () => {
  const w = worker();
  w.cached.set(scope + 'assets/example.js', 'cached JS');
  assert.equal(await w.request('assets/example.js', 'cors'), 'cached JS');
  assert.equal(w.request('https://tiles.example.com/tile.png', 'cors'), undefined);
  assert.equal(w.request('upload', 'cors', 'POST'), undefined);
});
