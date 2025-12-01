// config/style-dictionary.mjs
import StyleDictionary from "style-dictionary";

/* -------------------------------------------------------
 * Helpers
 * ----------------------------------------------------- */

/**
 * Turn a font-family value (array or string) into a CSS font list.
 * ["Segoe UI", "Helvetica Neue", "Arial", "sans-serif"]
 * -> "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
 */
function formatFontFamily(value) {
  if (Array.isArray(value)) {
    return value
      .map((family) => {
        const s = String(family);
        return /\s/.test(s) ? `'${s}'` : s;
      })
      .join(", ");
  }

  if (value == null) return "";
  const s = String(value);
  return /\s/.test(s) ? `'${s}'` : s;
}

/**
 * Best-effort “raw” token value: prefer resolved token.value,
 * otherwise original.$value.
 */
function getTokenRawValue(token) {
  if (token.value !== undefined) return token.value;
  if (token.original?.$value !== undefined) return token.original.$value;
  return undefined;
}

/**
 * Build a lookup map for resolving {foo.bar.baz} references.
 * We store token.value if possible, otherwise original.$value.
 * Arrays/objects are allowed (needed for fontFamily arrays).
 */
function buildTokenLookup(dictionary) {
  const map = new Map();

  for (const token of dictionary.allTokens) {
    const key = token.path.join(".");
    const raw = getTokenRawValue(token);
    if (raw !== undefined) {
      map.set(key, raw);
    }
  }

  return map;
}

/**
 * Resolve a single reference string like "{font.size.base}".
 * Follows chains:
 *   "{font.size.base}" -> "{font.size.1}" -> "18px"
 * with a safety depth limit.
 */
function resolveRefString(ref, tokenLookup, maxDepth = 10) {
  if (ref == null || typeof ref !== "string") return ref;

  let current = ref;
  let depth = 0;

  while (depth < maxDepth && typeof current === "string") {
    const match = current.match(/^\{(.+)\}$/);
    if (!match) break;

    const key = match[1]; // e.g. "font.size.base"
    if (!tokenLookup.has(key)) {
      // Unknown ref -> leave as-is so it's visible rather than silently wrong
      return current;
    }

    current = tokenLookup.get(key);
    depth += 1;
  }

  return current;
}

/**
 * Recursively resolve any value (string, array, etc.) that may contain refs.
 */
function resolveAny(value, tokenLookup) {
  if (Array.isArray(value)) {
    return value.map((v) => resolveAny(v, tokenLookup));
  }

  if (typeof value === "string") {
    return resolveRefString(value, tokenLookup);
  }

  // For objects, we resolve at the property level where needed.
  return value;
}

/**
 * Resolve a token to a scalar (string/number) if possible.
 */
function resolveTokenScalar(token, tokenLookup) {
  const raw = getTokenRawValue(token);
  const resolved = resolveAny(raw, tokenLookup);

  if (typeof resolved === "string" || typeof resolved === "number") {
    return resolved;
  }

  return undefined;
}

/* -------------------------------------------------------
 * CSS format: Tailwind v4 @theme tokens
 * ----------------------------------------------------- */

