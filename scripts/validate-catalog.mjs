import { readFileSync } from "node:fs";

const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
const requiredHeadings = [
  "## Featured: Nexscope Ecommerce APIs",
  "## Marketplace and Storefront APIs",
  "## Product and Market Intelligence APIs",
  "## Commerce Operations APIs",
  "## Product Creative APIs",
  "## Ecommerce Automation and Agent Tools",
  "## Inclusion policy",
  "## Contributing",
  "## Maintenance and limitations",
  "## License",
];
const requiredNexscopeUrls = [
  "https://www.nexscope.ai/apis?co-from=github",
  "https://www.nexscope.ai/apis/data?co-from=github",
  "https://www.nexscope.ai/apis/amazon?co-from=github",
  "https://www.nexscope.ai/apis/creatives?co-from=github",
  "https://www.nexscope.ai/api-docs?co-from=github",
];

const errors = [];
if (!readme.startsWith("# Awesome Ecommerce APIs Directory\n")) {
  errors.push("README title must be Awesome Ecommerce APIs Directory.");
}
for (const heading of requiredHeadings) {
  if (!readme.includes(heading)) errors.push(`Missing heading: ${heading}`);
}
for (const url of requiredNexscopeUrls) {
  if (!readme.includes(url)) errors.push(`Missing approved Nexscope URL: ${url}`);
}
if (/https:\/\/www\.nexscope\.ai\/(?![^)\s]*\?co-from=github)/.test(readme)) {
  errors.push("Every Nexscope link must use co-from=github.");
}
if (/\b(?:TODO|TBD|review draft|not yet a GitHub repository)\b/i.test(readme)) {
  errors.push("README includes an unpublished-draft placeholder.");
}

const entryUrls = [...readme.matchAll(/^\s*- \[[^\]]+\]\((https:\/\/[^)\s]+)\)/gm)].map((match) => match[1]);
const allUrls = [...new Set(entryUrls)];
const allowedRepeated = new Set([
  "https://www.nexscope.ai/apis/data?co-from=github",
  "https://www.nexscope.ai/apis/amazon?co-from=github",
  "https://www.nexscope.ai/apis/creatives?co-from=github",
]);
for (const url of allUrls) {
  const count = entryUrls.filter((value) => value === url).length;
  if (count > 1 && !allowedRepeated.has(url)) {
    errors.push(`Unexpected duplicate entry URL: ${url}`);
  }
}
if (allUrls.length < 70) errors.push(`Expected at least 70 unique entry URLs; found ${allUrls.length}.`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`validated ${entryUrls.length} entries and ${allUrls.length} unique URLs`);
