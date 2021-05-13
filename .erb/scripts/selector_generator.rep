/* selector-generator (ver. 0.3.0). https://github.com/flamencist/SelectorGenerator */

;(function () {
  'use strict'

  var exports = {}

  if (!('version' in exports)) {
    exports.version = '0.3.0'
  }

  ;(function (exports) {
    function SelectorGenerator(options) {
      var shim = {}
      //noinspection JSUnresolvedVariable
      var call = Function.call

      /**
       * wrap function and use first argument as context (this) in returned function
       * @param f {Function} function for call
       * @returns {Function}
       */
      function uncurryThis(f) {
        return function () {
          return call.apply(f, arguments)
        }
      }

      /**
       * check function is native
       * @param f {Function} function
       * @returns {boolean}
       */
      var isFuncNative = function (f) {
        return (
          !!f &&
          (typeof f).toLowerCase() === 'function' &&
          (f === Function.prototype ||
            /^\s*function\s*(\b[a-z$_][a-z0-9$_]*\b)*\s*\((|([a-z$_][a-z0-9$_]*)(\s*,[a-z$_][a-z0-9$_]*)*)\)\s*\{\s*\[native code\]\s*\}\s*$/i.test(
              String(f),
            ))
        )
      }

      /**
       *
       * @method getFuncNative
       * @param fun
       * @return {null}
       * @private
       */
      var getFuncNative = function (fun) {
        return fun && isFuncNative(fun) ? fun : null
      }

      var array_reduce = uncurryThis(
        Array.prototype.reduce && isFuncNative(Array.prototype.reduce)
          ? Array.prototype.reduce
          : function (callback, basis) {
              var index = 0,
                length = this.length
              // concerning the initial value, if one is not provided
              if (arguments.length === 1) {
                // seek to the first value in the array, accounting
                // for the possibility that is is a sparse array
                do {
                  if (index in this) {
                    basis = this[index++]
                    break
                  }
                  if (++index >= length) {
                    throw new TypeError()
                  }
                } while (1)
              }
              // reduce
              for (; index < length; index++) {
                // account for the possibility that the array is sparse
                if (index in this) {
                  basis = callback(basis, this[index], index)
                }
              }
              return basis
            },
      )

      var array_map = uncurryThis(
        Array.prototype.map && isFuncNative(Array.prototype.map)
          ? Array.prototype.map
          : function (callback, thisp) {
              var self = this
              var collect = []
              array_reduce(
                self,
                function (undefined, value, index) {
                  collect.push(callback.call(thisp, value, index, self))
                },
                void 0,
              )
              return collect
            },
      )

      var array_filter = uncurryThis(
        Array.prototype.filter && isFuncNative(Array.prototype.filter)
          ? Array.prototype.filter
          : function (predicate, that) {
              var other = [],
                v
              for (var i = 0, n = this.length; i < n; i++) {
                if (i in this && predicate.call(that, (v = this[i]), i, this)) {
                  other.push(v)
                }
              }
              return other
            },
      )

      /**
       * shim for array.indexOf
       *
       * @function array_indexOf
       * @example
       *  ```
       *      var arr = [2,3,4];
       *      var result = arrayUtils.indexOf(arr, 3);
       *      console.log(result);
       *  ```
       *    *result: 1*
       * @type {Function}
       * @private
       */
      var array_indexOf = uncurryThis(
        getFuncNative(Array.prototype.indexOf) ||
          function (searchElement, fromIndex) {
            var k

            if (!this || !this.length) {
              //eslint-disable-line no-invalid-this
              throw new TypeError('"this" is null or not defined')
            }

            var O = Object(this) //eslint-disable-line no-invalid-this

            var len = O.length >>> 0

            if (len === 0) {
              return -1
            }

            var n = +fromIndex || 0

            if (Math.abs(n) === Infinity) {
              n = 0
            }

            if (n >= len) {
              return -1
            }

            k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)

            while (k < len) {
              if (k in O && O[k] === searchElement) {
                return k
              }
              k++
            }
            return -1
          },
      )

      /**
       * array find shim
       *
       * @function array_find
       * @example
       *  ```
       *      var arr = [2,3,4];
       *      var result = arrayUtils.find(arr, function(item){
       *          return item % 2 === 0;
       *      });
       *      console.log(result);
       *  ```
       *    *result: 2*
       * @type {Function}
       * @private
       */
      var array_find = uncurryThis(
        getFuncNative(Array.prototype.find) ||
          function (predicate, that) {
            var length = this.length //eslint-disable-line no-invalid-this
            if (typeof predicate !== 'function') {
              throw new TypeError('Array#find: predicate must be a function')
            }
            if (length === 0) {
              return undefined
            }
            for (var i = 0, value; i < length; i++) {
              value = this[i] //eslint-disable-line no-invalid-this
              if (predicate.call(that, value, i, this)) {
                return value
              }
            }
            return undefined
          },
      )

      shim.reduce = array_reduce
      shim.map = array_map
      shim.filter = array_filter
      shim.indexOf = array_indexOf
      shim.find = array_find

      var _ = shim //eslint-disable-line no-unused-vars
      exports._ = shim

      var autogenRegexps = [/\d{4,}/, /^ember\d+/, /^[0-9_-]+$/, /^_\d{2,}/, /([a-f_-]*[0-9_-]){6,}/i]

      /**
       * check auto-generated selectors
       * @param {String} val
       * @return {boolean} is auto-generated
       */
      function autogenCheck(val) {
        if (!val) {
          return false
        }
        var autogenerated = _.find(autogenRegexps, function (reg) {
          return reg.test(val)
        })
        return !!autogenerated
      }
      exports.autogenCheck = autogenCheck

      var cssEscaper = (function () {
        /**
         * @function escapeIdentifierIfNeeded
         * @param {string} ident
         * @return {string}
         */
        function escapeIdentifierIfNeeded(ident) {
          if (isCssIdentifier(ident)) {
            return ident
          }
          var shouldEscapeFirst = /^(?:[0-9]|-[0-9-]?)/.test(ident)
          var lastIndex = ident.length - 1
          return ident.replace(/./g, function (c, i) {
            return (shouldEscapeFirst && i === 0) || !isCssIdentChar(c) ? escapeAsciiChar(c, i === lastIndex) : c
          })
        }

        /**
         * @function escapeAsciiChar
         * @param {string} c
         * @param {boolean} isLast
         * @return {string}
         */
        function escapeAsciiChar(c, isLast) {
          return '\\' + toHexByte(c) + (isLast ? '' : ' ')
        }

        /**
         * @function toHexByte
         * @param {string} c
         */
        function toHexByte(c) {
          var hexByte = c.charCodeAt(0).toString(16)
          if (hexByte.length === 1) {
            hexByte = '0' + hexByte
          }
          return hexByte
        }

        /**
         * @function isCssIdentChar
         * @param {string} c
         * @return {boolean}
         */
        function isCssIdentChar(c) {
          if (/[a-zA-Z0-9_-]/.test(c)) {
            return true
          }
          return c.charCodeAt(0) >= 0xa0
        }

        /**
         * @function isCssIdentifier
         * @param {string} value
         * @return {boolean}
         */
        function isCssIdentifier(value) {
          return /^-?[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value)
        }

        return { escape: escapeIdentifierIfNeeded }
      })()

      exports.cssEscaper = cssEscaper

      /**
       * @constructor
       * @param {string} value
       * @param {boolean} optimized
       */
      var DomNodePathStep = function (value, optimized) {
        this.value = value
        this.optimized = optimized || false
      }

      DomNodePathStep.prototype = {
        /**
         * @return {string}
         */
        toString: function () {
          return this.value
        },
      }

      exports.DomNodePathStep = DomNodePathStep //eslint-disable-line no-unused-vars
      /**
       * @param {Object?} options
       * @param {boolean?} options.withoutNthChild
       * @param {boolean?} options.optimized
       * @param {Node?} options.targetNode
       * @class
       * @constructor
       */

      /* globals DomNodePathStep, cssEscaper, autogenCheck */ function SelectorGeneratorStep(options) {
        options = options || {
          withoutNthChild: false,
          targetNode: null,
        }

        /**
         * generate selector for current node
         * @param {HTMLElement} node
         * @return {DomNodePathStep} selector for current node
         */
        this.visit = function (node) {
          if (node.nodeType !== 1) {
            return null
          }

          var nodeName = node.nodeName.toLowerCase()
          var parent = node.parentNode
          var siblings = parent.children || []
          var siblingsWithSameNodeName = getSiblingsWithSameNodeName(node, siblings)

          var needsId = hasId(node, siblingsWithSameNodeName)
          if (needsId) {
            var id = node.getAttribute('id')
            return new DomNodePathStep(nodeName + idSelector(id), true)
          }
          var isRootNode = !parent || parent.nodeType === 9
          if (isRootNode) {
            // document node
            return new DomNodePathStep(nodeName, true)
          }

          var hasAttributeName = hasUniqueAttributeName(node, siblingsWithSameNodeName)
          var needsClassNames = siblingsWithSameNodeName.length > 0
          var needsNthChild = isNeedsNthChild(node, siblingsWithSameNodeName, hasAttributeName)
          var needsType = hasType(node)

          var result = nodeName

          if (hasAttributeName) {
            var attributeName = node.getAttribute('name')
            // result += '[name="' + cssEscaper.escape(attributeName) + '"]'
            result += '[name="' + attributeName + '"]'
            return new DomNodePathStep(result, true)
          }

          if (needsType) {
            result += '[type="' + node.getAttribute('type') + '"]'
          }

          if (needsNthChild && !options.withoutNthChild) {
            var ownIndex = _.indexOf(siblings, node)
            result += ':nth-child(' + (ownIndex + 1) + ')'
          } else if (needsClassNames) {
            var prefixedOwnClassNamesArray = prefixedElementClassNames(node)
            for (var prefixedName in keySet(prefixedOwnClassNamesArray)) {
              //eslint-disable-line guard-for-in
              // result += '.' + cssEscaper.escape(prefixedName.substr(1))
              result += '.' + prefixedName.substr(1).replaceAll(':', '\\:')
            }
          }

          return new DomNodePathStep(result, false)
        }

        function hasUniqueAttributeName(node, siblingsWithSameNodeName) {
          var attributeName = node.getAttribute('name')
          if (!attributeName || autogenCheck(attributeName)) {
            return false
          }
          var isSimpleFormElement = isSimpleInput(node, options.targetNode === node) || isFormWithoutId(node)
          return !!(
            isSimpleFormElement &&
            attributeName &&
            !_.find(siblingsWithSameNodeName, function (sibling) {
              return sibling.getAttribute('name') === attributeName
            })
          )
        }

        function isNeedsNthChild(node, siblings, isUniqueAttributeName) {
          var needsNthChild = false
          var prefixedOwnClassNamesArray = prefixedElementClassNames(node)
          for (var i = 0; !needsNthChild && i < siblings.length; ++i) {
            var sibling = siblings[i]
            if (needsNthChild) {
              continue
            }

            var ownClassNames = keySet(prefixedOwnClassNamesArray)
            var ownClassNameCount = 0

            for (var name in ownClassNames) {
              if (ownClassNames.hasOwnProperty(name)) {
                ++ownClassNameCount
              }
            }
            if (ownClassNameCount === 0 && !isUniqueAttributeName) {
              needsNthChild = true
              continue
            }
            var siblingClassNamesArray = prefixedElementClassNames(sibling)

            for (var j = 0; j < siblingClassNamesArray.length; ++j) {
              var siblingClass = siblingClassNamesArray[j]
              if (!ownClassNames.hasOwnProperty(siblingClass)) {
                continue
              }
              delete ownClassNames[siblingClass]
              if (!--ownClassNameCount && !isUniqueAttributeName) {
                needsNthChild = true
                break
              }
            }
          }
          return needsNthChild
        }

        function getSiblingsWithSameNodeName(node, siblings) {
          return _.filter(siblings, function (sibling) {
            return (
              sibling.nodeType === 1 &&
              sibling !== node &&
              sibling.nodeName.toLowerCase() === node.nodeName.toLowerCase()
            )
          })
        }

        function hasType(node) {
          return (
            node.getAttribute('type') &&
            ((isSimpleInput(node, options.targetNode === node) && !getClassName(node)) ||
              isFormWithoutId(node) ||
              isButtonWithoutId(node))
          )
        }

        /**
         * @function idSelector
         * @param {string} id
         * @return {string}
         */
        function idSelector(id) {
          // return '#' + cssEscaper.escape(id)
          return '#' + id.replaceAll(':', '\\:')
        }

        /**
         * element has siblings with same id and same tag
         * @function hasId
         * @param {Element} node
         * @param {Array<Element>} siblings Array of elements , parent.children
         * @return {boolean}
         */
        function hasId(node, siblings) {
          var id = node.getAttribute('id')
          if (!id) {
            return false
          }
          if (autogenCheck(id)) {
            return false
          }
          return (
            _.filter(siblings, function (s) {
              return s.getAttribute('id') === id
            }).length === 0
          )
        }

        /**
         * @function keySet
         * @param {Array} array of keys
         * @return {Object}
         */
        function keySet(array) {
          var keys = {}
          for (var i = 0; i < array.length; ++i) {
            keys[array[i]] = true
          }
          return keys
        }

        /**
         * @function prefixedElementClassNames
         * @param {HTMLElement} node
         * @return {!Array.<string>}
         */
        function prefixedElementClassNames(node) {
          var classAttribute = getClassName(node)
          if (!classAttribute) {
            return []
          }

          var classes = classAttribute.split(/\s+/g)
          var existClasses = _.filter(classes, function (c) {
            return c && !autogenCheck(c)
          })
          return _.map(existClasses, function (name) {
            // The prefix is required to store "__proto__" in a object-based map.
            return '$' + name
          })
        }

        function isFormWithoutId(node) {
          return node.nodeName.toLowerCase() === 'form' && !node.getAttribute('id')
        }

        function isButtonWithoutId(node) {
          return node.nodeName.toLowerCase() === 'button' && !node.getAttribute('id')
        }

        /**
         * target is simple input without classes,id
         * @function isSimpleInput
         * @param node
         * @param isTargetNode
         * @return {boolean}
         */
        function isSimpleInput(node, isTargetNode) {
          return isTargetNode && node.nodeName.toLowerCase() === 'input'
        }

        /**
         * @function getClassName
         * get css class of element
         * @param {HTMLElement} node Web element
         * @return {string}
         */
        function getClassName(node) {
          return node.getAttribute('class') || node.className
        }
      }

      exports.SelectorGeneratorStep = SelectorGeneratorStep //eslint-disable-line no-unused-vars
      /**
       * @class
       * get unique selector, path of node
       * @param {Object?} options
       * @param {function?} options.querySelectorAll
       * @constructor
       */

      /*global  SelectorGeneratorStep */ function SelectorGenerator(options) {
        //eslint-disable-line no-unused-vars

        options = options || {}

        /**
         * @description get full path of node
         * @function getPath
         * @param {HTMLElement} node
         * @return {string}
         */
        function getPath(node) {
          if (!node || node.nodeType !== 1) {
            return ''
          }
          var selectorGeneratorStep = new SelectorGeneratorStep({
            withoutNthChild: false,
            targetNode: node,
          })
          var steps = []
          var contextNode = node
          while (contextNode) {
            var step = selectorGeneratorStep.visit(contextNode)
            if (!step) {
              break
            } // Error - bail out early.
            steps.push(step)
            contextNode = contextNode.parentNode
          }

          steps.reverse()
          return steps.join(' ')
        }

        /**
         * @param {HTMLElement} node
         * @return {string}
         */
        function getSelector(node) {
          if (!node || node.nodeType !== 1) {
            return ''
          }
          var selectorGeneratorStep = new SelectorGeneratorStep({ targetNode: node })
          var steps = []
          var contextNode = node
          while (contextNode) {
            var step = selectorGeneratorStep.visit(contextNode)
            if (!step) {
              break // Error - bail out early.
            }
            steps.push(step)
            if (step.optimized) {
              if (isUniqueSelector(buildSelector(steps))) {
                break
              }
            }
            contextNode = contextNode.parentNode
          }

          var simplifiedSteps = simplifySelector(steps)
          return buildSelector(simplifiedSteps)
        }

        /**
         * simplify selector
         * @example
         * ```
         *  <div>
         *      <div>
         *          <form>
         *              <input type="text"/>
         *          </form>
         *      </div>
         *  </div>
         *
         * var steps = [new DomNodePathStep("input[type='text']"), new DomNodePathStep("form"), new DomNodePathStep("div"), new DomNodePathStep("div")];
         * var simplified = simplifySelector(steps); // ["input[type='text']", "form"]
         * ```
         *
         * @example
         * ```
         *  <div id="loginForm">
         *      <div>
         *          <div>
         *              <input type="text"/>
         *          </div>
         *      </div>
         *  </div>
         *
         * var steps = [new DomNodePathStep("input[type='text']"), new DomNodePathStep("div"), new DomNodePathStep("div"), new DomNodePathStep("div#loginForm")];
         * var simplified = simplifySelector(steps); // [["input[type='text']"],["div#loginForm"]]
         * ```
         *
         * @method simplifySelector
         * @param {Array} steps parts of selector
         * @return {Array} steps array of steps or array Arrays of steps
         */
        function simplifySelector(steps) {
          var minLength = 2
          //if count of selectors is little, that not modify selector
          if (steps.length <= minLength) {
            return steps
          }

          var stepsCopy = steps.slice()
          removeHtmlBodySteps(stepsCopy)

          var lastStep = stepsCopy[stepsCopy.length - 1]
          var parentWithId = lastStep.toString().indexOf('#') >= 0
          var parentWithName = lastStep.toString().indexOf('name=') >= 0

          if (parentWithId || parentWithName) {
            return simplifyStepsWithParent(stepsCopy)
          } else {
            return regularSimplifySteps(stepsCopy, minLength)
          }
        }

        /**
         * remove Html, Body Steps
         * @param steps
         */
        function removeHtmlBodySteps(steps) {
          while (steps[steps.length - 1].toString() === 'html' || steps[steps.length - 1].toString() === 'body') {
            steps.pop()
          }
        }

        /**
         *  simplifyStepsWithParent
         * @function simplifyStepsWithParent
         * @param steps
         * @return {Array} array of arrays
         */
        function simplifyStepsWithParent(steps) {
          var parentStep = steps.slice(-1)
          var sliced = steps.slice(0, 1)
          while (sliced.length < steps.length - 1) {
            var selector = buildSelector([sliced, parentStep])
            if (isUniqueSelector(selector)) {
              break
            }
            sliced = steps.slice(0, sliced.length + 1)
          }
          return [sliced, parentStep]
        }

        /**
         * regularSimplifySteps
         * @method regularSimplifySteps
         * @param {Array} steps
         * @param {int=2} minLength
         * @return {Array} array of steps
         */
        function regularSimplifySteps(steps, minLength) {
          minLength = minLength || 2
          var sliced = steps.slice(0, minLength)
          while (sliced.length < steps.length) {
            var selector = buildSelector(sliced)
            if (isUniqueSelector(selector)) {
              break
            }
            sliced = steps.slice(0, sliced.length + 1)
          }
          return sliced
        }

        /**
         * create selector string from steps array
         * @function buildSelector
         * @example
         * with single array of steps
         * ```
         * <form id="loginForm">
         *    <input type='text'/>
         * </form>
         *
         *  var steps = [new DomNodePathStep("input[type='text']"),new DomNodePathStep("form#loginForm")];
         *  var selector = buildSelector(steps); // "form#loginForm > input[type='text']"
         * ```
         *
         * @example
         * with multiple array of steps
         * ```
         * <div id="loginForm">
         *    <div>
         *       <div>
         *          <input type='text'/>
         *      </div>
         *   </div>
         *  </div>
         *
         * var steps = [[new DomNodePathStep("input[type='text']")],[new DomNodePathStep("div#loginForm")]];
         * var selector = buildSelector(steps); // "div#loginForm input[type='text']"
         * ```
         *
         * @param {Array} steps Array of string or array of Array of string
         * @return {string} selector string
         */
        function buildSelector(steps) {
          var stepsCopy = steps.slice()
          stepsCopy.reverse()
          //check steps is regular array of steps
          if (typeof stepsCopy[0].value !== 'undefined') {
            return stepsCopy.join(' > ')
          } else {
            return _.reduce(
              stepsCopy,
              function (previosValue, currentValue) {
                var selector = buildSelector(currentValue)
                return previosValue ? previosValue + ' ' + selector : selector
              },
              '',
            )
          }
        }

        /**
         * @function isUniqueSelector
         * detect selector is unique
         * @param {String} selector
         * @return {boolean} unique selector?
         */
        function isUniqueSelector(selector) {
          if (!options.querySelectorAll) {
            return true
          }
          return options.querySelectorAll(selector).length < 2
        }

        /**
         * get unique selector
         * @method
         * @param {HTMLElement} node html element
         * @param {boolean?} optimized get short selector
         * @returns {String} selector
         */
        this.getSelector = getSelector
        /**
         * path of node
         * @method
         * @param {HTMLElement} node html element
         * @returns {String} path
         */
        this.getPath = getPath
      }

      exports.SelectorGenerator = SelectorGenerator

      return new SelectorGenerator(options)
    }
    exports.SelectorGenerator = SelectorGenerator
  })(exports)

  for (var key in exports) {
    if (exports.hasOwnProperty(key)) {
      exports.SelectorGenerator[key] = exports[key]
    }
  }
  window.SelectorGenerator = exports.SelectorGenerator
})()
