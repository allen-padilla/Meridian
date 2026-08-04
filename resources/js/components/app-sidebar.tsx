import { Link } from '@inertiajs/react';
import {
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
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Guild overview', href: '/dashboard', icon: LayoutDashboard },
    { title: 'Hero ledger', href: '/heroes', icon: UsersRound },
    { title: 'Quest board', href: '/quests', icon: Compass },
];

const recordItems: NavItem[] = [
    { title: 'Hero revisions', href: '/revisions', icon: Sparkles },
    { title: 'Guild archive', href: '/archive', icon: BookOpenText },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
                <div className="mt-5">
                    <NavMain items={recordItems} />
                </div>
                <div className="mx-3 mt-auto rounded-xl border border-[#b8924f]/25 bg-[#b8924f]/8 p-3 text-xs leading-relaxed text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
                    <Shield className="mb-2 size-4 text-[#c6a15b]" />
                    <strong className="block text-sidebar-foreground">
                        Guild ledger secure
                    </strong>
                    Last portal sync completed 8 minutes ago.
                </div>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
