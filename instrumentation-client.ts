import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (token) {
    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com',
      defaults: '2026-01-30',
      person_profiles: 'identified_only',
    });
  }
}
