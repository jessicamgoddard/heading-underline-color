/**
 * BLOCK: clear-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//  Import CSS.
import './editor.scss';
import './style.scss';

// Import icon.
import icon from '../icon.js';
import classnames from 'classnames';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { addFilter } = wp.hooks;
const { select } = wp.data;
const { createHigherOrderComponent } = wp.compose;
const { withColors, InspectorControls, getColorClassName, ColorPalette } = wp.blockEditor;
const { PanelBody } = wp.components;
const { Fragment } = wp.element;

addFilter(
  'blocks.registerBlockType',
  'pandp-blocks/add-underline-color-attributes',
  addUnderlineColorAttributes
)

addFilter(
  'editor.BlockEdit',
  'pandp-blocks/add-underline-color-controls',
  addUnderlineColorControls
)

addFilter(
  'blocks.getSaveElement',
  'pandp-blocks/add-underline-color-save',
  addUnderlineColorSave
)

function addUnderlineColorAttributes( settings, name ) {

  if( 'core/heading' !== name ) return settings;

  settings.attributes.underlineColor = {
    type: 'string',
    default: null,
  };

  return settings;

}

function createColorClassName( attributes ) {

  const settings = select( 'core/editor' ).getEditorSettings();

  let colorClassName = 'has-default-color';

  if( attributes.underlineColor ) {

    let colors = settings.colors;
    let colorSlug = '';

    for( let i = 0; i < colors.length; i++) {

      if( colors[i].color === attributes.underlineColor ) {

        colorSlug = colors[i].slug;

        colorClassName = 'has-underline-color has-' + colorSlug + '-underline-color';

      }

    };

  };

  return colorClassName;

}

function addUnderlineColorControls( BlockEdit ) {

  const withInspectorControls = createHigherOrderComponent( BlockEdit => {

    return props => {

      if( 'core/heading' !== props.name ) return <BlockEdit {...props} />;

      // if( !props.attributes.className ) return <BlockEdit {...props} />;
      //
      // if( !props.attributes.className.includes( 'is-style-underline' ) ) return <BlockEdit {...props} />;

      let underlineColorClass = createColorClassName( props.attributes );

      return <Fragment>
        <div className={ underlineColorClass }>
          <BlockEdit { ...props } />
        </div>
        <InspectorControls>
          <PanelBody title={ __( 'Underline color' ) }>
            <ColorPalette
              value={ props.attributes.underlineColor }
              onChange={ underlineColor => props.setAttributes( { underlineColor } ) }
              label={ __( 'Underline Color' ) }
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>;

    }

  } );

  return withInspectorControls( BlockEdit );

}

function addUnderlineColorSave( el, block, attributes ) {

  if( 'core/heading' !== block.name ) return el;

  attributes.className = '';

  let underlineColorClass = createColorClassName( attributes );

  el.props.className = classnames( el.props.className, underlineColorClass );

  return el;

}
