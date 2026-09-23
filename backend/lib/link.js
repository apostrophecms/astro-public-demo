// Canonical link field set. Spread with `...linkConfig.link` into any schema that needs
// a link — do not copy these fields manually. The frontend's getLinkPath() and
// opensInNewTab() helpers in frontend/src/utils/link.js depend on this exact field shape.
const link = {
  linkText: {
    label: 'project:linkText',
    type: 'string'
  },
  linkType: {
    label: 'project:linkType',
    type: 'select',
    choices: [
      {
        label: 'project:page',
        value: 'page'
      },
      {
        label: 'project:file',
        value: 'file'
      },
      {
        label: 'project:customUrl',
        value: 'custom'
      }
    ]
  },
  // _linkPage and _linkFile use the _ prefix: they are relationship fields populated
  // at request time and returned as arrays. The `if:` condition shows them only when
  // the matching linkType is selected — keeping the editing UI uncluttered.
  _linkPage: {
    label: 'project:pageToLink',
    type: 'relationship',
    withType: '@apostrophecms/page',
    max: 1,
    builders: {
      project: {
        title: 1,
        _url: 1
      }
    },
    if: {
      linkType: 'page'
    }
  },
  _linkFile: {
    label: 'project:fileToLink',
    type: 'relationship',
    withType: '@apostrophecms/file',
    max: 1,
    if: {
      linkType: 'file'
    }
  },
  linkUrl: {
    label: 'project:urlForCustom',
    type: 'url',
    if: {
      linkType: 'custom'
    }
  },
  linkTarget: {
    label: 'project:openNewBrowserTab',
    type: 'checkboxes',
    choices: [
      {
        label: 'project:openNewTab',
        value: '_blank'
      }
    ]
  }
};

export default { link };
