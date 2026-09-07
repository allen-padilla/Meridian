import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, Compass, QrCode, Sparkles } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { dashboard, login } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;
    const destination = auth.user ? dashboard() : login();

    return (
        <>
            <Head title="Fantasy guild operations" />
            <main className="min-h-screen overflow-hidden bg-ink text-ink-foreground">
                <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_70%_25%,var(--brass)_0,transparent_28%),radial-gradient(circle_at_20%_90%,var(--pine)_0,transparent_25%)] opacity-30" />
                <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-3">
                        <AppLogoIcon size="md" className="text-brass" />
                        <div>
                            <p className="font-display text-xl font-semibold">
                                Meridian
                            </p>
                            <p className="text-[9px] tracking-[.28em] text-brass uppercase">
                                Guild operations
                            </p>
                        </div>
                    </div>
                    <Link
                        href={destination}
                        className="rounded-lg border border-brass/35 px-4 py-2 text-sm transition hover:bg-brass/10"
                    >
                        Sign in
                    </Link>
                </nav>
                <section className="relative mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_.9fr]">
                    <div>
                        <p className="text-xs font-semibold tracking-[.3em] text-brass uppercase">
                            Operations console for guildkeepers
                        </p>
                        <h1 className="mt-5 max-w-3xl font-display text-6xl leading-[.95] font-semibold sm:text-7xl lg:text-8xl">
                            Run the guild.
                            <br />
                            <span className="text-ink-muted italic">
                                Ready the realm.
                            </span>
                        </h1>
                        <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-foreground/70">
                            A trusted operations console for managing heroes,
                            assembling quest parties, reviewing player-submitted
                            changes, and running live rune muster in the field.
                        </p>
                        <Link
                            href={destination}
                            className="mt-9 inline-flex items-center gap-3 rounded-xl bg-brass px-6 py-3 font-semibold text-ink transition hover:bg-brass-soft"
                        >
                            Open Meridian <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute -inset-16 rounded-full border border-brass/10" />
                        <div className="relative grid gap-4 sm:grid-cols-2">
                            <Feature
                                icon={BookOpen}
                                title="Hero ledger"
                                text="Verified records, factions, levels, and field history."
                            />
                            <Feature
                                icon={Compass}
                                title="Quest board"
                                text="Parties, requirements, capacity, and expedition status."
                            />
                            <Feature
                                icon={Sparkles}
                                title="Human review"
                                text="External changes never overwrite trusted data silently."
                            />
                            <Feature
                                icon={QrCode}
                                title="Live muster"
                                text="Fast rune scans toggle heroes in and out of the field."
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
function Feature({
    icon: Icon,
    title,
    text,
}: {
    icon: typeof BookOpen;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-2xl border border-brass/20 bg-ink-foreground/6 p-6 backdrop-blur">
            <Icon className="size-6 text-brass" />
            <h2 className="mt-6 font-display text-2xl font-semibold">
                {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-foreground/60">
                {text}
            </p>
        </div>
    );
}
