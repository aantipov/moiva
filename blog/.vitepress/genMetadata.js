// @ts-check
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const readingTime = require('reading-time');
let n = 1;

function getPost(file, postDir) {
  const fullpath = path.join(postDir, file) + '/index.md';

  const src = fs.readFileSync(fullpath, 'utf-8');
  const stats = readingTime(src);
  const { data } = matter(src);
  const post = {
    title: data.title,
    href: `/${file.replace(/\.md$/, '.html')}/`,
    date: formatDate(data.date),
    summary: data.summary,
    readTime: stats.text,
  };

  console.log('getPost', post);
  return post;
}

function getPosts() {
  const postDir = path.resolve(__dirname, '..');
  return fs
    .readdirSync(postDir)
    .filter((file) => file !== '.vitepress' && file !== 'index.md')
    .map((file) => getPost(file, postDir))
    .sort((a, b) => b.date.time - a.date.time);
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

function genMetadata() {
  fs.writeFileSync(
    path.resolve(__dirname, 'metadata.json'),
    JSON.stringify(getPosts())
  );
}

genMetadata();
