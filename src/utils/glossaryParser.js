/**
 * Tabeeb Pedia - فرہنگِ اطباء (Medical Glossary & Tooltip Engine)
 * High-performance, safe HTML parser that highlights medical terms
 * and attaches interactive tooltips and dedicated page links.
 */

// Escape string for regular expression
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Injects glossary tooltips into raw HTML safely without breaking HTML tags or anchor links.
 * @param {string} htmlContent - The raw HTML of the article or page
 * @param {Array} glossaryList - The array of glossary items [{ id, term, slug, shortDefinition, content }]
 * @returns {string} - The enriched HTML with interactive glossary spans
 */
export function injectGlossaryTooltips(htmlContent, glossaryList = []) {
  if (!htmlContent || typeof htmlContent !== 'string' || !Array.isArray(glossaryList) || glossaryList.length === 0) {
    return htmlContent || '';
  }

  // Filter valid terms and sort by length descending (match longer compound terms first)
  const validTerms = glossaryList
    .filter(item => item && item.term && item.term.trim().length >= 2)
    .sort((a, b) => b.term.trim().length - a.term.trim().length);

  if (validTerms.length === 0) return htmlContent;

  // Build a map of term to glossary item
  const termMap = new Map();
  validTerms.forEach(item => {
    const cleanTerm = item.term.trim();
    if (!termMap.has(cleanTerm)) {
      termMap.set(cleanTerm, item);
    }
  });

  // Create combined Regex pattern with word boundaries for Urdu/Arabic characters
  const termsPattern = Array.from(termMap.keys())
    .map(t => escapeRegExp(t))
    .join('|');

  if (!termsPattern) return htmlContent;

  // Regex matches glossary terms only when NOT inside an existing HTML tag or <a> tag
  // We split by HTML tags to only replace in pure text nodes
  const tagOrTextRegex = /(<\/?[a-zA-Z0-9]+(?:\s+[^>]*?)?>)/gi;
  const parts = htmlContent.split(tagOrTextRegex);

  let insideAnchor = 0;
  let insideHeading = 0;
  let insideCode = 0;

  // Keep track of terms matched per article (limit to first 2-3 occurrences per term to avoid clutter)
  const occurrenceCount = new Map();

  const termRegex = new RegExp(`(?<![\\w\\u0600-\\u06FF])(${termsPattern})(?![\\w\\u0600-\\u06FF])`, 'g');

  const processedParts = parts.map(part => {
    if (!part) return '';

    // Check if part is an HTML tag
    if (part.startsWith('<') && part.endsWith('>')) {
      const lower = part.toLowerCase();
      if (/^<a\b/i.test(lower)) insideAnchor++;
      else if (/^<\/a>/i.test(lower)) insideAnchor = Math.max(0, insideAnchor - 1);

      if (/^<h[1-6]\b/i.test(lower)) insideHeading++;
      else if (/^<\/h[1-6]>/i.test(lower)) insideHeading = Math.max(0, insideHeading - 1);

      if (/^<(code|pre|script|style)\b/i.test(lower)) insideCode++;
      else if (/^<\/(code|pre|script|style)>/i.test(lower)) insideCode = Math.max(0, insideCode - 1);

      return part;
    }

    // Skip text inside links, headers, code blocks
    if (insideAnchor > 0 || insideHeading > 0 || insideCode > 0) {
      return part;
    }

    // Replace matching glossary terms in text node
    return part.replace(termRegex, (matchedTerm) => {
      const item = termMap.get(matchedTerm.trim());
      if (!item) return matchedTerm;

      const currentCount = occurrenceCount.get(item.term) || 0;
      if (currentCount >= 3) {
        // Max 3 tooltips per unique term per article to keep reading clean
        return matchedTerm;
      }
      occurrenceCount.set(item.term, currentCount + 1);

      const safeDefinition = (item.shortDefinition || item.term)
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

      const slug = item.slug || encodeURIComponent(item.term);

      return `<span class="glossary-term-wrap relative inline-block group" data-glossary-term="${item.term}" data-glossary-slug="${slug}"><span class="glossary-term-highlight cursor-pointer border-b-2 border-dotted border-emerald-600 dark:border-emerald-400 font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-600 dark:hover:text-emerald-200 transition-colors">${matchedTerm}</span><span class="glossary-tooltip-card pointer-events-none group-hover:pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-200 absolute bottom-full right-1/2 translate-x-1/2 mb-2 w-72 sm:w-80 bg-slate-900 border border-emerald-500/40 text-slate-100 rounded-2xl p-3.5 shadow-2xl z-50 text-right text-xs leading-relaxed transform scale-95 group-hover:scale-100 font-sans backdrop-blur-md"><span class="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2"><span class="font-bold text-emerald-400 font-h2 text-sm flex items-center gap-1.5">📖 ${item.term}</span><span class="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">فرہنگِ اطباء</span></span><span class="block text-slate-300 font-nastaliq text-xs line-clamp-4 leading-loose mb-2.5">${safeDefinition}</span><a href="/farhang/${slug}" class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors font-simple"><span>مکمل طبی تشریح پڑھیں ←</span></a></span></span>`;
    });
  });

  return processedParts.join('');
}
