// Project review threshold, not a claimed Google ranking threshold.
export const CONTENT_SIMILARITY_THRESHOLD = 0.9;
export const CONTENT_NGRAM_SIZE = 5;

type PageBody = { path: string; paragraphs: string[] };
type Pair = { pathA: string; pathB: string; score: number };

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function ngrams(paragraphs: string[]) {
  const result = new Set<string>();
  for (const paragraph of paragraphs) {
    const words = normalize(paragraph).split(" ").filter(Boolean);
    for (let i = 0; i <= words.length - CONTENT_NGRAM_SIZE; i += 1) {
      result.add(words.slice(i, i + CONTENT_NGRAM_SIZE).join(" "));
    }
  }
  return result;
}

export function auditPageBodies(pages: PageBody[]) {
  const fingerprints = new Map<string, Set<string>>();
  for (const page of pages) {
    // Ignore metadata and paragraph order: changing a title or rearranging a
    // copied body must not make two documents appear unique.
    const fingerprint = page.paragraphs.map(normalize).filter(Boolean).sort().join("\n");
    if (!fingerprint) continue;
    const paths = fingerprints.get(fingerprint) ?? new Set<string>();
    paths.add(page.path);
    fingerprints.set(fingerprint, paths);
  }
  const exactBodies = [...fingerprints.values()].filter((paths) => paths.size > 1)
    .map((paths) => ({ paths: [...paths].sort() }));
  const documents = pages.map((page) => ({ path: page.path, grams: ngrams(page.paragraphs) }));
  const similarBodies: Pair[] = [];
  let maximum: Pair | null = null;
  for (let i = 0; i < documents.length; i += 1) {
    for (let j = i + 1; j < documents.length; j += 1) {
      const left = documents[i];
      const right = documents[j];
      const smaller = left.grams.size <= right.grams.size ? left.grams : right.grams;
      const larger = smaller === left.grams ? right.grams : left.grams;
      let intersection = 0;
      for (const gram of smaller) if (larger.has(gram)) intersection += 1;
      const union = left.grams.size + right.grams.size - intersection;
      const score = union ? intersection / union : 0;
      const pair = { pathA: left.path, pathB: right.path, score };
      if (!maximum || score > maximum.score) maximum = pair;
      if (score >= CONTENT_SIMILARITY_THRESHOLD) similarBodies.push(pair);
    }
  }
  return { exactBodies, similarBodies, maximum, blocking: exactBodies.length > 0 || similarBodies.length > 0 };
}
