import { getBaseUrl } from '@/utils/urls'
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getBaseUrl(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
