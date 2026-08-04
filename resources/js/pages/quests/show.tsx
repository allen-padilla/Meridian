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
    requirements: string[];
    enlistments: Enlistment[];
};
export default function QuestShow({ quest }: { quest: Quest }) {
    const present = quest.enlistments.filter(
        (e) => e.status === 'present',
    ).length;
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
                    <div className="bg-[#203c31] p-6 text-[#f7efdd] md:p-8">
                        <p className="text-[10px] tracking-[.24em] text-[#d0aa61] uppercase">
                            {quest.difficulty} expedition
                        </p>
                        <h1 className="mt-2 font-display text-4xl font-semibold md:text-5xl">
                            {quest.name}
                        </h1>
                        <p className="mt-3 max-w-3xl text-[#e2d8c3]/75">
                            {quest.summary}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-5 text-sm">
                            <span className="flex items-center gap-2">
                                <CalendarDays className="size-4 text-[#d0aa61]" />
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
                                <MapPin className="size-4 text-[#d0aa61]" />
                                {quest.location}
                            </span>
                            <span className="flex items-center gap-2">
                                <UsersRound className="size-4 text-[#d0aa61]" />
                                {quest.enlistments.length}/{quest.party_limit}{' '}
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
                            <Badge className="bg-emerald-900/10 text-emerald-800 hover:bg-emerald-900/10">
                                {present} in the field
                            </Badge>
                        </div>
                        <div className="divide-y">
                            {quest.enlistments.map((e) => (
                                <Link
                                    href={`/heroes/${e.hero.id}`}
                                    key={e.id}
                                    className="flex items-center gap-4 p-4 hover:bg-[#f4ecda]/60"
                                >
                                    <div className="flex size-10 items-center justify-center rounded-full border border-[#b8924f]/30 bg-[#f5ecd8] font-display">
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
                                        <span className="flex items-center gap-2 text-xs font-medium text-emerald-800">
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
                                <div className="rounded-xl bg-[#315c48]/10 p-2 text-[#315c48]">
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
                                            className="h-11 w-full bg-[#315c48] text-white hover:bg-[#274c3b]"
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
                                <Shield className="size-4 text-[#98753b]" />
                                <h3 className="font-display text-xl font-semibold">
                                    Preparations
                                </h3>
                            </div>
                            <ul className="mt-4 space-y-3">
                                {quest.requirements.map((req) => (
                                    <li
                                        key={req}
                                        className="flex gap-3 text-sm"
                                    >
                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section className="meridian-panel p-5">
                            <div className="flex items-center gap-2 text-sm">
                                <Clock3 className="size-4 text-[#98753b]" />
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
