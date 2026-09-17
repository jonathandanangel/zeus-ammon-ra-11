import * as React from "react";
import { audio, type MusicAlbumCredit } from "@/game/audio";
import { cn } from "@/lib/utils";

/**
 * Live album-title badge for Heat Transfer beds.
 * New musicians get album credit front-and-center while their track plays.
 */
export function NowPlayingAlbum({
  className,
  accent = "#ff2a2a",
}: {
  className?: string;
  accent?: string;
}) {
  const [credit, setCredit] = React.useState<MusicAlbumCredit | null>(() => audio.getNowPlaying());

  React.useEffect(() => audio.onNowPlaying(setCredit), []);

  if (!credit) return null;

  return (
    <aside
      className={cn(
        "pointer-events-none fixed bottom-4 left-4 z-40 flex max-w-[min(92vw,20rem)] items-center gap-3 rounded-sm border bg-black/70 p-2 shadow-[0_0_28px_rgba(0,0,0,0.55)] backdrop-blur-md",
        className,
      )}
      style={{ borderColor: `${accent}99` }}
      aria-live="polite"
      aria-label={`Now playing ${credit.albumTitle} by ${credit.artist}`}
    >
      {credit.coverUrl ? (
        <img
          src={credit.coverUrl}
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-sm object-cover"
          decoding="async"
        />
      ) : (
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm border font-display text-[10px] uppercase tracking-widest"
          style={{ borderColor: `${accent}66`, color: accent }}
        >
          LP
        </div>
      )}
      <div className="min-w-0">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
          Now playing · album
        </p>
        <p className="truncate font-display text-sm tracking-[0.04em]" style={{ color: accent }}>
          {credit.albumTitle}
        </p>
        <p className="truncate font-mono text-[10px] text-moon/90">
          {credit.artist}
          {credit.year ? ` · ${credit.year}` : ""}
        </p>
      </div>
    </aside>
  );
}

/** Static album strip for the Heat Transfer title-card (featured releases). */
export function HeatAlbumCredits({ albums }: { albums: MusicAlbumCredit[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {albums.map((album) => (
        <figure
          key={album.id}
          className="flex min-w-[10.5rem] max-w-[14rem] flex-1 items-center gap-2.5 rounded-sm border border-[#ff8c1a]/45 bg-black/40 p-2"
        >
          {album.coverUrl ? (
            <img
              src={album.coverUrl}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-sm object-cover"
              decoding="async"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-[#ff8c1a]/40 font-display text-[9px] uppercase tracking-widest text-[#ff8c1a]">
              LP
            </div>
          )}
          <figcaption className="min-w-0 text-left">
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">Album</p>
            <p className="truncate font-display text-sm text-[#ff8c1a]">{album.albumTitle}</p>
            <p className="truncate font-mono text-[10px] text-moon/85">
              {album.artist}
              {album.year ? ` · ${album.year}` : ""}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
