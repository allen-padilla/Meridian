import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    Clock3,
    GitCompareArrows,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Revision = {
    id: number;
    source: string;
    status: string;
    created_at: string;
    changed_fields: Record<
        string,
        { active: string | number; submitted: string | number }
    >;
    hero: { id: number; name: string; hero_code: string; class: string };
};

export default function RevisionsIndex({
    revisions,
}: {
    revisions: Revision[];
}) {
    const pending = revisions.filter(
        (revision) => revision.status === 'pending',
    );
    const reviewed = revisions.filter(
        (revision) => revision.status !== 'pending',
    );

    return (
        <>
            <Head title="Hero revisions" />
            <div className="mx-auto w-full max-w-6xl space-y-7 p-4 md:p-8">
                <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <p className="eyebrow">Review queue</p>
                        <h1 className="mt-1 font-display text-4xl font-semibold">
                            Hero revisions
                        </h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground">
                            Judge changes submitted by players and imports
                            before they alter the trusted ledger.
                        </p>
                    </div>
                    <Badge className="w-fit bg-brass-deep/10 text-brass-deep hover:bg-brass-deep/10">
                        {pending.length} awaiting judgment
                    </Badge>
                </header>
                <section className="space-y-4">
                    {pending.length ? (
                        pending.map((revision) => (
                            <article
                                key={revision.id}
                                className="meridian-panel overflow-hidden"
                            >
                                <div className="flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-xl bg-brass-deep/10 p-3 text-brass-deep">
                                            <Sparkles className="size-5" />
                                        </div>
                                        <div>
                                            <Link
                                                href={`/heroes/${revision.hero.id}`}
                                                className="font-display text-2xl font-semibold hover:text-pine"
                                            >
                                                {revision.hero.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground">
                                                {revision.hero.hero_code} ·
                                                Submitted via{' '}
                                                {revision.source.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Clock3 className="size-4" />
                                        {new Date(
                                            revision.created_at,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="divide-y px-5">
                                    {Object.entries(
                                        revision.changed_fields,
                                    ).map(([field, change]) => (
                                        <div
                                            key={field}
                                            className="grid gap-4 py-4 sm:grid-cols-[.8fr_1fr_auto_1fr]"
                                        >
                                            <p className="text-sm font-medium capitalize">
                                                {field.replace('_', ' ')}
                                            </p>
                                            <div>
                                                <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
                                                    Ledger
                                                </p>
                                                <p className="mt-1 text-sm">
                                                    {change.active}
                                                </p>
                                            </div>
                                            <GitCompareArrows className="hidden size-4 self-center text-brass-deep sm:block" />
                                            <div>
                                                <p className="text-[10px] tracking-wider text-muted-foreground uppercase">
                                                    Proposed
                                                </p>
                                                <p className="mt-1 text-sm font-medium text-pine">
                                                    {change.submitted}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end border-t bg-secondary/35 p-4">
                                    <Button asChild variant="outline">
                                        <Link
                                            href={`/heroes/${revision.hero.id}`}
                                        >
                                            Review record <ArrowRight />
                                        </Link>
                                    </Button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="meridian-panel flex items-center gap-4 p-6 text-pine">
                            <CheckCircle2 className="size-6" />
                            <div>
                                <p className="font-medium">
                                    The ledger is in harmony.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    No hero changes await review.
                                </p>
                            </div>
                        </div>
                    )}
                </section>
                {reviewed.length > 0 && (
                    <section>
                        <p className="eyebrow mb-3">Recently resolved</p>
                        <div className="meridian-panel divide-y">
                            {reviewed.map((revision) => (
                                <Link
                                    href={`/heroes/${revision.hero.id}`}
                                    key={revision.id}
                                    className="flex items-center justify-between p-4 hover:bg-secondary/50"
                                >
                                    <span>{revision.hero.name}</span>
                                    <Badge variant="outline">Reviewed</Badge>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </>
    );
}
RevisionsIndex.layout = {
    breadcrumbs: [{ title: 'Hero revisions', href: '/revisions' }],
};
