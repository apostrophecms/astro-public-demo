import linkConfig from '../../lib/link.js';

export default {
  extend: '@apostrophecms/widget-type',
  options: {
    label: 'project:button',
    icon: 'cursor-default-click-icon',
    previewImage: 'svg',
    description: 'project:buttonDescription'
  },
  fields: {
    add: {
      ...linkConfig.link,
      style: {
        type: 'select',
        label: 'project:style',
        def: 'primary',
        choices: [
          {
            label: 'project:primary',
            value: 'primary'
          },
          {
            label: 'project:outline',
            value: 'outline'
          }
        ]
      },
      block: {
        type: 'boolean',
        label: 'project:fullWidth',
        def: false
      }
    }
  },
  styles: {
    add: {
      fontSize: {
        type: 'range',
        label: 'project:fontSize',
        def: 18,
        min: 12,
        max: 24,
        unit: 'px',
        selector: '.button',
        property: 'font-size'
      },
      radius: {
        label: 'project:borderRadius',
        type: 'range',
        unit: 'px',
        def: 50,
        min: 0,
        max: 50,
        selector: '.button',
        property: 'border-radius'
      },
      color: {
        type: 'color',
        label: 'project:color',
        selector: '.button',
        property: '--button-primary-color',
        def: '--accent-color',
        options: {
          presetColors: [
            '--accent-color',
            '--default-color',
            '--heading-color'
          ]
        }
      },
      labelColor: {
        type: 'color',
        label: 'project:labelColor',
        selector: '.button',
        property: '--button-primary-label-color',
        def: '--contrast-color',
        options: {
          presetColors: [
            '--accent-color',
            '--default-color',
            '--heading-color',
            '--contrast-color'
          ]
        }
      },
      alignment: {
        type: 'radio',
        label: 'project:buttonAlignment',
        selector: '.button-widget',
        property: 'justify-content',
        def: 'flex-start',
        buttons: true,
        choices: [
          {
            label: 'apostrophe:styleLeft',
            value: 'flex-start'
          },
          {
            label: 'apostrophe:styleCenter',
            value: 'center'
          },
          {
            label: 'apostrophe:styleRight',
            value: 'flex-end'
          }
        ]
      }
    }
  },
  init(self) {
    // Alignment used to be both a select field (left/center/right) and a
    // style (flex-start/center/flex-end). Both saved to `alignment`, so the
    // style could receive values it doesn't understand. Only the style
    // remains; convert old field values to style values.
    self.apos.migration.add('button-widget-alignment-to-style', () => {
      const values = {
        left: 'flex-start',
        right: 'flex-end'
      };
      return self.apos.migration.eachWidget({}, async (doc, widget, dotPath) => {
        if (widget.type !== 'button' || !values[widget.alignment]) {
          return;
        }
        return self.apos.doc.db.updateOne(
          { _id: doc._id },
          { $set: { [`${dotPath}.alignment`]: values[widget.alignment] } }
        );
      });
    });
  }
};
