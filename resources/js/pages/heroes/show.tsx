import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle2,
    Clock3,
    Mail,
    MapPin,
    Shield,
    Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import VerificationBadge, {
    verificationLabel,
} from '@/components/verification-badge';
import { formatDate } from '@/lib/format';

type Revision = {
    id: number;
    source: string;
    status: string;
    created_at: string;
    changed_fields: Record<string, { active: string; submitted: string }>;
};
type Enlistment = {
    id: number;
    status: string;
    quest: { id: number; name: string; starts_at: string; location: string };
};
type Hero = {
    id: number;
    hero_code: string;
    name: string;
    epithet?: string;
    email: string;
    ancestry: string;
    class: string;
    level: number;
    home_realm: string;
    faction: string;
    verification_status: string;
    standing_status: string;
    guild_crest_issued: boolean;
    revisions: Revision[];
    enlistments: Enlistment[];
};
export default function HeroShow({ hero }: { hero: Hero }) {
    const pending = hero.revisions.filter((r) => r.status === 'pending');

    return (
        <>
            <Head title={hero.name} />
            <div className="mx-auto w-full max-w-6xl p-4 md:p-8">
                <Link
                    href="/heroes"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Return to ledger
                </Link>
                <div className="meridian-panel overflow-hidden">
                    <div className="bg-ink p-6 text-ink-foreground md:p-8">
                        <p className="text-[10px] tracking-[.24em] text-brass uppercase">
                            {hero.hero_code}
                        </p>
                        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
                            {hero.name}
                        </h1>
                        {hero.epithet && (
                            <p className="mt-1 font-display text-xl text-ink-muted italic">
                                {hero.epithet}
                            </p>
                        )}
                        <div className="mt-5 flex flex-wrap gap-2">
                            <Badge className="bg-primary text-primary-foreground">
                                Level {hero.level} {hero.class}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="border-brass/50 text-ink-muted"
                            >
                                {hero.faction}
                            </Badge>
                            <VerificationBadge
                                status={hero.verification_status}
                                className="border-brass/50 bg-transparent text-ink-muted"
                            />
                        </div>
                    </div>
                    <div className="grid divide-y lg:grid-cols-[1fr_1.4fr] lg:divide-x lg:divide-y-0">
                        <section className="p-6 md:p-8">
                            <p className="eyebrow">Guild record</p>
                            <div className="mt-5 space-y-5 text-sm">
                                <div className="flex gap-3">
                                    <Shield className="size-4 text-brass-deep" />
                                    <div>
                                        <p className="font-medium">
                                            {verificationLabel(
                                                hero.verification_status,
                                            )}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Standing {hero.standing_status}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <BookOpen className="size-4 text-brass-deep" />
                                    <div>
                                        <p className="font-medium">
                                            {hero.ancestry}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Ancestry
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <MapPin className="size-4 text-brass-deep" />
                                    <div>
                                        <p className="font-medium">
                                            {hero.home_realm}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Home realm
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <Mail className="size-4 text-brass-deep" />
                                    <div>
                                        <p className="font-medium">
                                            {hero.email}
                                        </p>
                                        <p className="text-muted-foreground">
                                            Player contact
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="p-6 md:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="eyebrow">Review queue</p>
                                    <h2 className="mt-1 font-display text-2xl font-semibold">
                                        Hero revisions
                                    </h2>
                                </div>
                                <Sparkles className="size-5 text-brass-deep" />
                            </div>
                            {pending.length ? (
                                pending.map((revision) => (
                                    <div
                                        key={revision.id}
                                        className="mt-5 rounded-xl border border-brass-deep/25 bg-brass/10 p-4"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                From{' '}
                                                {revision.source.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </span>
                                            <Badge
                                                variant="outline"
                                                className="border-brass-deep/40 text-brass-deep"
                                            >
                                                Needs judgment
                                            </Badge>
                                        </div>
                                        {Object.entries(
                                            revision.changed_fields,
                                        ).map(([field, change]) => (
                                            <div
                                                key={field}
                                                className="grid gap-2 border-t py-3 text-sm sm:grid-cols-[1fr_1fr_auto]"
                                            >
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Current {field}
                                                    </p>
                                                    <p>{change.active}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Proposed
                                                    </p>
                                                    <p className="font-medium text-pine">
                                                        {change.submitted}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled
                                                >
                                                    Accept
                                                </Button>
                                            </div>
                                        ))}
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Approval isn't wired up yet.
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="mt-6 flex items-center gap-3 rounded-xl bg-pine/8 p-4 text-sm text-pine">
                                    <CheckCircle2 className="size-5" />
                                    No pending revisions. This record is in
                                    harmony.
                                </div>
                            )}
                        </section>
                    </div>
                </div>
                <section className="meridian-panel mt-6 p-6">
                    <div className="flex items-center gap-3">
                        <Clock3 className="size-5 text-brass-deep" />
                        <div>
                            <p className="eyebrow">Field history</p>
                            <h2 className="font-display text-2xl font-semibold">
                                Quest record
                            </h2>
                        </div>
                    </div>
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        {hero.enlistments.map((e) => (
                            <Link
                                key={e.id}
                                href={`/quests/${e.quest.id}`}
                                className="rounded-xl border p-4 hover:bg-secondary/60"
                            >
                                <p className="font-medium">{e.quest.name}</p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {formatDate(e.quest.starts_at)} ·{' '}
                                    {e.quest.location}
                                </p>
                            </Link>
                        ))}
                        {hero.enlistments.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No quests on record.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}
HeroShow.layout = {
    breadcrumbs: [
        { title: 'Hero ledger', href: '/heroes' },
        { title: 'Hero record', href: '#' },
    ],
};
