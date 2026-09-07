import { CheckCircle2, Clock3, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const tones: Record<
    string,
    { label: string; icon: typeof CheckCircle2; className: string }
> = {
    verified: {
        label: 'Verified',
        icon: CheckCircle2,
        className: 'border-pine/30 bg-pine/10 text-pine',
    },
    pending_review: {
        label: 'Pending review',
        icon: Clock3,
        className: 'border-brass-deep/35 bg-brass/10 text-brass-deep',
    },
    unverified: {
        label: 'Unverified',
        icon: ShieldAlert,
        className: 'border-border text-muted-foreground',
    },
};

export function verificationLabel(status: string): string {
    return tones[status]?.label ?? status.replace('_', ' ');
}

export default function VerificationBadge({
    status,
    className,
}: {
    status: string;
    className?: string;
}) {
    const tone = tones[status] ?? tones.unverified;
    const Icon = tone.icon;

    return (
        <Badge variant="outline" className={cn(tone.className, className)}>
            <Icon />
            {verificationLabel(status)}
        </Badge>
    );
}
