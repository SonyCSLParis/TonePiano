/* eslint-disable no-console */
const puppeteer = require("puppeteer");
const path = require("path");
const { expect } = require("chai");
const StaticServer = require("static-server");
const {
  collapseTextChangeRangesAcrossMultipleVersions,
} = require("typescript");

const PORT = 3000;
var server = new StaticServer({
  rootPath: path.resolve(__dirname, "../"),
  port: PORT,
  cors: "*",
});

const debug = process.argv.includes("--dbg");
const slowMo = false;
console.log("args: ", process.argv.slice(2));

describe("Piano", async () => {
  before(() => {
    return new Promise((done) => {
      console.log("starting");
      server.start(done);
    });
  });

  after(() => {
    server.stop();
  });

  let launchOptions = {
    headless: !debug,
    args: [
      "--no-user-gesture-required",
      "--disable-web-security",
      "--allow-file-access-from-files",
    ],
  };
  if (debug) {
    launchOptions = {
      ...launchOptions,
      devtools: true,
      pipe: true,
    };
  }
  if (slowMo) {
    launchOptions.slowMo = 750;
  }
  console.log("Launching puppeteer with options: %o", launchOptions);
  async function loadPage(url) {
    const serverPrefix = `http://localhost:${PORT}/test`;
    const browser = await puppeteer.launch(launchOptions);
    const page = (await browser.pages())[0];
    page.on("pageerror", (e) => {
      throw new Error(e);
    });
    await page.goto(`${serverPrefix}/${url}`, { waitFor: "networkidle2" });
    return { page, browser };
  }

  it("can be created", async () => {
    const { browser, page } = await loadPage("basic.html");
    const exists = await page.evaluate(() => {
      const piano = new TonePiano.Piano();
      return Boolean(piano);
    });
    expect(exists).to.be.true;
    await browser.close();
  });

  it("can load only string sounds", async () => {
    const { browser, page } = await loadPage("basic.html");
    await page.evaluate(() => {
      window.piano = new TonePiano.Piano({
        release: false,
        pedal: false,
        samples: "../audio/",
      });
      return window.piano.load();
    });
    await page.waitForTimeout(100);
    const isLoaded = await page.evaluate(() => window.piano.loaded);
    expect(isLoaded).to.be.true;
    await browser.close();
  });

  it("can set the volumes", async () => {
    const { browser, page } = await loadPage("basic.html");
    const volumes = await page.evaluate(() => {
      const piano = new TonePiano.Piano({
        volume: {
          harmonics: 10,
          strings: 9,
          keybed: 8,
          pedal: 7,
        },
      });
      return {
        harmonics: piano.harmonics.value,
        strings: piano.strings.value,
        keybed: piano.keybed.value,
        pedal: piano.pedal.value,
      };
    });
    expect(volumes.harmonics).to.be.closeTo(10, 0.1);
    expect(volumes.strings).to.be.closeTo(9, 0.1);
    expect(volumes.keybed).to.be.closeTo(8, 0.1);
    expect(volumes.pedal).to.be.closeTo(7, 0.1);
    await browser.close();
  });

  it("can schedule some notes", async () => {
    const { browser, page } = await loadPage("basic.html");
    await page.evaluate(async () => {
      const piano = new TonePiano.Piano({
        release: true,
        pedal: true,
        samples: "../audio/",
      });
      await piano.load();
      piano.keyDown({ note: "C4" });
      piano.pedalDown({ time: "+0.002" });
      piano.keyUp({ note: "C4", time: "+0.005" });
      piano.keyDown({ note: "D4", time: "+0.004" });
      piano.pedalUp({ time: "+0.003" });
    });
    await browser.close();
  });

  it("can play notes with velocities", async () => {
    const { browser, page } = await loadPage("basic.html");
    let piano;
    await page.evaluate(async () => {
      piano = new TonePiano.Piano({
        release: false,
        pedal: false,
        velocities: 3,
        samples: "../audio/",
      });
      await piano.load();
      piano.keyDown({ note: "C4", time: "+0.1", velocity: 0.9 });
      piano.pedalDown({ time: "+0.2" });
      piano.keyUp({ note: "C4", time: "+0.5", velocity: 0.3 });
      piano.keyDown({ note: "D4", time: "+0.4", velocity: 0.8 });
      piano.pedalUp({ time: "+3" });
      debugger;
    });

    await browser.close();
  });

  it("can stop all the scheduled notes", async () => {
    const { browser, page } = await loadPage("basic.html");
    await page.evaluate(async () => {
      const piano = new TonePiano.Piano({
        release: false,
        pedal: false,
        samples: "../audio/",
      });
      await piano.load();
      piano.keyDown({ note: "C4" });
      piano.keyDown({ note: "E4" });
      piano.keyDown({ note: "G4" });
      piano.pedalDown();
      await new Promise((done) => setTimeout(done, 100));
      piano.stopAll();
    });
    await browser.close();
  });

  it("can be used with Tone.js", async () => {
    const { browser, page } = await loadPage("basic.html");
    await page.evaluate(async () => {
      function delay(time) {
        return new Promise(function (resolve) {
          setTimeout(resolve, time);
        });
      }
      const filter = new Tone.Filter().toDestination();
      const piano = new TonePiano.Piano({
        release: false,
        pedal: false,
        samples: "../audio/",
      }).connect(filter);
    });
    await browser.close();
  });
});
