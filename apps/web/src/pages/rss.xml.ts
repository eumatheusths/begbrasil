import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: unknown) {
  const conteudos = await getCollection('conteudos');

  return rss({
    title: 'BEG Brasil | Conteúdos Industriais',
    description:
      'Artigos técnicos, guias de engenharia e materiais educativos sobre identificação e sinalização industrial.',
    site: context.site || 'https://begbrasil.com.br',
    items: conteudos.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.publishedAt),
      description: post.data.description,
      link: `/conteudos/${post.id}/`,
      author: post.data.author,
    })),
    customData: `<language>pt-br</language>`,
  });
}
