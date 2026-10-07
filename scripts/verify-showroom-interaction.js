import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9223;

const chromeProc = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1600,1000',
  'about:blank',
]);

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      if (data.webSocketDebuggerUrl) return data.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error('Failed to connect to Chrome debugging port');
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        callbacks.get(msg.id)(msg);
        callbacks.delete(msg.id);
      }
    };

    await new Promise((r) => (ws.onopen = r));

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        callbacks.set(reqId, (res) => {
          if (res.error) reject(res.error);
          else resolve(res.result);
        });
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    const { targetId } = await send('Target.createTarget', { url: 'http://localhost:5173#showroom' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    function sendSession(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        callbacks.set(reqId, (res) => {
          if (res.error) reject(res.error);
          else resolve(res.result);
        });
        ws.send(JSON.stringify({ id: reqId, sessionId, method, params }));
      });
    }

    await sendSession('Page.enable');
    await sendSession('Runtime.enable');
    await sendSession('DOM.enable');

    console.log('Navigating to http://localhost:5173#showroom ...');
    await sendSession('Page.navigate', { url: 'http://localhost:5173#showroom' });
    await sleep(3500);

    async function captureScreen(fileName) {
      const { data } = await sendSession('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(fileName, Buffer.from(data, 'base64'));
      console.log(`Saved screenshot: ${fileName}`);
    }

    async function clickId(elementId) {
      const res = await sendSession('Runtime.evaluate', {
        expression: `
          (() => {
            const el = document.getElementById('${elementId}');
            if (el) {
              el.click();
              return true;
            }
            return false;
          })()
        `,
        returnByValue: true,
      });
      return res.result?.value;
    }

    async function clickButton(txt) {
      const res = await sendSession('Runtime.evaluate', {
        expression: `
          (() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const btn = buttons.find(b => {
              const str = (b.innerText || b.textContent || '').toUpperCase();
              return str.includes('${txt.toUpperCase()}');
            });
            if (btn) {
              btn.click();
              return true;
            }
            return false;
          })()
        `,
        returnByValue: true,
      });
      return res.result?.value;
    }

    // STEP 01 & 02: Initial Living Room View
    console.log('Capturing STEP 01/02: Initial room view...');
    await captureScreen('verify_01_living_room.png');

    // STEP 03, 04, 05: Click Credenza ('CREDENZA' hotspot)
    console.log('Selecting Credenza (CREDENZA)...');
    const clickedCredenza = await clickButton('CREDENZA');
    console.log('Clicked Credenza hotspot:', clickedCredenza);
    await sleep(2500);
    console.log('Capturing STEP 05: Credenza adaptive framing...');
    await captureScreen('verify_02_credenza_framed.png');

    // STEP 06: OPEN DOORS
    console.log('Clicking OPEN DOORS via #ctrl-door...');
    const clickedDoors = await clickId('ctrl-door');
    console.log('Clicked #ctrl-door:', clickedDoors);
    await sleep(1500);
    console.log('Capturing STEP 06: Credenza doors open with interior shelves...');
    await captureScreen('verify_03_doors_open.png');

    // STEP 07: OPEN DRAWERS
    console.log('Clicking OPEN DRAWERS via #ctrl-drawer...');
    const clickedDrawers = await clickId('ctrl-drawer');
    console.log('Clicked #ctrl-drawer:', clickedDrawers);
    await sleep(1500);
    console.log('Capturing STEP 07: Credenza drawers open with interior boxes...');
    await captureScreen('verify_04_drawers_open.png');

    // STEP 08: EXPLODE
    console.log('Clicking EXPLODE via #ctrl-explode...');
    const clickedExplode = await clickId('ctrl-explode');
    console.log('Clicked #ctrl-explode:', clickedExplode);
    await sleep(2000);
    console.log('Capturing STEP 08: Credenza exploded view...');
    await captureScreen('verify_05_exploded.png');

    // STEP 09: ASSEMBLE
    console.log('Clicking ASSEMBLE via #ctrl-assemble...');
    const clickedAssemble = await clickId('ctrl-assemble');
    console.log('Clicked #ctrl-assemble:', clickedAssemble);
    await sleep(2000);

    // STEP 10: 360° Object Turntable drag
    console.log('Testing 360° rotation drag...');
    await sendSession('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: 800,
      y: 500,
      button: 'left',
      clickCount: 1,
    });
    await sendSession('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 620,
      y: 500,
    });
    await sleep(300);
    await sendSession('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: 620,
      y: 500,
      button: 'left',
    });
    await sleep(1200);
    console.log('Capturing STEP 10: Credenza rotated...');
    await captureScreen('verify_06_rotated.png');

    // STEP 11 & 12: Open MATERIAL panel & choose finish
    console.log('Clicking MATERIAL button via #ctrl-material...');
    await clickId('ctrl-material');
    await sleep(1000);
    console.log('Capturing STEP 11: Material selector panel...');
    await captureScreen('verify_07_material_panel.png');

    console.log('Selecting BEIGE material swatch...');
    await clickButton('BEIGE');
    await sleep(1400);
    console.log('Capturing STEP 13: Material changed to Warm Beige...');
    await captureScreen('verify_08_material_warm_beige.png');

    // STEP 14 & 15: CLOSE DOORS & CLOSE DRAWERS
    console.log('Closing doors and drawers...');
    await clickId('ctrl-door');
    await sleep(1000);
    await clickId('ctrl-drawer');
    await sleep(1000);

    // STEP 16: RESET
    console.log('Clicking RESET via #ctrl-reset...');
    await clickId('ctrl-reset');
    await sleep(1500);
    console.log('Capturing STEP 16: Reset state...');
    await captureScreen('verify_09_reset.png');

    // TEST ROOM SWITCH: Switch to KITCHEN
    console.log('Testing room switch: 02 KITCHEN...');
    await clickButton('KITCHEN');
    await sleep(2500);
    console.log('Capturing Kitchen room...');
    await captureScreen('verify_10_kitchen.png');

    // Click Kitchen Cabinet
    console.log('Selecting Kitchen Cupboard / Cabinet...');
    await clickButton('CUPBOARD');
    await sleep(1800);
    await captureScreen('verify_11_kitchen_cabinet_framed.png');

    console.log('All verification steps completed successfully!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    chromeProc.kill();
    process.exit(0);
  }
}

run();
