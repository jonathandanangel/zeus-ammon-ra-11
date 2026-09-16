/** Ruckman Bible Numerics → exact 1611 KJV verses (cited refs only). */

export type RuckmanVerse = {
  ref: string;
  book: string;
  cv: string;
  text: string;
};

type CitedPack = {
  source: string;
  note: string;
  byNumber: Record<string, RuckmanVerse[]>;
};

let packPromise: Promise<CitedPack | null> | null = null;

async function loadCitedPack(): Promise<CitedPack | null> {
  if (!packPromise) {
    packPromise = fetch("/kjv/ruckman-cited.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load Ruckman KJV citations");
        return r.json() as Promise<CitedPack>;
      })
      .catch(() => null);
  }
  return packPromise;
}

/** Verses Ruckman cites (or clearly references) for path number 1–9. */
export async function getRuckmanVersesForNumber(number: number): Promise<{
  verses: RuckmanVerse[];
  source: string;
  note: string;
}> {
  const pack = await loadCitedPack();
  if (!pack) return { verses: [], source: "", note: "" };
  const key = String(number >= 1 && number <= 9 ? number : 9);
  return {
    verses: pack.byNumber[key] ?? [],
    source: pack.source,
    note: pack.note,
  };
}
