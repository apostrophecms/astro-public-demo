// Template registry — maps backend page type names to Astro components.
// Keys MUST match the backend module name exactly (e.g. '@apostrophecms/home-page', 'default-page').
// Piece show/index pages use the 'module-name:show' / 'module-name:index' pattern.
import HomePage from './HomePage.astro';
import DefaultPage from './DefaultPage.astro';
import ArticleIndexPage from './ArticleIndexPage.astro';
import ArticleShowPage from './ArticleShowPage.astro';
import NotFoundPage from './NotFoundPage.astro';

const templateComponents = {
  '@apostrophecms/home-page': HomePage,
  'default-page': DefaultPage,
  'article-page:index': ArticleIndexPage,
  'article-page:show': ArticleShowPage,
  '@apostrophecms/page:notFound': NotFoundPage
};

export default templateComponents;
