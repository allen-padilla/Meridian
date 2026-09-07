import { describe, expect, it } from 'vitest';
import {
    formatDate,
    formatDateTime,
    formatDayHeading,
    formatRelative,
    greetingFor,
} from './format';

// Local-time constructors keep the expected strings stable in any timezone.
const morning = new Date(2026, 8, 10, 10, 19);

describe('formatDate', () => {
    it('formats a Date with a short month and the year', () => {
        expect(formatDate(morning, 'en-US')).toBe('Sep 10, 2026');
    });

    it('accepts an ISO string', () => {
        expect(formatDate(morning.toISOString(), 'en-US')).toBe('Sep 10, 2026');
    });
});

describe('formatDateTime', () => {
    it('adds the time to the date format', () => {
        expect(formatDateTime(morning, 'en-US')).toBe('Sep 10, 2026, 10:19 AM');
    });
});

describe('formatDayHeading', () => {
    it('spells out the weekday and month', () => {
        expect(formatDayHeading(morning, 'en-US')).toBe(
            'Thursday, September 10',
        );
    });
});

describe('formatRelative', () => {
    const now = new Date(2026, 8, 10, 12, 0, 0);

    it('reports the past in the largest whole unit', () => {
        expect(
            formatRelative(new Date(2026, 8, 10, 11, 46), now, 'en-US'),
        ).toBe('14 minutes ago');
        expect(formatRelative(new Date(2026, 8, 10, 9, 30), now, 'en-US')).toBe(
            '2 hours ago',
        );
        expect(formatRelative(new Date(2026, 7, 10), now, 'en-US')).toBe(
            '1 month ago',
        );
    });

    it('reports the future', () => {
        expect(formatRelative(new Date(2026, 8, 13, 12), now, 'en-US')).toBe(
            'in 3 days',
        );
    });

    it('treats anything under a minute as just now', () => {
        expect(formatRelative(new Date(2026, 8, 10, 11, 59, 30), now)).toBe(
            'just now',
        );
    });
});

describe('greetingFor', () => {
    it('changes with the hour', () => {
        expect(greetingFor(new Date(2026, 0, 1, 9))).toBe('Good morning');
        expect(greetingFor(new Date(2026, 0, 1, 13))).toBe('Good afternoon');
        expect(greetingFor(new Date(2026, 0, 1, 20))).toBe('Good evening');
    });
});
