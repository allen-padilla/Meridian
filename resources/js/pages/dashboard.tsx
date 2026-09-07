import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    Compass,
    MapPin,
    UsersRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VerificationBadge from '@/components/verification-badge';
import { formatDate, formatDayHeading, greetingFor } from '@/lib/format';

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
    nextQuest: Quest | null;
    recentHeroes: Hero[];
    factions: { faction: string; total: number }[];
};

export default function Dashboard({
    metrics,
    nextQuest,
    recentHeroes,
    factions,
}: Props) {
    const { auth } = usePage().props;
    const firstName = auth.user.name.split(' ')[0];
    const revisionLine =
        metrics.pendingRevisions === 0
            ? 'No revisions are waiting. The ledger is steady.'
            : `${metrics.pendingRevisions} hero ${metrics.pendingRevisions === 1 ? 'revision awaits' : 'revisions await'} your judgment before the next expedition.`;

    return (
        <>
            <Head title="Guild overview" />
            <div className="mx-auto w-full max-w-[1380px] space-y-6 p-4 md:p-8 lg:p-10">
                <header className="grid gap-5 border-b border-border/80 pb-7 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <p className="text-xs font-medium text-pine">
                            {formatDayHeading(new Date())}
                        </p>
                        <h1 className="mt-2 max-w-3xl font-display text-4xl leading-[1.04] font-semibold tracking-[-0.025em] md:text-5xl">
                            {greetingFor()}, {firstName}.
                        </h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground">
                            {revisionLine}
                        </p>
                    </div>
                    <Button asChild className="whitespace-nowrap">
                        <Link href="/quests">
                            Open quest board <ArrowRight />
                        </Link>
                    </Button>
                </header>
                <section className="meridian-panel grid grid-cols-2 overflow-hidden xl:grid-cols-4">
                    {[
                        ['Heroes in ledger', metrics.heroes],
                        ['Verified standing', metrics.verified],
                        ['Pending revisions', metrics.pendingRevisions],
                        ['Active quests', metrics.activeQuests],
                    ].map(([label, value], index) => (
                        <div
                            key={label}
                            className={`relative border-border/70 p-5 ${index % 2 === 0 ? 'border-r' : ''} ${index < 2 ? 'border-b' : ''} ${index < 3 ? 'xl:border-r' : ''} xl:border-b-0`}
                        >
                            <p className="text-sm text-muted-foreground">
                                {label}
                            </p>
                            <p className="mt-3 font-display text-4xl leading-none font-semibold tabular-nums">
                                {value}
                            </p>
                        </div>
                    ))}
                </section>
                <section className="grid gap-6 lg:grid-cols-[1.5fr_.8fr]">
                    {nextQuest ? (
                        <div className="meridian-panel overflow-hidden bg-primary text-primary-foreground">
                            <div className="relative min-h-72 p-6 md:p-8">
                                <div className="absolute inset-0 [background-image:radial-gradient(circle_at_82%_8%,color-mix(in_oklab,var(--sidebar-primary)_70%,transparent)_0,transparent_34%)] opacity-25" />
                                <Compass
                                    className="absolute right-6 bottom-5 size-36 text-primary-foreground/[0.045]"
                                    strokeWidth={1}
                                />
                                <div className="relative">
                                    <p className="text-xs font-medium text-primary-foreground/60">
                                        Next expedition
                                    </p>
                                    <h2 className="mt-4 max-w-xl font-display text-3xl leading-tight font-semibold md:text-4xl">
                                        {nextQuest.name}
                                    </h2>
                                    <p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/70">
                                        A party is assembling. Review
                                        preparations and fill the remaining
                                        places before departure.
                                    </p>
                                    <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-primary-foreground/85">
                                        <span className="flex items-center gap-2">
                                            <CalendarDays className="size-4 text-sidebar-primary" />
                                            {formatDate(nextQuest.starts_at)}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <MapPin className="size-4 text-sidebar-primary" />
                                            {nextQuest.location}
                                        </span>
                                        <span>
                                            {nextQuest.enlistments_count}{' '}
                                            enlisted
                                        </span>
                                    </div>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="mt-7"
                                    >
                                        <Link href={`/quests/${nextQuest.id}`}>
                                            Review quest <ArrowRight />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="meridian-panel p-6 text-muted-foreground md:p-8">
                            No expedition is scheduled. Post a quest to assemble
                            the next party.
                        </div>
                    )}
                    <div className="meridian-panel p-6 md:p-7">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-display text-2xl font-semibold">
                                    Guild composition
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Heroes by sworn faction
                                </p>
                            </div>
                            <UsersRound className="size-5 text-pine" />
                        </div>
                        <div className="mt-7 grid gap-3">
                            {factions.map((f) => (
                                <div
                                    key={f.faction}
                                    className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-border/65 pb-3 last:border-0 last:pb-0"
                                >
                                    <span className="text-sm">{f.faction}</span>
                                    <span className="font-display text-3xl leading-none font-semibold text-pine tabular-nums">
                                        {f.total}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="meridian-panel">
                    <div className="flex items-center justify-between border-b p-5 md:px-6">
                        <div>
                            <h2 className="font-display text-2xl font-semibold">
                                Recently entered heroes
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Latest additions to the trusted ledger
                            </p>
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
                                className="group flex items-center gap-4 p-4 transition-colors hover:bg-accent/55 md:px-6"
                            >
                                <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-secondary font-display text-lg text-pine">
                                    {hero.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('')}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="font-medium">{hero.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {hero.hero_code} / Level {hero.level}{' '}
                                        {hero.class}
                                    </p>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="hidden sm:inline-flex"
                                >
                                    {hero.faction}
                                </Badge>
                                <VerificationBadge
                                    status={hero.verification_status}
                                />
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
