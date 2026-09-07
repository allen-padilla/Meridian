type DateInput = string | Date;

const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
};

const dateTimeOptions: Intl.DateTimeFormatOptions = {
    ...dateOptions,
    hour: 'numeric',
    minute: '2-digit',
};

const dayHeadingOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
};

const relativeUnits: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 365 * 24 * 60 * 60],
    ['month', 30 * 24 * 60 * 60],
    ['week', 7 * 24 * 60 * 60],
    ['day', 24 * 60 * 60],
    ['hour', 60 * 60],
    ['minute', 60],
];

function toDate(value: DateInput): Date {
    return value instanceof Date ? value : new Date(value);
}

export function formatDate(value: DateInput, locale?: string): string {
    return toDate(value).toLocaleDateString(locale, dateOptions);
}

export function formatDateTime(value: DateInput, locale?: string): string {
    return toDate(value).toLocaleString(locale, dateTimeOptions);
}

export function formatDayHeading(value: DateInput, locale?: string): string {
    return toDate(value).toLocaleDateString(locale, dayHeadingOptions);
}

export function formatRelative(
    value: DateInput,
    now: DateInput = new Date(),
    locale?: string,
): string {
    const seconds = Math.round(
        (toDate(value).getTime() - toDate(now).getTime()) / 1000,
    );

    if (Math.abs(seconds) < 60) {
        return 'just now';
    }

    const formatter = new Intl.RelativeTimeFormat(locale, {
        numeric: 'always',
    });

    for (const [unit, size] of relativeUnits) {
        if (Math.abs(seconds) >= size) {
            return formatter.format(Math.round(seconds / size), unit);
        }
    }

    return 'just now';
}

export function greetingFor(value: DateInput = new Date()): string {
    const hour = toDate(value).getHours();

    if (hour < 12) {
        return 'Good morning';
    }

    if (hour < 18) {
        return 'Good afternoon';
    }

    return 'Good evening';
}
