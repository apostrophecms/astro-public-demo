export default {
  extend: '@apostrophecms/blog-page',
  options: {
    label: 'project:articleIndexPage',
    pluralLabel: 'project:articleIndexPages',
    piecesFilters: [
      { name: 'categories' },
      { name: 'author' }
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
    },
    group: {
      basics: {
        label: 'project:basics',
        fields: [ 'intro' ]
      }
    }
  },
  methods(self) {
    return {
      async beforeIndex(req) {
        req.data._categories = await self.apos.category.find(req).sort({ title: 1 }).toArray();
      }
    };
  }
};
