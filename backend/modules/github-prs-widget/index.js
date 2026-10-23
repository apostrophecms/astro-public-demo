export default {
  extend: '@apostrophecms/widget-type',
  options: {
    name: 'githubPrs',
    label: 'project:ghPrLabel',
    previewImage: 'svg',
    icon: 'github',
    description: 'project:ghPrDescription'
  },
  fields: {
    add: {
      repo: {
        type: 'string',
        label: 'project:repo',
        def: 'apostrophecms/apostrophe',
        help: 'project:formattedLike',
        required: true
      },
      limit: {
        type: 'integer',
        label: 'project:limit',
        def: 5,
        required: true,
        max: 100,
        min: 1
      },
      state: {
        type: 'select',
        label: 'project:state',
        required: true,
        def: 'open',
        choices: [
          {
            label: 'project:open',
            value: 'open'
          },
          {
            label: 'project:closed',
            value: 'closed'
          }
        ]
      }
    }
  },
  icons: {
    github: 'Github'
  },
  styles: {
    add: {
      backgroundColor: {
        type: 'color',
        label: 'project:backgroundColor',
        property: 'background-color',
        def: '--surface-color',
        options: {
          presetColors: [
            '--surface-color',
            '--accent-color',
            '--default-color',
            '--heading-color'
          ]
        }
      },
      border: 'border',
      padding: 'padding',
      boxShadow: 'boxShadow'
    }
  }
};
