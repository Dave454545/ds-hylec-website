import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXTAUTH_URL ?? 'https://www.dshylec.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:              `${BASE_URL}/`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         1.0,
    },
    {
      url:              `${BASE_URL}/reserver`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.9,
    },
    {
      url:              `${BASE_URL}/a-propos`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.7,
    },
    {
      url:              `${BASE_URL}/login`,
      lastModified:     new Date(),
      changeFrequency:  'yearly',
      priority:         0.3,
    },
  ];
}
