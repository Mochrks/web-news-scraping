import { faker } from '@faker-js/faker';

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  topics: string[];
  image: string;
  date: string;
  author: string;
  videoUrl?: string;
}

const categories = ['Politics', 'Technology', 'Sports', 'Entertainment'];
const topics = [
  'World', 'Local', 'Economy', 'Science', 'Health', 'Environment', 
  'Culture', 'Education', 'Innovation', 'Lifestyle', 'Opinion'
];

export function generateMockNews(count: number): NewsItem[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    excerpt: faker.lorem.paragraph(),
    content: faker.lorem.paragraphs(5),
    category: faker.helpers.arrayElement(categories),
    topics: faker.helpers.arrayElements(topics, { min: 1, max: 3 }),
    image: faker.image.url(),
    date: faker.date.recent().toISOString(),
    author: faker.person.fullName(),
    videoUrl: Math.random() > 0.7 ? faker.internet.url() : undefined,
  }));
}

export const allNews = generateMockNews(400);

export const newsByCategory = categories.reduce((acc, category) => {
  acc[category] = allNews.filter(item => item.category === category);
  return acc;
}, {} as Record<string, NewsItem[]>);

export const trendingNews = faker.helpers.arrayElements(allNews, { min: 5, max: 10 });

