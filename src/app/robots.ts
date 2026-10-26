import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/in',
          '/llms.txt',
          '/llms-full.txt',
          '/.well-known/security.txt',
          '/.well-known/trust.txt',
          '/security.txt',
        ],
        disallow: ['/api/', '/admin/', '/checkout-test/', '/courier/'],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'DuckDuckBot',
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'Meta-ExternalAgent',
          'cohere-ai',
        ],
        allow: [
          '/',
          '/in',
          '/llms.txt',
          '/llms-full.txt',
          '/.well-known/security.txt',
          '/.well-known/trust.txt',
          '/security.txt',
        ],
        disallow: ['/api/', '/admin/', '/checkout-test/', '/courier/'],
      },
    ],
    sitemap: [
      'https://safeship.online/sitemap.xml',
      'https://safeship.online/in/sitemap.xml',
    ],
    host: 'https://safeship.online',
  };
}
