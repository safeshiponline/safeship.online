import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/admin/', '/checkout-test/', '/courier/', '/track/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'OAI-SearchBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai'
        ],
        allow: ['/', '/llms.txt', '/llms-full.txt'],
        disallow: ['/api/', '/admin/', '/checkout-test/', '/courier/', '/track/'],
      }
    ],
    sitemap: [
      'https://safeship.online/sitemap.xml',
      'https://safeship.online/in/sitemap.xml'
    ],
    host: 'https://safeship.online',
  };
}
