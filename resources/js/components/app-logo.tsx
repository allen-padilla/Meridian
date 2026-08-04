import { Hexagon } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="relative flex size-9 items-center justify-center text-[#d0aa61]">
                <Hexagon className="absolute size-9" strokeWidth={1.25} />
                <span className="font-display text-lg font-semibold">M</span>
            </div>
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
