'use strict';

const domElements = require('../index');

domElements({
  'test': 'image/source',
  'sitemaps': [
    'https://www.yasglobal.com/post-sitemap.xml',
    'https://www.yasglobal.com/page-sitemap.xml',
    'https://www.yasglobal.com/category-sitemap.xml',
  ]
});
