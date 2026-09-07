import { Link, usePage } from '@inertiajs/react';
import {
    ChartNoAxesCombined,
    BookOpenText,
    Compass,
    LayoutDashboard,
    Shield,
    Sparkles,
    UsersRound,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { formatRelative } from '@/lib/format';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Guild overview', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Hero ledger', href: '/heroes', icon: UsersRound },
    { title: 'Quest board', href: '/quests', icon: Compass },
];

const recordItems: NavItem[] = [
    {
        title: 'Hero analytics',
        href: '/heroes/analytics',
        icon: ChartNoAxesCombined,
    },
    { title: 'Hero revisions', href: '/revisions', icon: Sparkles },
    { title: 'Guild archive', href: '/archive', icon: BookOpenText },
];

export function AppSidebar() {
    const { ledger } = usePage().props;
    const revisionCount = ledger?.pendingRevisions ?? 0;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="border-b border-sidebar-border/70 pb-3">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent className="pt-4">
                <NavMain items={mainNavItems} label="Command" />
                <div className="mt-5">
                    <NavMain items={recordItems} label="Records" />
                </div>
                <div className="mx-3 mt-auto border-l border-sidebar-primary/45 py-1 pl-3 text-xs leading-relaxed text-sidebar-foreground/55 group-data-[collapsible=icon]:hidden">
                    <div className="flex items-center gap-2 text-sidebar-foreground/85">
                        <Shield className="size-3.5 text-sidebar-primary" />
                        <strong className="font-medium">Ledger status</strong>
                    </div>
                    <p className="mt-1">
                        {ledger?.lastMusterAt
                            ? `Last muster ${formatRelative(ledger.lastMusterAt)}.`
                            : 'No musters recorded yet.'}{' '}
                        {revisionCount}{' '}
                        {revisionCount === 1 ? 'revision' : 'revisions'}{' '}
                        awaiting review.
                    </p>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
