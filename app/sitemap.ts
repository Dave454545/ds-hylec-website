import { MetadataRoute } from 'next';
import { SERVICES } from '@/lib/services-data';

const BASE_URL = 'https://dshylec.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const servicePages = SERVICES.map((srv) => ({
    url:             `${BASE_URL}/services/${srv.slug}`,
    lastModified:    new Date(),
    changeFrequency: 'monthly' as const,
    priority:        0.8,
  }));

  return [
    {
      url:             `${BASE_URL}/`,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        1.0,
    },
    {
      url:             `${BASE_URL}/reserver`,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/services`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.8,
    },
    ...servicePages,
    {
      url:             `${BASE_URL}/a-propos`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.7,
    },
    {
      url:             `${BASE_URL}/login`,
      lastModified:    new Date(),
      changeFrequency: 'yearly',
      priority:        0.3,
    },
  ];
}
