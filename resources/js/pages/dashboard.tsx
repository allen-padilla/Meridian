import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    CheckCircle2,
    Compass,
    MapPin,
    ShieldCheck,
    Sparkles,
    UsersRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Hero = {
    id: number;
    name: string;
    hero_code: string;
    class: string;
    level: number;
    faction: string;
    verification_status: string;
};
type Quest = {
    id: number;
    name: string;
    location: string;
    starts_at: string;
    difficulty: string;
    enlistments_count: number;
};
type Props = {
    metrics: {
        heroes: number;
        verified: number;
        pendingRevisions: number;
        activeQuests: number;
    };
    nextQuest: Quest;
    recentHeroes: Hero[];
    factions: { faction: string; total: number }[];
};

const Metric = ({
    label,
    value,
    icon: Icon,
    tone,
}: {
    label: string;
    value: number;
    icon: typeof UsersRound;
    tone: string;
}) => (
    <div className="meridian-panel p-5">
        <div className="flex items-center justify-between">
            <div>
                <p className="eyebrow">{label}</p>
                <p className="mt-2 font-display text-4xl font-semibold">
                    {value}
                </p>
            </div>
            <div className={`rounded-xl p-3 ${tone}`}>
                <Icon className="size-5" />
            </div>
        </div>
    </div>
);

export default function Dashboard({
    metrics,
    nextQuest,
    recentHeroes,
    factions,
}: Props) {
    return (
        <>
            <Head title="Guild overview" />
            <div className="mx-auto w-full max-w-7xl space-y-7 p-4 md:p-8">
                <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="eyebrow">Fourth day of Highsun</p>
                        <h1 className="mt-1 font-display text-4xl font-semibold md:text-5xl">
                            Good morning, Guild Master.
                        </h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground">
                            The ledger is steady. Two hero revisions await your
                            judgment before the next expedition.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-[#315c48] text-[#fffaf0] hover:bg-[#274c3b]"
                    >
                        <Link href="/quests">
                            Open quest board <ArrowRight />
                        </Link>
                    </Button>
                </header>
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Metric
                        label="Heroes in ledger"
                        value={metrics.heroes}
                        icon={UsersRound}
                        tone="bg-emerald-900/8 text-emerald-800"
                    />
                    <Metric
                        label="Verified standing"
                        value={metrics.verified}
                        icon={ShieldCheck}
                        tone="bg-blue-900/8 text-blue-800"
                    />
                    <Metric
                        label="Pending revisions"
                        value={metrics.pendingRevisions}
                        icon={Sparkles}
                        tone="bg-amber-900/8 text-amber-800"
                    />
                    <Metric
                        label="Active quests"
                        value={metrics.activeQuests}
                        icon={Compass}
                        tone="bg-rose-900/8 text-rose-800"
                    />
                </section>
                <section className="grid gap-6 lg:grid-cols-[1.45fr_.75fr]">
                    <div className="meridian-panel overflow-hidden">
                        <div className="relative bg-[#203c31] p-6 text-[#f8f1df] md:p-8">
                            <div className="absolute inset-0 [background-image:radial-gradient(circle_at_80%_20%,#d0aa61_0,transparent_35%)] opacity-20" />
                            <div className="relative">
                                <p className="text-[10px] font-semibold tracking-[.24em] text-[#d0aa61] uppercase">
                                    Next expedition
                                </p>
                                <h2 className="mt-3 font-display text-3xl font-semibold">
                                    {nextQuest.name}
                                </h2>
                                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#e5ddcb]/75">
                                    A party is assembling. Review preparations
                                    and fill the remaining places before
                                    departure.
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                                    <span className="flex items-center gap-2">
                                        <CalendarDays className="size-4 text-[#d0aa61]" />
                                        {new Date(
                                            nextQuest.starts_at,
                                        ).toLocaleDateString(undefined, {
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <MapPin className="size-4 text-[#d0aa61]" />
                                        {nextQuest.location}
                                    </span>
                                    <span>
                                        {nextQuest.enlistments_count} enlisted
                                    </span>
                                </div>
                                <Button
                                    asChild
                                    variant="secondary"
                                    className="mt-7 bg-[#f2e9d4] text-[#203c31]"
                                >
                                    <Link href={`/quests/${nextQuest.id}`}>
                                        Review quest <ArrowRight />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="meridian-panel p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="eyebrow">Faction balance</p>
                                <h2 className="mt-1 font-display text-2xl font-semibold">
                                    Guild composition
                                </h2>
                            </div>
                            <Compass className="size-5 text-[#98753b]" />
                        </div>
                        <div className="mt-6 space-y-5">
                            {factions.map((f, i) => (
                                <div key={f.faction}>
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span>{f.faction}</span>
                                        <span className="text-muted-foreground">
                                            {f.total}
                                        </span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e5dcc8]">
                                        <div
                                            className="h-full rounded-full bg-[#315c48]"
                                            style={{
                                                width: `${Math.max(24, 100 - i * 18)}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="meridian-panel">
                    <div className="flex items-center justify-between border-b p-5">
                        <div>
                            <p className="eyebrow">Fresh ink</p>
                            <h2 className="mt-1 font-display text-2xl font-semibold">
                                Recently entered heroes
                            </h2>
                        </div>
                        <Button variant="ghost" asChild>
                            <Link href="/heroes">
                                View ledger <ArrowRight />
                            </Link>
                        </Button>
                    </div>
                    <div className="divide-y">
                        {recentHeroes.map((hero) => (
                            <Link
                                href={`/heroes/${hero.id}`}
                                key={hero.id}
                                className="flex items-center gap-4 p-4 transition hover:bg-[#f4ecda]/60"
                            >
                                <div className="flex size-10 items-center justify-center rounded-full border border-[#b8924f]/35 bg-[#f5ecd8] font-display text-lg text-[#785b2f]">
                                    {hero.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">{hero.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {hero.hero_code} · Level {hero.level}{' '}
                                        {hero.class}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="hidden sm:inline-flex"
                                >
                                    {hero.faction}
                                </Badge>
                                {hero.verification_status === 'verified' && (
                                    <CheckCircle2 className="size-4 text-emerald-700" />
                                )}
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
Dashboard.layout = {
    breadcrumbs: [{ title: 'Guild overview', href: '/dashboard' }],
};
