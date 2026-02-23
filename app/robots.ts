import type { MetadataRoute } from 'next';
import { APP_CONFIG } from '@/lib/constants';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || APP_CONFIG.website;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/app/', '/onboarding/', '/api/'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
