import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    MapPin,
    QrCode,
    Shield,
    UsersRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
type Hero = {
    id: number;
    hero_code: string;
    name: string;
    class: string;
    level: number;
    faction: string;
};
type Enlistment = {
    id: number;
    status: string;
    mustered_at?: string;
    hero: Hero;
};
type Quest = {
    id: number;
    name: string;
    summary: string;
    location: string;
    difficulty: string;
    starts_at: string;
    party_limit: number;
    requirements: string[] | null;
    enlistments: Enlistment[];
};
export default function QuestShow({ quest }: { quest: Quest }) {
    const enlistments = Array.isArray(quest.enlistments)
        ? quest.enlistments
        : [];
    const requirements = Array.isArray(quest.requirements)
        ? quest.requirements
        : [];
    const present = enlistments.filter((e) => e.status === 'present').length;

    return (
        <>
            <Head title={quest.name} />
            <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
                <Link
                    href="/quests"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Return to quest board
                </Link>
                <header className="meridian-panel overflow-hidden">
                    <div className="bg-ink p-6 text-ink-foreground md:p-8">
                        <p className="text-[10px] tracking-[.24em] text-brass uppercase">
                            {quest.difficulty} expedition
                        </p>
                        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
                            {quest.name}
                        </h1>
                        <p className="mt-3 max-w-3xl text-ink-foreground/75">
                            {quest.summary}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-5 text-sm">
                            <span className="flex items-center gap-2">
                                <CalendarDays className="size-4 text-brass" />
                                {new Date(quest.starts_at).toLocaleString(
                                    undefined,
                                    {
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    },
                                )}
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin className="size-4 text-brass" />
                                {quest.location}
                            </span>
                            <span className="flex items-center gap-2">
                                <UsersRound className="size-4 text-brass" />
                                {enlistments.length}/{quest.party_limit}{' '}
                                enlisted
                            </span>
                        </div>
                    </div>
                </header>
                <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_.7fr]">
                    <section className="meridian-panel overflow-hidden">
                        <div className="flex items-center justify-between border-b p-5">
                            <div>
                                <p className="eyebrow">Party manifest</p>
                                <h2 className="mt-1 font-display text-2xl font-semibold">
                                    Assembled heroes
                                </h2>
                            </div>
                            <Badge className="bg-pine/10 text-pine hover:bg-pine/10">
                                {present} in the field
                            </Badge>
                        </div>
                        <div className="divide-y">
                            {enlistments.map((e) => (
                                <Link
                                    href={`/heroes/${e.hero.id}`}
                                    key={e.id}
                                    className="flex items-center gap-4 p-4 hover:bg-secondary/60"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-full border border-brass/30 bg-parchment font-display text-parchment-foreground">
                                        {e.hero.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium">
                                            {e.hero.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {e.hero.hero_code} · Level{' '}
                                            {e.hero.level} {e.hero.class}
                                        </p>
                                    </div>
                                    {e.status === 'present' ? (
                                        <span className="flex items-center gap-2 text-xs font-medium text-pine">
                                            <CheckCircle2 className="size-4" />
                                            Present
                                        </span>
                                    ) : (
                                        <Badge variant="outline">
                                            {e.status}
                                        </Badge>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </section>
                    <aside className="space-y-6">
                        <section className="meridian-panel p-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-pine/10 p-2 text-pine">
                                    <QrCode className="size-5" />
                                </div>
                                <div>
                                    <p className="eyebrow">Live field tool</p>
                                    <h2 className="font-display text-2xl font-semibold">
                                        Rune muster
                                    </h2>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                                Scan or enter a hero code. A second scan marks
                                their departure.
                            </p>
                            <Form
                                action={`/quests/${quest.id}/muster`}
                                method="post"
                                resetOnSuccess
                                className="mt-5 space-y-3"
                            >
                                {({ errors, processing }) => (
                                    <>
                                        <Input
                                            name="hero_code"
                                            placeholder="M-0142"
                                            className="h-12 text-center font-mono tracking-[.2em]"
                                            autoComplete="off"
                                        />
                                        <Button
                                            disabled={processing}
                                            className="h-11 w-full"
                                        >
                                            <QrCode />
                                            Record rune
                                        </Button>
                                        {errors.hero_code && (
                                            <p className="text-sm text-destructive">
                                                {errors.hero_code}
                                            </p>
                                        )}
                                    </>
                                )}
                            </Form>
                        </section>
                        <section className="meridian-panel p-5">
                            <div className="flex items-center gap-2">
                                <Shield className="size-4 text-brass-deep" />
                                <h3 className="font-display text-xl font-semibold">
                                    Preparations
                                </h3>
                            </div>
                            <ul className="mt-4 space-y-3">
                                {requirements.map((req) => (
                                    <li
                                        key={req}
                                        className="flex gap-3 text-sm"
                                    >
                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-pine" />
                                        {req}
                                    </li>
                                ))}
                                {requirements.length === 0 && (
                                    <li className="text-sm text-muted-foreground">
                                        No special preparations recorded.
                                    </li>
                                )}
                            </ul>
                        </section>
                        <section className="meridian-panel p-5">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock3 className="size-4 text-brass-deep" />
                                <span>
                                    Live ledger refreshes after every muster.
                                </span>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </>
    );
}
QuestShow.layout = {
    breadcrumbs: [
        { title: 'Quest board', href: '/quests' },
        { title: 'Quest detail', href: '#' },
    ],
};
