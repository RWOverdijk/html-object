/**
 * An HtmlObject that renders to markup.
 *
 * @param {string} [tag]
 * @param {{}} [attributes]
 *
 * @constructor
 */
function HtmlObject(tag, attributes) {
  attributes = attributes || {};

  this.tag = tag || 'div';
  this.children = [];
  this.content = '';
  this.appendPrepend = 'append';

  this.setAttributes(attributes);
  this.setIsVoid(this.isVoidElement(this.tag));
}

/**
 * Object methods.
 */
HtmlObject.prototype = {

  /**
   * An array of elements considered void.
   */
  voidElements : [
    'area',
    'base',
    'br',
    'col',
    'command',
    'embed',
    'hr',
    'img',
    'input',
    'keygen',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr'
  ],

  /**
   * Holds if this element is xhtml
   */
  xhtml : false,

  /**
   * Holds if this element is void
   */
  void : false,

  /**
   * Set if this element is void. This is useful for custom elements that you think should be void (think angularjs).
   *
   * @param {boolean} isVoid
   *
   * @returns {HtmlObject}
   */
  setIsVoid : function(isVoid) {
    this.void = !!isVoid;

    return this;
  },

  /**
   * Returns whether or not this element's, or the supplied tag is void.
   *
   * @param {string} tag
   *
   * @returns {boolean}
   */
  isVoidElement : function(tag) {
    if (!tag) {
      return this.void;
    }

    return this.voidElements.indexOf(tag) > -1;
  },

  /**
   * Returns whether or not this element is void
   *
   * @returns {boolean}
   */
  isXhtml : function() {
    return this.xhtml;
  },

  /**
   * Set whether or not this element is Xhtml.
   *
   * @param {boolean} boolean
   *
   * @returns {HtmlObject}
   */
  setIsXhtml : function(boolean) {
    this.xhtml = !!boolean;

    return this;
  },

  /**
   * Get this element's tag name
   *
   * @returns {string}
   */
  getTag : function() {
    return this.tag;
  },

  /**
   * Remove a specific attribute.
   *
   * @param {string} attribute
   *
   * @returns {HtmlObject}
   */
  removeAttribute : function(attribute) {
    if (typeof this.attributes[attribute] !== 'undefined') {
      delete this.attributes[attribute];
    }

    return this;
  },

  /**
   * Get this element's attributes.
   *
   * @returns {{}}
   */
  getAttributes : function() {
    return this.attributes;
  },

  /**
   * Get a specific attribute.
   *
   * @param {string} attribute
   *
   * @returns {string}
   */
  getAttribute : function(attribute) {
    if (typeof this.attributes[attribute] !== 'undefined') {
      return this.attributes[attribute];
    }

    return null;
  },

  /**
   * Set (and overwrite) the attributes.
   *
   * @param {{}} attributes
   * @returns {HtmlObject}
   */
  setAttributes : function(attributes) {
    this.attributes = attributes;

    return this;
  },

  /**
   * Add multiple attributes.
   *
   * @param {{}} attributes
   * @returns {HtmlObject}
   */
  addAttributes : function(attributes) {
    Object.getOwnPropertyNames(attributes).forEach(function(attribute) {
      this.setAttribute(attribute, attributes[attribute]);
    });

    return this;
  },

  /**
   * Set a specific attribute.
   *
   * @param {string} attribute
   * @param {string} value
   *
   * @returns {HtmlObject}
   */
  setAttribute : function(attribute, value) {
    this.attributes[attribute] = value;

    return this;
  },

  /**
   * Set content placement to "append".
   * this will append the content to the body _after_ the child elements.
   */
  setAppendContent : function() {
    this.appendPrepend = 'append';
  },

  /**
   * Set content placement to "prepend".
   * this will prepend the content to the body _before_ the child elements.
   */
  setPrependContent : function() {
    this.appendPrepend = 'prepend';
  },

  /**
   * Convenience method. Add a class to the element.
   *
   * @param {string} className
   *
   * @returns {HtmlObject}
   */
  addClass : function(className) {
    var classes = this.getAttribute('class') || [];

    if (typeof classes === 'string') {
      classes = classes.split(' ');
    }

    classes.push(className);

    return this.setAttribute('class', classes.join(' '));
  },

  /**
   * Convenience method. Remove a class from the element.
   *
   * @param {string} className
   *
   * @returns {HtmlObject}
   */
  removeClass : function(className) {
    var classes = this.getAttribute('class')
      , classIndex;

    if (null === classes) {
      return this;
    }

    classes = classes.split(' ');

    classIndex = classes.indexOf(className);

    if (classIndex > -1) {
      classes.splice(classIndex, 1);
    }

    return this.setAttribute('class', classes.join(' '));
  },

  /**
   * Set (and overwrite) content.
   *
   * @param {string} content
   *
   * @returns {HtmlObject}
   */
  setContent : function(content) {
    this.content = content;

    return this;
  },

  /**
   * Add (append) content.
   *
   * @param {string} content
   *
   * @returns {HtmlObject}
   */
  appendContent : function(content) {
    this.content += content;

    return this;
  },

  /**
   * Add (prepend) content.
   *
   * @param {string} content
   *
   * @returns {HtmlObject}
   */
  prependContent : function(content) {
    this.content = content + this.content;

    return this;
  },

  /**
   * Clear (remove) the content.
   *
   * @returns {HtmlObject}
   */
  clearContent : function() {
    this.content = '';

    return this;
  },

  /**
   * Render the attributes to a string.
   *
   * @returns {string}
   */
  renderAttributes : function() {
    var attributesString = ''
      , attributes = this.attributes
      , attribute;

    if (Object.keys(attributes).length === 0) {
      return attributesString;
    }

    Object.getOwnPropertyNames(attributes).forEach(function(attribute) {
      attributesString += ' ' + attribute + '="' + attributes[attribute] + '"';
    });

    return attributesString;
  },

  /**
   * Convenience method. Set data-something.
   *
   * @param {string} key
   * @param {string} value
   *
   * @returns {HtmlObject}
   */
  setData : function(key, value) {
    return this.setAttribute('data-' + key, value);
  },

  /**
   * Convenience method. Get data-something.
   *
   * @param {string} key
   *
   * @returns {string}
   */
  getData : function(key) {
    return this.getAttribute('data-' + key);
  },

  /**
   * Convenience method. jQuery-like syntax for data.
   *
   * @param {string} key
   * @param {string} [value]
   *
   * @returns {HtmlObject|string}
   */
  data : function(key, value) {
    if (typeof value === 'undefined') {
      return this.getData(key);
    }

    return this.setData(key, value);
  },

  /**
   * Convenience method. Remove data-something.
   *
   * @param {string} key
   *
   * @returns {HtmlObject}
   */
  removeData : function(key) {
    return this.removeAttribute('data-' + key);
  },

  /**
   * Render the children for this element.
   *
   * @returns {string}
   */
  renderChildren : function() {
    var childString = '';

    this.children.forEach(function(child) {
      childString += child.render();
    });

    return childString;
  },

  /**
   * Add a child to this element
   *
   * @param {HtmlObject} child
   *
   * @returns {HtmlObject}
   */
  addChild : function(child) {
    this.children.push(child);

    return this;
  },

  /**
   * Spawn a new child for this element.
   *
   * @param {string} [tag]
   * @param {{}} [attributes]
   *
   * @returns {HtmlObject} The child element
   */
  spawnChild : function(tag, attributes) {
    var child = new HtmlObject(tag, attributes);

    child.setIsXhtml(this.isXhtml());

    this.addChild(child);

    return child;
  },

  /**
   * Render this element.
   *
   * @returns {string}
   */
  render : function() {
    var body = ''
      , elementParts;

    elementParts = [
      '<',
      this.getTag(),
      this.renderAttributes()
    ];

    if (this.isVoidElement()) {
      if (this.isXhtml()) {
        elementParts.push(' /');
      }

      elementParts.push('>');

      return elementParts.join('');
    } else {
      elementParts.push('>');
    }

    if (this.children.length > 0) {
      body = this.renderChildren();
    }

    if (this.appendPrepend === 'prepend') {
      elementParts.push(this.content, body);
    } else {
      elementParts.push(body, this.content);
    }

    elementParts = elementParts.concat([
      '<',
      '/',
      this.getTag(),
      '>'
    ]);

    return elementParts.join('');
  }
};

module.exports = HtmlObject;
