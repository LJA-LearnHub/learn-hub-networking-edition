/**
 * Writes build/icon.ico (NSIS / electron-builder), build/icon.png (BrowserWindow),
 * and build/icon.icns (macOS / electron-builder) from build/icon.svg.
 * Run from package root: node scripts/generate-build-icons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { BICUBIC, createICNS } from "png2icons";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = path.join(root, "build", "icon.svg");
const tmpPng256 = path.join(root, "build", "_tmp256.png");
const tmpPng1024 = path.join(root, "build", "_tmp1024.png");
const icoPath = path.join(root, "build", "icon.ico");
const pngPath = path.join(root, "build", "icon.png");
const icnsPath = path.join(root, "build", "icon.icns");

await sharp(svgPath).resize(256, 256).png().toFile(tmpPng256);
const png256 = fs.readFileSync(tmpPng256);
fs.writeFileSync(icoPath, await pngToIco(png256));
fs.writeFileSync(pngPath, png256);
fs.unlinkSync(tmpPng256);

await sharp(svgPath).resize(1024, 1024).png().toFile(tmpPng1024);
const png1024 = fs.readFileSync(tmpPng1024);
const icns = createICNS(png1024, BICUBIC, 0);
if (!icns) throw new Error("createICNS failed");
fs.writeFileSync(icnsPath, icns);
fs.unlinkSync(tmpPng1024);

console.log("Wrote", icoPath, ",", pngPath, "and", icnsPath);
