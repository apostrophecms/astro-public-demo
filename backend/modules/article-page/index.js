export default {
  extend: '@apostrophecms/piece-page-type',
  options: {
    label: 'project:articleIndexPage',
    pluralLabel: 'project:articleIndexPages',
    piecesFilters: [
      { name: 'categories' }
    ]
  },
  fields: {
    add: {
      intro: {
        label: 'project:articleIntro',
        type: 'area',
        options: {
          limit: 1,
          widgets: {
            '@apostrophecms/rich-text': {}
          }
        }
      }
    }
  }
};
