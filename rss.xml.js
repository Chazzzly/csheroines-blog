import rss from '@astrojs/rss';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(context) {
  const blogDir = path.resolve('./src/pages/blog');

  const files = fs
    .readdirSync(blogDir)
    .filter(file => file.endsWith('.md'));

  const posts = files.map(file => {
    const filePath = path.join(blogDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);

    return {
      title: data.title,
      pubDate: new Date(data.pubDate),
      description: data.description,
      link: `/blog/${file.replace('.md', '')}`,
    };
  });

  return rss({
    title: 'CS Heroines',
    description: 'News & inspiration for women in CS',
    site: context.site ?? 'http://localhost:4321',
    items: posts,
  });
}
