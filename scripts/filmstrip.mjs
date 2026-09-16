#!/usr/bin/env node
/**
 * Whole-page filmstrip.
 *
 *   node scripts/filmstrip.mjs [width]
 *
 * Screenshots the page at evenly spaced scroll positions and tiles them into one
 * image. The geometry harness proves a section matches its artboard; this is for
 * the question it cannot answer - whether the page reads as one piece once every
 * section is on it. Reduced motion is on so the frames are reproducible.
 *
 * Output: review/_ref/strip-<width>.png
 */
import { chromium } from "playwright";
import { siteServer } from "./lib/site-server.mjs";
import sharp from "sharp";
const site = await siteServer();
const b = await chromium.launch();
const width = Number(process.argv[2] ?? 1280);
const ctx = await b.newContext({ viewport:{width,height:900}, reducedMotion:"reduce" });
const p = await ctx.newPage();
await p.goto(`${site.origin}/`, { waitUntil:"load", timeout:120000 });
await p.evaluate(()=>document.fonts.ready);
await p.evaluate(async()=>{const s=innerHeight*0.8;for(let y=0;y<document.body.scrollHeight;y+=s){scrollTo(0,y);await new Promise(r=>setTimeout(r,80));}scrollTo(0,0);});
await p.waitForTimeout(800);
const h = await p.evaluate(()=>document.body.scrollHeight);
console.log("page height", h);
const frames = 8;
const shots = [];
for (let i=0;i<frames;i++){
  const y = Math.round((h - 900) * i / (frames-1));
  await p.evaluate(v=>scrollTo(0,v), y);
  await p.waitForTimeout(500);
  shots.push(await p.screenshot());
}
const tw = Math.round(width/2), th = 450;
const tiles = await Promise.all(shots.map(s=>sharp(s).resize(tw,th).png().toBuffer()));
await sharp({create:{width:tw*4,height:th*2,channels:4,background:"#DED8C6"}})
  .composite(tiles.map((input,i)=>({input, left:(i%4)*tw, top:Math.floor(i/4)*th})))
  .png().toFile(`review/_ref/strip-${width}.png`);
console.log("wrote review/_ref/strip-"+width+".png");
await b.close();
site.stop();
