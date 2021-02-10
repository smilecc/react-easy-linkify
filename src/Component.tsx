import React, { useMemo } from 'react';
import { LinkifyCore, createOptions, IOptionsData, Options, IMultiToken } from './Core';

let linkId = 0;

// Given a string, converts to an array of valid React components
// (which may include strings)
export function stringToElements(str: string, opts: Options & IOptionsData) {

  let tokens = LinkifyCore.tokenize(str);
  let elements = [];

  for (var i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    if (token.type === 'nl' && opts.nl2br) {
      elements.push(React.createElement('br', { key: `linkified-${++linkId}` }));
      continue;
    } else if (!token.isLink || !opts.check(token)) {
      // Regular text
      elements.push(token.toString());
      continue;
    }

    let {
      formatted,
      formattedHref,
      tagName,
      className,
      target,
      attributes
    } = opts.resolve(token);

    let props: any = {
      key: `linkified-${++linkId}`,
      href: formattedHref,
    };

    if (className) {
      props.className = className;
    }

    if (target) {
      props.target = target;
    }

    props.type = token.type;

    // Build up additional attributes
    // Support for events via attributes hash
    if (attributes) {
      for (var attr in attributes) {
        props[attr] = attributes[attr];
      }
    }

    if (typeof opts.options.linkWrapper === 'function') {
      const LinkWrapper = opts.options.linkWrapper;
      elements.push(<LinkWrapper {...props}>{formatted}</LinkWrapper>);
    } else if (opts.options.linkWrapper && typeof opts.options.linkWrapper === 'object' && (opts.options as any).linkWrapper[token.type]) {
      const LinkWrapper = (opts.options as any).linkWrapper[token.type];
      elements.push(<LinkWrapper {...props}>{formatted}</LinkWrapper>);
    } else {
      elements.push(React.createElement(tagName, props, formatted));
    }
  }

  return elements;
}

// Recursively linkify the contents of the given React Element instance
export function linkifyReactElement(element: any, opts: Options & IOptionsData, elementId = 0) {
  if (React.Children.count(element.props.children) === 0) {
    // No need to clone if the element had no children
    return element;
  }

  let children: any[] = [];

  React.Children.forEach(element.props.children, (child) => {
    if (typeof child === 'string') {
      // ensure that we always generate unique element IDs for keys
      elementId = elementId + 1;
      children.push(...stringToElements(child, opts));
    } else if (React.isValidElement(child)) {
      if (typeof child.type === 'string'
        && opts.ignoreTags && opts.ignoreTags.includes(child.type.toUpperCase())
      ) {
        // Don't linkify this element
        children.push(child);
      } else {
        children.push(linkifyReactElement(child, opts, ++elementId));
      }
    } else {
      // Unknown element type, just push
      children.push(child);
    }
  });

  // Set a default unique key, copy over remaining props
  let newProps: any = { key: `linkified-element-${elementId}` };
  for (var prop in element.props) {
    newProps[prop] = element.props[prop];
  }

  return React.cloneElement(element, newProps, children);
}

export interface ILinkifyProps {
  tagName?: string;
  options?: IOptionsData;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export const Linkify: React.FC<ILinkifyProps> = (props) => {
  const { options = {}, tagName = 'span' } = props;
  // Copy over all non-linkify-specific props
  const newProps = useMemo(() => {
    let newProps: any = { key: 'linkified-element-0' };
    for (var prop in props) {
      if (prop !== 'options' && prop !== 'tagName') {
        newProps[prop] = props[prop];
      }
    }

    return newProps;
  }, [props]);


  let opts = useMemo(() => createOptions(options), [options]);
  let element = useMemo(() => React.createElement(tagName, newProps), [newProps, tagName]);

  return useMemo(() => linkifyReactElement(element, opts, 0), [element, opts]);
}
