import type { Tables } from '@/lib/supabase/types';
import {
  MapPin,
  Wifi,
  Flame,
  Bath,
  ChefHat,
  Trees,
  Star,
  Mountain,
  Eye,
  Thermometer,
  Activity,
  BookOpen,
  Bike,
  Waves,
  Droplets,
  Footprints,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

const amenityIcons: Record<string, LucideIcon> = {
  wifi: Wifi,
  fireplace: Flame,
  'hot-tub': Bath,
  kitchen: ChefHat,
  hammock: Trees,
  'stargazing-deck': Star,
  'hiking-trails': Mountain,
  binoculars: Eye,
  sauna: Thermometer,
  'yoga-mat': Activity,
  library: BookOpen,
  bikes: Bike,
  kayaks: Waves,
  'outdoor-shower': Droplets,
  bbq: Flame,
  snowshoes: Footprints,
  firepit: Flame,
};

function formatAmenityName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function StayInfo({ stay }: { stay: Tables<'stays'> }) {
  const amenities = stay.amenities ?? [];

  return (
    <div className="mt-8">
      <h1 className="font-heading text-3xl font-semibold text-text-primary">
        {stay.title}
      </h1>

      <div className="mt-2 flex items-center gap-2">
        <MapPin size={16} className="text-text-secondary" />
        <span className="text-text-secondary">{stay.location}</span>
        <span className="rounded-badge bg-bg-muted px-3 py-1 text-xs text-text-secondary capitalize">
          {stay.type}
        </span>
      </div>

      <section className="mt-8">
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          About this stay
        </h2>
        <p className="mt-3 text-text-body leading-relaxed">
          {stay.description}
        </p>
      </section>

      {amenities.length > 0 && (
        <section className="mt-8">
          <h2 className="font-heading text-xl font-semibold text-text-primary">
            Amenities
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] ?? Sparkles;
              return (
                <span
                  key={amenity}
                  className="flex items-center gap-2 rounded-badge bg-bg-muted px-3 py-2 text-sm text-text-body border border-border-subtle"
                >
                  <Icon size={16} />
                  {formatAmenityName(amenity)}
                </span>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
