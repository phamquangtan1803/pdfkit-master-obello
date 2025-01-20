// the fs here is not node fs but the provided virtual one
import fs from 'fs';
// the content file is returned as is (webpack is configured to load *.afm files as asset/source)
import Courier from 'pdfkit/js/data/Courier.afm';
import CourierBold from 'pdfkit/js/data/Courier-Bold.afm';

async function registerBinaryFiles(ctx) {
  const keys = ctx.keys();
  for (const key of keys) {
    // extracts "./" from beginning of the key
    fs.writeFileSync(key.substring(2), await ctx(key));
  }
}

async function registerAFMFonts(ctx) {
  const keys = ctx.keys();
  for (const key of keys) {
    const match = key.match(/([^/]*\.afm$)/);
    if (match) {
      // afm files must be stored on data path
      fs.writeFileSync(`data/${match[0]}`, await ctx(key));
    }
  }
}

// register all files found in assets folder (relative to src)
import('./static-assets').then(module => {
  registerBinaryFiles(module.default);
});

// register AFM fonts distributed with pdfkit
// is good practice to register only required fonts to avoid the bundle size increase too much
import('pdfkit/js/data').then(module => {
  registerAFMFonts(module.default);
});

// register files imported directly
fs.writeFileSync('data/Courier.afm', Courier);
fs.writeFileSync('data/Courier-Bold.afm', CourierBold);
