import { getBaseUrl } from '@/utils/urls'

export async function GET() {
  const url = getBaseUrl()
  return new Response(`User-agent: *
Allow: /
Sitemap: ${url}/sitemap.xml`)
}
