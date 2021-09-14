import remark from "remark";
import html from "remark-html";
import textr from "remark-textr";
import quotes from "typographic-quotes";

export default async function markdownToHtml(markdown) {
  const result = await remark()
    .use(textr, {
      plugins: [sculls, punctuation, consistencies, ellipses, quotes],
    })
    .use(html, { sanitize: false })
    .process(markdown);
  return result.toString();
}

function sculls(input) {
  return input
    .replace(/1x/gim, "1×")
    .replace(/1X/gim, "1×")
    .replace(/2x/gim, "2×")
    .replace(/2X/gim, "2×")
    .replace(/4x/gim, "4×")
    .replace(/4X/gim, "4×");
}

function punctuation(input) {
  return input.replace(/\b \!/gim, "!").replace(/\b \?/gim, "?");
}

function consistencies(input) {
  return input.replace(/e-mail/gim, `email`).replace(/womens/gim, `women’s`);
}
function ellipses(input) {
  return input.replace(/\.{3}/gim, "…");
}
