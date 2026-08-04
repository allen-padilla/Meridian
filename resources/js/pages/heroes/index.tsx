import { Head, Link, router } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronRight,
    Search,
    ShieldAlert,
    UsersRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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
                                className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-4 transition hover:bg-[#f4ecda]/60 md:grid-cols-[auto_1.2fr_1fr_1fr_auto]"
                            >
                                <div className="flex size-11 items-center justify-center rounded-full border border-[#b8924f]/30 bg-[#f5ecd8] font-display text-lg text-[#785b2f]">
                                    {hero.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </div>
                                <div>
                                    <div className="font-medium">
                                        {hero.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {hero.epithet || hero.hero_code}
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
                                    {hero.verification_status === 'verified' ? (
                                        <CheckCircle2 className="size-4 text-emerald-700" />
                                    ) : (
                                        <ShieldAlert className="size-4 text-amber-700" />
                                    )}
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
