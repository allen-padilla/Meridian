import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Gauge,
    Swords,
    UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type Datum = { label: string; value: number };
type Props = {
    overview: {
        totalHeroes: number;
        verifiedRate: number;
        activeRate: number;
        participationRate: number;
        averageLevel: number;
    };
    growth: Datum[];
    factions: Datum[];
    classes: Datum[];
    verification: Datum[];
    levelBands: Datum[];
    questActivity: {
        totalEnlistments: number;
        musteredEnlistments: number;
        averageQuestsPerHero: number;
    };
};

const formatLabel = (label: string) =>
    label
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());

function BarList({ data }: { data: Datum[] }) {
    const maximum = Math.max(...data.map((item) => item.value), 1);

    if (data.length === 0) {
        return (
            <p className="py-8 text-sm text-muted-foreground">
                No records are available for this breakdown.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {data.map((item) => (
                <div key={item.label}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
                        <span>{formatLabel(item.label)}</span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                            {item.value}
                        </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary"
                            style={{
                                width: `${(item.value / maximum) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function Stat({
    label,
    value,
    detail,
}: {
    label: string;
    value: string | number;
    detail: string;
}) {
    return (
        <div className="border-border/70 p-5 first:border-r sm:border-r sm:last:border-r-0">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 font-display text-4xl leading-none font-semibold tabular-nums">
                {value}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {detail}
            </p>
        </div>
    );
}

export default function HeroAnalytics({
    overview,
    growth,
    factions,
    classes,
    verification,
    levelBands,
    questActivity,
}: Props) {
    const growthMaximum = Math.max(...growth.map((month) => month.value), 1);
    const musteredRate = questActivity.totalEnlistments
        ? Math.round(
              (questActivity.musteredEnlistments /
                  questActivity.totalEnlistments) *
                  100,
          )
        : 0;

    return (
        <>
            <Head title="Hero analytics" />
            <div className="mx-auto w-full max-w-[1380px] space-y-6 p-4 md:p-8 lg:p-10">
                <header className="grid gap-5 border-b border-border/80 pb-7 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                        <p className="text-xs font-medium text-primary">
                            Ledger intelligence
                        </p>
                        <h1 className="mt-2 font-display text-4xl leading-tight font-semibold tracking-[-0.025em] md:text-5xl">
                            Hero analytics
                        </h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground">
                            Trust, growth, composition, and field participation
                            across the guild ledger.
                        </p>
                    </div>
                    <Button asChild variant="outline">
                        <Link href="/heroes">
                            Open hero ledger <ArrowRight />
                        </Link>
                    </Button>
                </header>

                <section className="meridian-panel grid sm:grid-cols-2 xl:grid-cols-4">
                    <Stat
                        label="Total heroes"
                        value={overview.totalHeroes}
                        detail="Canonical records in the ledger"
                    />
                    <Stat
                        label="Verified coverage"
                        value={`${overview.verifiedRate}%`}
                        detail="Records approved as trusted data"
                    />
                    <Stat
                        label="Active in 90 days"
                        value={`${overview.activeRate}%`}
                        detail="Heroes seen in recent guild activity"
                    />
                    <Stat
                        label="Quest participation"
                        value={`${overview.participationRate}%`}
                        detail="Heroes enlisted in at least one quest"
                    />
                </section>

                <section className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
                    <div className="meridian-panel p-6 md:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-display text-2xl font-semibold">
                                    Six-month ledger growth
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    New hero records by calendar month
                                </p>
                            </div>
                            <UsersRound className="size-5 text-primary" />
                        </div>
                        <div className="mt-8 grid h-56 grid-cols-6 items-end gap-3 border-b border-border/70 px-1">
                            {growth.map((month) => (
                                <div
                                    key={month.label}
                                    className="flex h-full flex-col justify-end gap-2"
                                >
                                    <span className="text-center font-mono text-xs text-muted-foreground tabular-nums">
                                        {month.value}
                                    </span>
                                    <div
                                        className="min-h-1 rounded-t-md bg-primary transition-[height]"
                                        style={{
                                            height: `${Math.max(4, (month.value / growthMaximum) * 100)}%`,
                                        }}
                                    />
                                    <span className="pb-3 text-center text-xs text-muted-foreground">
                                        {month.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="meridian-panel p-6 md:p-7">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-display text-2xl font-semibold">
                                    Field activity
                                </h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Quest enlistment signals
                                </p>
                            </div>
                            <Swords className="size-5 text-primary" />
                        </div>
                        <dl className="mt-7 space-y-5">
                            <div className="flex items-baseline justify-between gap-4 border-b border-border/65 pb-4">
                                <dt className="text-sm text-muted-foreground">
                                    Total enlistments
                                </dt>
                                <dd className="font-display text-3xl font-semibold tabular-nums">
                                    {questActivity.totalEnlistments}
                                </dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-4 border-b border-border/65 pb-4">
                                <dt className="text-sm text-muted-foreground">
                                    Muster completion
                                </dt>
                                <dd className="font-display text-3xl font-semibold tabular-nums">
                                    {musteredRate}%
                                </dd>
                            </div>
                            <div className="flex items-baseline justify-between gap-4">
                                <dt className="text-sm text-muted-foreground">
                                    Quests per hero
                                </dt>
                                <dd className="font-display text-3xl font-semibold tabular-nums">
                                    {questActivity.averageQuestsPerHero}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <section className="grid gap-6 lg:grid-cols-2">
                    <div className="meridian-panel p-6 md:p-7">
                        <div className="mb-7 flex items-center justify-between">
                            <h2 className="font-display text-2xl font-semibold">
                                Faction composition
                            </h2>
                            <Gauge className="size-5 text-primary" />
                        </div>
                        <BarList data={factions} />
                    </div>
                    <div className="meridian-panel p-6 md:p-7">
                        <div className="mb-7 flex items-center justify-between">
                            <h2 className="font-display text-2xl font-semibold">
                                Most common callings
                            </h2>
                            <Swords className="size-5 text-primary" />
                        </div>
                        <BarList data={classes} />
                    </div>
                    <div className="meridian-panel p-6 md:p-7">
                        <div className="mb-7 flex items-center justify-between">
                            <h2 className="font-display text-2xl font-semibold">
                                Level distribution
                            </h2>
                            <UsersRound className="size-5 text-primary" />
                        </div>
                        <BarList data={levelBands} />
                    </div>
                    <div className="meridian-panel p-6 md:p-7">
                        <div className="mb-7 flex items-center justify-between">
                            <h2 className="font-display text-2xl font-semibold">
                                Verification status
                            </h2>
                            <CheckCircle2 className="size-5 text-primary" />
                        </div>
                        <BarList data={verification} />
                    </div>
                </section>
            </div>
        </>
    );
}

HeroAnalytics.layout = {
    breadcrumbs: [{ title: 'Hero analytics', href: '/heroes/analytics' }],
};
