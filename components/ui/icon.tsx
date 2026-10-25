import { Building2, Droplets, Dumbbell, ShieldCheck, ShoppingBasket, Trees, Trophy, Waves, Zap, type LucideIcon } from "lucide-react";

// Data files name icons by string; only these are bundled.
const ICONS: Record<string, LucideIcon> = { Building2, Droplets, Dumbbell, ShieldCheck, ShoppingBasket, Trees, Trophy, Waves, Zap };

export function Icon({ name, className }: { name: string; className?: string }) {
  const I = ICONS[name] ?? Building2;
  return <I className={className} aria-hidden />;
}
