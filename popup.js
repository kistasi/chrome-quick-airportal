async function getArticles() {
  const url = 'https://airportal.hu/feed/';

  let response = await fetch(url);
  response = await response.text();
  response = new DOMParser().parseFromString(response, 'text/xml');

  return response;
}

function transformArticlesToJson(articles) {
  const items = articles.querySelectorAll('rss channel item');
  let results = [];

  items.forEach(item => {
    const link = item.querySelector('link').textContent;

    if (!link.includes('/allas-')) {
      results.push({
        title: item.querySelector('title').textContent,
        link: link,
        description: item.querySelector('description').textContent,
      });
    }
  });

  return results;
}

function renderArticles(articles) {
  let html = '';
  articles.forEach(article => {
    html += `<li><a target="_blank" href="${article.link}">${article.title}</a></li>`;
  });

  document.querySelector('.articles ul').innerHTML = html;
}

(async () => {
  let articles = await getArticles();
  articles = transformArticlesToJson(articles);
  renderArticles(articles);
})();
