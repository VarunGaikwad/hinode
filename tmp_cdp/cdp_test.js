const http = require('http');
const WebSocket = require('ws');

const CHROME_URL = 'http://localhost:9223';
const TARGET_URL = 'http://localhost:5173/newtab.html';

function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get(CHROME_URL + path, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const list = await getJson('/json/list');
  const page = list.find((item) => item.type === 'page');
  if (!page) throw new Error('No page target found');

  const ws = new WebSocket(page.webSocketDebuggerUrl);

  let id = 0;
  function send(method, params) {
    const msg = { id: ++id, method, params };
    ws.send(JSON.stringify(msg));
    return id;
  }

  const pending = new Map();
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
    if (msg.method === 'Runtime.consoleAPICalled') {
      const args = (msg.params.args || []).map((a) => a.value || a.description || JSON.stringify(a)).join(' ');
      console.log(`[console.${msg.params.type}]`, args);
    }
    if (msg.method === 'Log.entryAdded') {
      console.log('[Log.entryAdded]', msg.params.entry.text);
    }
  });

  await new Promise((resolve) => ws.once('open', resolve));

  function call(method, params) {
    return new Promise((resolve, reject) => {
      const mid = send(method, params);
      pending.set(mid, { resolve, reject });
    });
  }

  await call('Runtime.enable');
  await call('Log.enable');
  await call('Network.enable');
  await call('Page.enable');

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    if (msg.method === 'Network.responseReceived') {
      const resp = msg.params.response;
      if (resp.url.includes('localhost:7000') || resp.status >= 400) {
        console.log(`[Network] ${resp.status} ${resp.url}`);
      }
    }
    if (msg.method === 'Network.loadingFailed') {
      console.log('[Network.loadingFailed]', msg.params.requestId, msg.params.errorText, msg.params.canceled);
    }
  });

  await call('Page.navigate', { url: TARGET_URL });

  // Wait for the page to load and fetch data.
  await sleep(8000);

  const result = await call('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.querySelector('.bg-layer.visible');
        const resources = performance.getEntriesByType('resource').map((r) => ({
          name: r.name,
          status: r.responseStatus,
          duration: Math.round(r.duration),
        }));
        return {
          backgroundImage: el ? getComputedStyle(el).backgroundImage : null,
          bgUrl: el ? el.style.backgroundImage : null,
          homeBackground: window.__HINODE_HOME__ ? window.__HINODE_HOME__.background : null,
          title: document.title,
          loading: !!document.querySelector('[class*="loader"]'),
          resources: resources.filter((r) => r.name.includes('localhost:7000') || (r.status && r.status >= 400)),
        };
      })()
    `,
    returnByValue: true,
  });
  console.log('Evaluation result:', JSON.stringify(result.result.value, null, 2));

  ws.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
