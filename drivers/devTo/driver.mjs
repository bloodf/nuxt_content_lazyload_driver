import { defineDriver } from 'unstorage';

const fetchArticles = async (opts) => {
  const articles = {};
  const data = await $fetch(
    `https://dev.to/api/organizations/${opts.organization}/articles`,
    {
      method: 'GET',
      params: {
        page: 1,
        per_page: opts.articlesSize || 10,
      },
      responseType: 'json',
    },
  );

  [...data].forEach((article) => {
    const key = `${article.id}.json`;
    articles[key] = {
      ...article,
      meta: {
        title: article.title,
        publishedAt: article.published_at,
        tags: article.tags,
        author: article.user,
        description: article.description,
      }
    }
  });

  return articles;
}

export default defineDriver((opts) => {
  let articles = {}
  let lastCheck = 0
  let syncPromise;

  const syncArticles = async () => {
    if ((lastCheck + opts.ttl * 1000) > Date.now()) {
      return
    }

    if (!syncPromise) {
      syncPromise = fetchArticles(opts);
    }

    articles = await syncPromise;
    lastCheck = Date.now();
    syncPromise = undefined;
  }

  return {
    getItem: async (key) => {
      const data = await $fetch(`https://dev.to/api/articles/${key}`, {
        method: 'GET',
        responseType: 'json',
      });

      return data.body_markdown;
    },
    async hasItem(key) {
      await syncArticles();
      return key in articles;
    },
    async setItem(key, value) {
    },
    async removeItem(key) {
    },
    async getMeta(key) {
      await syncArticles();
      const article = articles[key];
      return article ? article.meta : null;
    },
    async getKeys() {
      await syncArticles();
      return Object.keys(articles);
    },
  };
});
