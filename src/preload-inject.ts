import { ipcRenderer, contextBridge } from 'electron'
import { Droppable, DroppableEventNames, DroppableDroppedEvent } from '@shopify/draggable'
import 'selector-generator'
import { connectSocket, sendBackIpc } from './client-ipc'
import { EmptyElement, DropzoneTags } from './utils/assest'
import { ElementPayload, ElementActualStatus, BreadcrumbPayload, MainIpcChannel, ElementTag } from './interface'
import { preloadCSS, sectionHTML } from './preload-inject-code'

let PROJECTID: string | undefined
let ISWEAPP = false
let dataCode = 'data-code'
let selector: string | undefined
let activeElement: HTMLElement | null = null
let hoverElement: Element | null = null
let droppable: Droppable<DroppableEventNames> | undefined

// https://stackoverflow.com/a/13977403
const GetStyleClass = (className: string) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < document.styleSheets.length; i++) {
    const styleSheet = document.styleSheets[i]

    const rules = styleSheet.cssRules || styleSheet.rules

    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < rules.length; j++) {
      const rule = rules[j]

      if (rule.selectorText === className) {
        return rule.style
      }
    }
  }

  return 0
}

const generator = new (window as any).SelectorGenerator()
const getSelectorString = (el: Element): string => {
  return generator.getPath(el).replace('html body ', '').split(' ').join('>')
}

// Replace tag name but keep element contents
const changeTag = (el: HTMLElement, newTagName: string) => {
  if (!el.parentNode) throw Error('el.parentNode is empty cannot replace the name')
  const newEl = document.createElement(newTagName)

  while (el.firstChild) {
    newEl.appendChild(el.firstChild)
  }

  Array.from(el.attributes).forEach((attr) => {
    newEl.attributes.setNamedItem(attr.cloneNode() as Attr)
  })

  el.parentNode.replaceChild(newEl, el)
}

const respElementActualStatus = (): ElementActualStatus | null => {
  if (!PROJECTID || !activeElement) return null
  const codePosition = activeElement.getAttribute(dataCode)
  if (!codePosition) return null

  const { tagName, className } = activeElement
  // https://stackoverflow.com/a/11495671
  // getComputedStyle() does not support pseudo-class query。Currently only tailwindcss classname can be used.
  // but parentDeclaration cannot be replaced by tailwindcss classname.
  const declaration = getComputedStyle(activeElement)
  const payload: ElementActualStatus = {
    projectId: PROJECTID,
    codePosition,
    className,
    tagName,
    display: declaration.getPropertyValue('display'),
    position: declaration.getPropertyValue('position'),
    background: declaration.getPropertyValue('background-image'),
  }

  if (activeElement.parentElement) {
    payload.parentTagName = activeElement.parentElement.tagName
    const parentDeclaration = getComputedStyle(activeElement.parentElement)
    payload.parentDisplay = parentDeclaration.getPropertyValue('display')
  }

  const supportText = !activeElement.children.length && !EmptyElement.includes(tagName.toLowerCase())
  if (supportText) {
    payload.text = activeElement.innerText
  }

  ipcRenderer.send(MainIpcChannel.RespElementStatus, payload)
  return payload
}

const inspectActiveElement = (targetOrSelector: string | HTMLElement): void => {
  if (!PROJECTID) return

  selector = undefined
  if (activeElement) {
    activeElement.removeAttribute('data-active')
    activeElement.querySelector('ul.de-section')?.remove()
    activeElement = null
    const wrapper = document.querySelector('div.de-wrapper')
    if (wrapper) {
      wrapper.parentNode?.insertBefore(wrapper.children[1], wrapper)
      wrapper.remove()
    }
  }

  if (typeof targetOrSelector === 'string') {
    selector = targetOrSelector
    if (selector) activeElement = document.querySelector(selector)
  } else if (targetOrSelector) {
    activeElement = targetOrSelector
    selector = getSelectorString(activeElement)
  } else {
    console.warn('targetOrSelector null')
    return
  }

  if (!activeElement) {
    ipcRenderer.send(MainIpcChannel.BlurElement, PROJECTID)
    return
  }

  const codePosition = activeElement.getAttribute(dataCode)
  if (!codePosition) {
    alert('This element does not support deraelize update')
    return
  }

  const { className, tagName } = activeElement

  const payload: ElementPayload = { projectId: PROJECTID, codePosition, className, selector }
  ipcRenderer.send(MainIpcChannel.FocusElement, payload)
  activeElement.setAttribute('data-active', 'true')

  const actualStatus = respElementActualStatus()
  if (!actualStatus) throw new Error('actualStatus null')

  // const isEmptyElement = EmptyElement.includes(tagName.toLowerCase())

  // if (!isEmptyElement && actualStatus.position === 'static') {
  //   activeElement.style.cssText = 'position: relative'
  // }

  // // todo: for weapp...
  // if (ISWEAPP) return

  // if (isEmptyElement) {
  //   const wrapper = document.createElement('div')

  //   wrapper.className = `de-wrapper ${className}`
  //   wrapper.style.cssText = `
  //     display: ${actualStatus.display};
  //     position: ${actualStatus.position === 'static' ? 'relative' : actualStatus.position}`

  //   activeElement.parentNode?.insertBefore(wrapper, activeElement)
  //   wrapper.appendChild(activeElement)

  //   wrapper.insertAdjacentHTML('afterbegin', sectionHTML(wrapper.getBoundingClientRect().top < 26))
  // } else {
  //   activeElement.insertAdjacentHTML('afterbegin', sectionHTML(activeElement.getBoundingClientRect().top < 26))
  // }

  // activeElement.querySelector('ul.de-section i.de-delete')?.addEventListener('click', (e) => {
  //   e.stopPropagation()
  //   ipcRenderer.send(MainIpcChannel.ElementShortcut, 'Delete', codePosition)
  // })
  // activeElement.querySelector('ul.de-section i.de-insert')?.addEventListener('click', (e) => {
  //   e.stopPropagation()
  //   ipcRenderer.send(MainIpcChannel.ControllerShortcut, 'Alt+9')
  // })

  // const tags = DropzoneTags
  // if (tagName === 'LI') {
  //   tags.push('ul')
  //   tags.push('ol')
  // }

  // console.log('droppable?.destroy()')
  // droppable?.destroy()
  // droppable = new Droppable(document.querySelectorAll('body > *'), {
  //   draggable: isEmptyElement ? 'div.de-wrapper' : '[data-active]',
  //   handle: isEmptyElement ? 'div.de-wrapper i.de-handle' : '[data-active] i.de-handle',
  //   dropzone: tags.map((t) => `${t}:not([data-active])`).join(','),
  // })
  // droppable.on('droppable:dropped', (e: DroppableDroppedEvent) => {
  //   // console.log('dropped:dragEvent:source', e.dragEvent.source)
  //   // console.log('dropped:dragEvent:originalSource', e.dragEvent.originalSource)
  //   // console.log('dropped:dropzone', e.dropzone)

  //   const dropzoneCodePosition = e.dropzone.getAttribute(dataCode)
  //   if (!PROJECTID || !dropzoneCodePosition) return
  //   const mpayload: ElementPayload = {
  //     projectId: PROJECTID,
  //     codePosition,
  //     dropzoneCodePosition,
  //     className,
  //     selector: selector || '',
  //   }
  //   ipcRenderer.send(MainIpcChannel.Dropped, mpayload)
  // })
  // droppable.on('droppable:returned', () => console.log('droppable:returned'))
}

