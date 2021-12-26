const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const readingTime = require('reading-time');

module.exports = {
  watch: '../**/*.md',
  load() {
    const postDir = path.resolve(__dirname, '..');
    return fs
      .readdirSync(postDir)
      .filter(
        (file) =>
          file !== '.vitepress' && file !== 'index.md' && file !== '.DS_Store'
      )
      .map((file) => getPost(file, postDir))
      .sort((a, b) => b.date.time - a.date.time);
  },
};

const cache = new Map();

function getPost(file, postDir) {
  const fullPath = path.join(postDir, file) + '/index.md';
  const timestamp = fs.statSync(fullPath).mtimeMs;

  const cached = cache.get(fullPath);
  if (cached && timestamp === cached.timestamp) {
    return cached.post;
  }

  const src = fs.readFileSync(fullPath, 'utf-8');
  const stats = readingTime(src);
  const { data } = matter(src);
  const post = {
    title: data.title,
    href: `/${file.replace(/\.md$/, '.html')}/`,
    date: formatDate(data.date),
    summary: data.summary,
    readTime: stats.text,
    hidden: !!data.hidden,
  };

  cache.set(fullPath, {
    timestamp,
    post,
  });
  return post;
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  date.setUTCHours(12);
  return {
    time: +date,
    string: date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}
