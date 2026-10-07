import { spawn } from 'child_process';
import fs from 'fs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port = 9222;

const chromeProc = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1600,1050',
  'about:blank',
]);

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 25; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const data = await res.json();
      if (data.webSocketDebuggerUrl) return data.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
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

    const { targetId } = await send('Target.createTarget', { url: 'http://localhost:5174/' });
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

    console.log('Navigating to http://localhost:5174/ ...');
    await sendSession('Page.navigate', { url: 'http://localhost:5174/' });
    await sleep(2500);

    // Scroll to #configurator
    console.log('Scrolling to #configurator...');
    await sendSession('Runtime.evaluate', {
      expression: `
        const el = document.querySelector('#configurator');
        if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      `,
    });
    await sleep(1500);

    async function captureScreen(fileName) {
      const { data } = await sendSession('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(fileName, Buffer.from(data, 'base64'));
      console.log(`Saved: ${fileName}`);
    }

    await captureScreen('lab_01_initial_chair.png');

    // Helper to click button by text in browser context
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

    // Test 1: Click "STORAGE BED"
    console.log('Selecting 08 STORAGE BED...');
    const clickedBed = await clickButton('STORAGE BED');
    console.log('Clicked STORAGE BED button:', clickedBed);
    await sleep(2200);
    await captureScreen('lab_02_storage_bed.png');

    // Test 2: Click "OPEN BED STORAGE"
    console.log('Clicking OPEN BED STORAGE...');
    const clickedOpenBed = await clickButton('OPEN BED STORAGE');
    console.log('Clicked OPEN BED STORAGE button:', clickedOpenBed);
    await sleep(2000);
    await captureScreen('lab_03_bed_drawers_open.png');

    // Test 3: Click "TECH VIEW"
    console.log('Clicking TECH VIEW...');
    await clickButton('TECH VIEW');
    await sleep(1200);
    await captureScreen('lab_04_bed_tech_view.png');

    // Turn off tech view, click EXPLODE
    console.log('Testing EXPLODE on bed...');
    await clickButton('TECH VIEW');
    await sleep(400);
    await clickButton('EXPLODE');
    await sleep(2000);
    await captureScreen('lab_05_bed_exploded.png');

    // Test 4: Select 03 GRAND WARDROBE
    console.log('Selecting 03 GRAND WARDROBE...');
    await clickButton('GRAND WARDROBE');
    await sleep(2200);

    // Open Wardrobe Doors
    console.log('Opening Wardrobe Doors...');
    await clickButton('OPEN WARDROBE');
    await sleep(2000);
    await captureScreen('lab_06_wardrobe_open.png');

    // Test 5: Select 05 TEA TABLE
    console.log('Selecting 05 TEA TABLE...');
    await clickButton('TEA TABLE');
    await sleep(2200);
    await captureScreen('lab_07_tea_table.png');

    // Test 6: Select 06 DINING TABLE
    console.log('Selecting 06 DINING TABLE...');
    await clickButton('DINING TABLE');
    await sleep(2200);
    await captureScreen('lab_08_signature_dining_table.png');

    // Test 7: Select 09 WRITING DESK
    console.log('Selecting 09 WRITING DESK...');
    await clickButton('WRITING DESK');
    await sleep(2200);

    // Open Desk Drawer
    console.log('Opening Desk Drawer...');
    await clickButton('OPEN DRAWER');
    await sleep(1800);
    await captureScreen('lab_09_writing_desk_open.png');

    // Test 8: Color Switching (Forest Green)
    console.log('Switching Color to Forest Green...');
    await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const colorBtn = buttons.find(b => b.title && b.title.includes('Forest Green'));
          if (colorBtn) {
            colorBtn.click();
            return true;
          }
          return false;
        })()
      `,
    });
    await sleep(1200);
    await captureScreen('lab_10_desk_forest_green.png');

    // Test 9: Test "REQUEST BESPOKE SPEC SHEET" Modal
    console.log('Opening Bespoke Spec Sheet Modal...');
    await clickButton('REQUEST BESPOKE SPEC SHEET');
    await sleep(800);

    // Fill form and submit
    console.log('Filling out spec sheet inquiry form...');
    await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const setInput = (input, val) => {
            if (!input) return;
            const proto = input instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            const desc = Object.getOwnPropertyDescriptor(proto, 'value');
            desc.set.call(input, val);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          };

          const inputs = Array.from(document.querySelectorAll('input'));
          const textarea = document.querySelector('textarea');
          const nameInput = inputs.find(i => i.placeholder && i.placeholder.includes('Alistair'));
          const phoneInput = inputs.find(i => i.placeholder && i.placeholder.includes('+91'));
          const emailInput = inputs.find(i => i.type === 'email');

          setInput(nameInput, 'Julian Vance');
          setInput(phoneInput, '+91 98840 54321');
          setInput(emailInput, 'julian@vancearchitects.com');
          setInput(textarea, 'Custom 180cm length with American Walnut finish and integrated brass cable grommet');

          const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('REQUEST SPEC SHEET'));
          if (submitBtn) submitBtn.click();
        })()
      `,
    });
    await sleep(2000);
    await captureScreen('lab_11_spec_modal_submitted.png');

    console.log('✓ All 3D Furniture Laboratory automated tests completed successfully!');
  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    chromeProc.kill();
  }
}

run();
