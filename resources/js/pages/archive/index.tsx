import { Head, Link } from '@inertiajs/react';
import {
    Archive,
    ArrowRight,
    BookOpenText,
    Compass,
    Download,
    ScrollText,
    UsersRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type RecordItem = {
    id: number;
    status: string;
    updated_at: string;
    hero: { id: number; name: string; hero_code: string };
    quest: { id: number; name: string; location: string; starts_at: string };
};
export default function ArchiveIndex({
    counts,
    records,
}: {
    counts: { heroes: number; quests: number; fieldRecords: number };
    records: RecordItem[];
}) {
    return (
        <>
            <Head title="Guild archive" />
            <div className="mx-auto w-full max-w-7xl space-y-7 p-4 md:p-8">
                <header>
                    <p className="eyebrow">Historical record</p>
                    <h1 className="mt-1 font-display text-4xl font-semibold">
                        Guild archive
                    </h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground">
                        The durable record of heroes, expeditions, and field
                        participation held by Meridian.
                    </p>
                </header>
                <section className="grid gap-4 md:grid-cols-3">
                    <ArchiveMetric
                        icon={UsersRound}
                        value={counts.heroes}
                        label="Hero records"
                    />
                    <ArchiveMetric
                        icon={Compass}
                        value={counts.quests}
                        label="Quest records"
                    />
                    <ArchiveMetric
                        icon={ScrollText}
                        value={counts.fieldRecords}
                        label="Field records"
                    />
                </section>
                <section className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
                    <div className="meridian-panel overflow-hidden">
                        <div className="border-b p-5">
                            <p className="eyebrow">Chronicle</p>
                            <h2 className="mt-1 font-display text-2xl font-semibold">
                                Recent field records
                            </h2>
                        </div>
                        <div className="divide-y">
                            {records.map((record) => (
                                <div
                                    key={record.id}
                                    className="grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center"
                                >
                                    <div>
                                        <Link
                                            href={`/heroes/${record.hero.id}`}
                                            className="font-medium hover:text-pine"
                                        >
                                            {record.hero.name}
                                        </Link>
                                        <p className="text-xs text-muted-foreground">
                                            {record.hero.hero_code}
                                        </p>
                                    </div>
                                    <div>
                                        <Link
                                            href={`/quests/${record.quest.id}`}
                                            className="text-sm hover:text-pine"
                                        >
                                            {record.quest.name}
                                        </Link>
                                        <p className="text-xs text-muted-foreground">
                                            {record.quest.location}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="w-fit capitalize"
                                    >
                                        {record.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                    <aside className="space-y-5">
                        <div className="meridian-panel p-5">
                            <BookOpenText className="size-5 text-brass-deep" />
                            <h2 className="mt-4 font-display text-2xl font-semibold">
                                Ledger export
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                Prepare a portable copy of the guild's canonical
                                records for safekeeping.
                            </p>
                            <Button
                                className="mt-5 w-full"
                                variant="outline"
                                disabled
                            >
                                <Download />
                                Export coming next
                            </Button>
                        </div>
                        <div className="meridian-panel p-5">
                            <Archive className="size-5 text-brass-deep" />
                            <h2 className="mt-4 font-display text-xl font-semibold">
                                Browse live records
                            </h2>
                            <div className="mt-4 space-y-2">
                                <Link
                                    href="/heroes"
                                    className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-secondary/60"
                                >
                                    Hero ledger{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                                <Link
                                    href="/quests"
                                    className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-secondary/60"
                                >
                                    Quest board{' '}
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </>
    );
}
function ArchiveMetric({
    icon: Icon,
    value,
    label,
}: {
    icon: typeof Archive;
    value: number;
    label: string;
}) {
    return (
        <div className="meridian-panel flex items-center gap-4 p-5">
            <div className="rounded-xl bg-pine/10 p-3 text-pine">
                <Icon className="size-5" />
            </div>
            <div>
                <p className="font-display text-3xl font-semibold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
            </div>
        </div>
    );
}
ArchiveIndex.layout = {
    breadcrumbs: [{ title: 'Guild archive', href: '/archive' }],
};