const derealizeListener = (e: Event) => {
  if (!e.currentTarget || !PROJECTID) return
  e.stopPropagation() // todo:anti-bounce function instead of stopPropagation()

  if (e.type === 'click') {
    const href = (e.currentTarget as HTMLElement).getAttribute('href')
    if (href) return
  }
  inspectActiveElement(e.currentTarget as HTMLElement)
}

ipcRenderer.on(
  MainIpcChannel.LiveUpdateClass,
  (event: Event, sel: string, className: string, needRespStatus: boolean) => {
    if (activeElement && sel === selector) {
      activeElement.className = className
      if (needRespStatus) {
        respElementActualStatus() // performance considerations
      }
    } else {
      const element = document.querySelector(sel) as HTMLElement
      if (element) {
        element.className = className
      }
    }
  },
)

ipcRenderer.on(MainIpcChannel.LiveUpdateText, (event: Event, sel: string, text: string) => {
  if (activeElement && sel === selector) {
    activeElement.innerText = text
    respElementActualStatus()
  } else {
    const element = document.querySelector(sel) as HTMLElement
    if (element) {
      element.innerText = text
    }
  }
})

ipcRenderer.on(MainIpcChannel.LiveUpdateTag, (event: Event, sel: string, tag: ElementTag) => {
  if (activeElement && sel === selector) {
    changeTag(activeElement, tag)
    respElementActualStatus()
  } else {
    const element = document.querySelector(sel) as HTMLElement
    if (element) {
      changeTag(element, tag)
    }
  }
})

ipcRenderer.on(MainIpcChannel.SelectBreadcrumb, (event: Event, { projectId, index, isClick }: BreadcrumbPayload) => {
  if (projectId !== PROJECTID || !selector) return
  hoverElement?.removeAttribute('data-hover')

  const sels = selector.split('>')
  const sel = sels.slice(0, index + 1).join('>')

  const target = document.querySelector(sel)
  if (target) {
    if (isClick) {
      inspectActiveElement(target as HTMLElement)
    } else {
      hoverElement = target
      hoverElement.setAttribute('data-hover', 'true')
    }
  }
})

ipcRenderer.on(MainIpcChannel.DisableLink, (event: Event, isDisable: boolean) => {
  GetStyleClass('a').pointerEvents = isDisable ? 'none' : ''
})

const listenElement = () => {
  document.querySelectorAll(`[${dataCode}]`).forEach((el) => {
    el.removeEventListener('click', derealizeListener)
    el.addEventListener('click', derealizeListener)
    el.removeEventListener('contextmenu', derealizeListener)
    el.addEventListener('contextmenu', derealizeListener)
    // Repeat execution inspectActiveElement()
    // el.removeEventListener('focus', derealizeListener)
    // el.addEventListener('focus', derealizeListener)
  })
}

// document.addEventListener('DOMContentLoaded', () => {
//   const style = document.createElement('style')
//   style.appendChild(document.createTextNode(preloadCSS))
//   document.head.appendChild(style)
//   listenElement()
// })

ipcRenderer.on(MainIpcChannel.LoadFinish, (event: Event, socketId, projectId, isWeapp, activeSelector) => {
  PROJECTID = projectId
  ISWEAPP = isWeapp
  dataCode = isWeapp ? 'title' : 'data-code'
  connectSocket(socketId)

  const style = document.createElement('style')
  style.appendChild(document.createTextNode(preloadCSS))
  document.head.appendChild(style)
  listenElement()

  inspectActiveElement(activeSelector)
})

contextBridge.exposeInMainWorld('derealize', {
  isDarwin: process.platform === 'darwin',
  listenElement,
})