StyleDictionary.registerFormat({
  name: "css/tailwind-theme-tokens",
  format: ({ dictionary }) => {
    const lines = [];
    const tokenLookup = buildTokenLookup(dictionary);

    lines.push("@theme {");

    /* ---------- COLORS ---------- */

    const colorTokens = dictionary.allTokens.filter(
      (t) => t.path[0] === "color"
    );

    for (const token of colorTokens) {
      const [, palette, shade] = token.path; // ["color", "sun", "100"]
      if (!palette || !shade) continue;

      const value = resolveTokenScalar(token, tokenLookup);
      if (value === undefined) continue;

      lines.push(`  --color-${palette}-${shade}: ${value};`);
    }

    /* ---------- SPACING ---------- */

    const spacingTokens = dictionary.allTokens.filter(
      (t) => t.path[0] === "spacing"
    );

    if (spacingTokens.length > 0) {
      const baseToken =
        spacingTokens.find((t) => t.path[1] === "1") ?? spacingTokens[0];

      if (baseToken) {
        const baseVal = resolveTokenScalar(baseToken, tokenLookup);
        if (baseVal !== undefined) {
          // Tailwind v4: --spacing is the base unit for p-1, m-1, etc.
          lines.push(`  --spacing: ${baseVal};`);
        }
      }

      for (const token of spacingTokens) {
        const key = token.path[1]; // "0", "1", "base", etc.
        if (!key) continue;

        const value = resolveTokenScalar(token, tokenLookup);
        if (value === undefined) continue;

        lines.push(`  --spacing-${key}: ${value};`);
      }
    }

    /* ---------- FONT BASE TOKENS (family/size/weight/leading) ---------- */

    const fontTokens = dictionary.allTokens.filter((t) => t.path[0] === "font");

    for (const token of fontTokens) {
      const [, subType, id] = token.path;
      if (!subType || !id) continue;

      const raw = getTokenRawValue(token);
      if (raw === undefined) continue;

      if (subType === "family") {
        const resolved = resolveAny(raw, tokenLookup); // may be array or ref
        const name = `--font-family-${id}`;
        const value = formatFontFamily(resolved);
        lines.push(`  ${name}: ${value};`);
      } else if (["size", "weight", "leading"].includes(subType)) {
        const resolved = resolveAny(raw, tokenLookup);
        const name = `--font-${subType}-${id}`;
        lines.push(`  ${name}: ${resolved};`);
      }
    }

    /* ---------- TYPOGRAPHY COMPOSITES (e.g. font.title.1) ---------- */

    const typographyTokens = fontTokens.filter((token) => {
      if (token.original?.$type === "typography") return true;
      if (token.$type === "typography") return true;
      return false;
    });

    for (const token of typographyTokens) {
      const suffix = token.path.slice(1).join("-"); // "title-1", "body-1", etc.

      const base =
        (token.value && typeof token.value === "object" && token.value) ||
        (token.original?.$value && typeof token.original.$value === "object"
          ? token.original.$value
          : {});

      let { fontFamily, fontWeight, fontSize, lineHeight } = base;

      // Resolve nested refs like "{font.size.base}" or "{font.family.2}"
      fontFamily = resolveAny(fontFamily, tokenLookup);
      fontWeight = resolveAny(fontWeight, tokenLookup);
      fontSize = resolveAny(fontSize, tokenLookup);
      lineHeight = resolveAny(lineHeight, tokenLookup);

      const familyStr = formatFontFamily(fontFamily ?? "");
      const weightStr = fontWeight ?? "";
      const sizeStr = fontSize ?? "";
      const leadingStr = lineHeight ?? "";

      const parts = [];
      if (weightStr) parts.push(weightStr);
      if (sizeStr) {
        parts.push(leadingStr ? `${sizeStr}/${leadingStr}` : sizeStr);
      }

      let shorthand = parts.join(" ");
      if (familyStr) {
        shorthand = shorthand ? `${shorthand} ${familyStr}` : familyStr;
      }

      lines.push(`  --font-${suffix}: ${shorthand};`);
    }

    lines.push("}");
    lines.push("");

    return lines.join("\n");
  },
});

/* -------------------------------------------------------
 * Style Dictionary config
 * ----------------------------------------------------- */

const sd = new StyleDictionary({
  source: ["src/design-tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css", // built-in group → no transform errors
      buildPath: "src/styles/",
      files: [
        {
          destination: "tokens.theme.css",
          format: "css/tailwind-theme-tokens",
        },
      ],
    },
    js: {
      transformGroup: "js",
      buildPath: "src/styles/",
      files: [
        {
          destination: "tokens.ts",
          format: "javascript/es6",
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();

export default sd;
