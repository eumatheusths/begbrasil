import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const produtosCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/produtos' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    shortDescription: z.string(),
    applications: z.array(z.string()).default([]),
    materials: z.array(z.string()).default([]),
    finishes: z.array(z.string()).default([]),
    dimensions: z.array(z.string()).default([]),
    fixationMethods: z.array(z.string()).default([]),
    variableData: z.boolean().default(false),
    supportsQRCode: z.boolean().default(false),
    supportsBarcode: z.boolean().default(false),
    supportsSequentialNumbering: z.boolean().default(false),
    minimumQuantity: z.string().nullable().optional(),
    leadTime: z.string().nullable().optional(),
    images: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).default([]),
    status: z.enum(['active', 'draft', 'archived']).default('active'),
    lastReviewedAt: z.string().optional()
  })
});

const artigosCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artigos' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    cluster: z.string(),
    author: z.string(),
    reviewer: z.string().optional(),
    publishedAt: z.string(),
    updatedAt: z.string(),
    relatedProducts: z.array(z.string()).default([]),
    image: z.string().optional()
  })
});

export const collections = {
  produtos: produtosCollection,
  artigos: artigosCollection
};
