import { Head, Link } from '@inertiajs/react';
import { ArrowRight, CalendarDays, MapPin, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
type Quest = {
    id: number;
    name: string;
    summary: string;
    location: string;
    difficulty: string;
    status: string;
    starts_at: string;
    party_limit: number;
    enlistments_count: number;
};
const difficultyTone: Record<string, { stripe: string; badge: string }> = {
    legendary: {
        stripe: 'bg-crimson',
        badge: 'border-crimson/40 text-crimson',
    },
    epic: {
        stripe: 'bg-brass-deep',
        badge: 'border-brass-deep/40 text-brass-deep',
    },
    standard: { stripe: 'bg-primary', badge: 'border-pine/40 text-pine' },
};
export default function QuestsIndex({ quests }: { quests: Quest[] }) {
    return (
        <>
            <Head title="Quest board" />
            <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
                <header>
                    <p className="eyebrow">Expeditions & trials</p>
                    <h1 className="mt-1 font-display text-4xl font-semibold">
                        Quest board
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Prepare parties, review requirements, and run field
                        muster.
                    </p>
                </header>
                <div className="mt-7 grid gap-5 md:grid-cols-2">
                    {quests.map((quest) => {
                        const tone =
                            difficultyTone[quest.difficulty] ??
                            difficultyTone.standard;

                        return (
                            <Link
                                key={quest.id}
                                href={`/quests/${quest.id}`}
                                className="meridian-panel group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                <div className={`h-1.5 ${tone.stripe}`} />
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <Badge
                                                variant="outline"
                                                className={`mb-3 capitalize ${tone.badge}`}
                                            >
                                                {quest.difficulty}
                                            </Badge>
                                            <h2 className="font-display text-2xl font-semibold group-hover:text-pine">
                                                {quest.name}
                                            </h2>
                                        </div>
                                        <ArrowRight className="mt-2 size-5 text-muted-foreground transition group-hover:translate-x-1" />
                                    </div>
                                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                                        {quest.summary}
                                    </p>
                                    <div className="mt-6 grid gap-3 border-t pt-4 text-sm sm:grid-cols-3">
                                        <span className="flex items-center gap-2">
                                            <CalendarDays className="size-4 text-brass-deep" />
                                            {formatDate(quest.starts_at)}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <MapPin className="size-4 text-brass-deep" />
                                            {quest.location}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <UsersRound className="size-4 text-brass-deep" />
                                            {quest.enlistments_count}/
                                            {quest.party_limit}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
QuestsIndex.layout = {
    breadcrumbs: [{ title: 'Quest board', href: '/quests' }],
};
