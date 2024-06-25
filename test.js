// scripts/copyPdfWorker.js
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, './node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const destination = path.join(__dirname, './public/pdf.worker.mjs');

fs.copyFileSync(source, destination);
console.log('pdf.worker.js copied to public directory');
