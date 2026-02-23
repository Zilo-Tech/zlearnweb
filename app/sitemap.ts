import type { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || APP_CONFIG.website;

/**
 * Static and public routes to include in the sitemap.
 * Auth, app dashboard, and dynamic course/community routes are excluded
 * (behind login or low SEO value / duplicate content risk).
 */
const staticRoutes: { path: string; changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/auth/login', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/auth/register', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/auth/forgot-password', changeFrequency: 'yearly', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return staticRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
