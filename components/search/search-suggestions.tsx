'use client';

const SUGGESTIONS = [
  { emoji: '🌳', text: 'Treehouse in the mountains with hiking trails' },
  { emoji: '⛰️', text: 'Off-grid cabin surrounded by nature' },
  { emoji: '🎉', text: 'Group celebration spot in wine country' },
  { emoji: '🌏', text: 'Cultural escape in Japan or Bali' },
  { emoji: '❄️', text: 'Cozy winter cabin with fireplace and sauna' },
  { emoji: '💫', text: 'Luxury glamping with stargazing' },
] as const;

type Props = {
  onSelect: (text: string) => void;
};

export function SearchSuggestions({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
        Try something like
      </p>
      <div className="flex flex-col gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(s.text)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-secondary hover:text-text-primary"
          >
            <span className="text-base">{s.emoji}</span>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
