import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <AppLogoIcon className="text-brass" />
            <div className="ml-1 grid flex-1 text-left">
                <span className="truncate font-display text-base font-semibold tracking-wide">
                    Meridian
                </span>
                <span className="truncate text-[10px] tracking-[.22em] text-sidebar-foreground/50 uppercase">
                    Guild operations
                </span>
            </div>
        </>
    );
}
