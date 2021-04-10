// https://jsfiddle.net/wm6goeyw/
export default (elem: Element) => {
  const elemV = elem
  let str = ''
  function loop(element: Element): void {
    // stop here = element has ID
    if (element.getAttribute('id')) {
      str = str.replace(/^/, ` #${element.getAttribute('id')}`)
      str = str.replace(/\s/, '')
      str = str.replace(/\s/g, ' > ')
      return
    } // stop here = element is body
    if (document.body === element) {
      str = str.replace(/^/, ' body')
      str = str.replace(/\s/, '')
      str = str.replace(/\s/g, ' > ')
      return
    } // concat all classes in "queryselector" style
    if (element.getAttribute('class')) {
      let elemClasses = '.'
      elemClasses += element.getAttribute('class')
      elemClasses = elemClasses.replace(/\s/g, '.')
      elemClasses = elemClasses.replace(/^/g, ' ')
      let classNth = '' // check if element class is the unique child
      const childrens = element.parentNode?.children
      if (!childrens) return
      if (childrens.length || 0 < 2) {
        return
      }
      const similarClasses = []
      for (let i = 0; i < childrens.length; i += 1) {
        if (element.getAttribute('class') === childrens[i].getAttribute('class')) {
          similarClasses.push(childrens[i])
        }
      }
      if (similarClasses.length > 1) {
        for (let j = 0; j < similarClasses.length; j += 1) {
          if (element === similarClasses[j]) {
            j += 1
            classNth = `:nth-of-type(${j})`
            break
          }
        }
      }
      str = str.replace(/^/, elemClasses + classNth)
    } else {
      // get nodeType
      let name = element.nodeName
      name = name.toLowerCase()
      let nodeNth = ''
      const childrens = element.parentNode?.children
      if (!childrens) return
      if (childrens.length > 2) {
        const similarNodes = []
        for (let i = 0; i < childrens.length; i += 1) {
          if (element.nodeName === childrens[i].nodeName) {
            similarNodes.push(childrens[i])
          }
        }
        if (similarNodes.length > 1) {
          for (let j = 0; j < similarNodes.length; j += 1) {
            if (element === similarNodes[j]) {
              j += 1
              nodeNth = `:nth-of-type(${j})`
              break
            }
          }
        }
      }
      str = str.replace(/^/, ` ${name}${nodeNth}`)
    }
    if (element.parentNode) {
      loop(element.parentNode as Element)
    } else {
      str = str.replace(/\s/g, ' > ')
      str = str.replace(/\s/, '')
    }
  }
  loop(elemV)
  return str
}
