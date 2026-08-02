import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const artigos = await getCollection('artigos');

  return rss({
    title: 'BEG Brasil | Conteúdos Industriais',
    description:
      'Artigos técnicos, guias de engenharia e materiais educativos sobre identificação e sinalização industrial.',
    site: context.site || 'https://begbrasil.com.br',
    items: artigos.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.publishedAt),
      description: post.data.description,
      link: `/conteudos/${post.id}/`,
      author: post.data.author,
    })),
    customData: `<language>pt-br</language>`,
  });
};
