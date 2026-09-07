import { Head, Link, router } from '@inertiajs/react';
import { ChevronRight, Search, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import VerificationBadge from '@/components/verification-badge';

type Hero = {
    id: number;
    hero_code: string;
    name: string;
    epithet?: string;
    ancestry: string;
    class: string;
    level: number;
    faction?: string;
    verification_status: string;
    standing_status: string;
};
export default function HeroesIndex({
    heroes,
    search,
}: {
    heroes: Hero[];
    search: string;
}) {
    return (
        <>
            <Head title="Hero ledger" />
            <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
                <header>
                    <p className="eyebrow">Canonical records</p>
                    <h1 className="mt-1 font-display text-4xl font-semibold">
                        Hero ledger
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Every sworn hero, their standing, faction, and field
                        history.
                    </p>
                </header>
                <div className="meridian-panel mt-7 overflow-hidden">
                    <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                defaultValue={search}
                                onChange={(e) =>
                                    router.get(
                                        '/heroes',
                                        { search: e.target.value },
                                        { preserveState: true, replace: true },
                                    )
                                }
                                placeholder="Search by name, code, or calling…"
                                className="pl-9"
                            />
                        </div>
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UsersRound className="size-4" />
                            {heroes.length} heroes recorded
                        </span>
                    </div>
                    <div className="divide-y">
                        {heroes.map((hero) => (
                            <Link
                                href={`/heroes/${hero.id}`}
                                key={hero.id}
                                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 transition hover:bg-secondary/60 md:grid-cols-[auto_1.2fr_1fr_1fr_auto]"
                            >
                                <div className="flex size-11 items-center justify-center rounded-full border border-brass/30 bg-parchment font-display text-lg text-parchment-foreground">
                                    {hero.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </div>
                                <div className="min-w-0">
                                    <div className="truncate font-medium">
                                        {hero.name}
                                    </div>
                                    <div className="truncate text-xs text-muted-foreground">
                                        {hero.hero_code}
                                        {hero.epithet && ` · ${hero.epithet}`}
                                    </div>
                                    <div className="mt-0.5 text-xs text-muted-foreground md:hidden">
                                        Level {hero.level} {hero.class} ·{' '}
                                        {hero.faction || 'Unaffiliated'}
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <p className="text-sm">
                                        Level {hero.level} {hero.class}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {hero.ancestry}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="hidden w-fit md:inline-flex"
                                >
                                    {hero.faction || 'Unaffiliated'}
                                </Badge>
                                <div className="flex items-center gap-3">
                                    <VerificationBadge
                                        status={hero.verification_status}
                                    />
                                    <ChevronRight className="size-4 text-muted-foreground" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
HeroesIndex.layout = {
    breadcrumbs: [{ title: 'Hero ledger', href: '/heroes' }],
};
