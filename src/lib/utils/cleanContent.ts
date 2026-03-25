import { decode } from "html-entities";

const cleanContent = (content: string): string =>
  decode(content)
    .replace(/\\n'\s*\+\s*\n\s*'/g, " ") // remove \n' + newline '
    .replace(/^'|'$/g, "") // remove wrapping quotes
    .replace(/\b(uh+|um+|uhh+|umm+|hmm+|ah+|er+|like,?\s(?=\w))\b/gi, "") // filler words
    .replace(/\s{2,}/g, " ") // collapse extra spaces
    .trim();

export default cleanContent;
