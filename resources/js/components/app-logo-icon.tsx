import { Hexagon } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizes = {
    sm: 'size-9 text-lg',
    md: 'size-10 text-xl',
    lg: 'size-12 text-2xl',
};

export default function AppLogoIcon({
    size = 'sm',
    className,
}: {
    size?: keyof typeof sizes;
    className?: string;
}) {
    return (
        <span
            className={cn(
                'relative inline-flex shrink-0 items-center justify-center',
                sizes[size],
                className,
            )}
        >
            <Hexagon
                className="absolute inset-0 size-full"
                strokeWidth={1.25}
            />
            <span className="font-display leading-none font-semibold">M</span>
        </span>
    );
}
