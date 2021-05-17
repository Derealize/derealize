import { ipcRenderer, contextBridge } from 'electron'
import { Droppable, DroppableEventNames, DroppableDroppedEvent } from '@shopify/draggable'
import 'selector-generator'
import { connectSocket, sendBackIpc } from './client-ipc'
import { EmptyElement, DropzoneTags } from './utils/assest'
import { Handler } from './backend/backend.interface'
import { ElementPayload, MoveElementPayload, ElementActualStatus, BreadcrumbPayload, MainIpcChannel } from './interface'
import { cssText, sectionText } from './preload-inject-code'

let PROJECTID: string | undefined
let ISWEAPP = false
let dataCode = 'data-code'
let selector: string | undefined
let activeElement: HTMLElement | null = null
let hoverElement: Element | null = null
let droppable: Droppable<DroppableEventNames> | undefined

const generator = new (window as any).SelectorGenerator()
const getSelectorString = (el: Element): string => {
  return generator.getPath(el).replace('html body ', '').split(' ').join('>')
}

const respElementActualStatus = () => {
  if (!PROJECTID || !activeElement) return
  const codePosition = activeElement.getAttribute(dataCode)
  if (!codePosition) return

  const { tagName, className } = activeElement
  const payload: ElementActualStatus = { projectId: PROJECTID, codePosition, className, tagName }

  // https://stackoverflow.com/a/11495671
  // getComputedStyle() 不支持伪类查询，任何伪类style都会被检索。目前只能使用tailwindcss classname
  // 但parentDeclaration还无法被tailwindcss classname取代
  const declaration = getComputedStyle(activeElement)
  payload.display = declaration.getPropertyValue('display')
  payload.position = declaration.getPropertyValue('position')
  payload.background = declaration.getPropertyValue('background-image')
  if (payload.position === 'static') {
    activeElement.style.cssText = 'position: relative'
  }

  if (activeElement.parentElement) {
    payload.parentTagName = activeElement.parentElement.tagName
    const parentDeclaration = getComputedStyle(activeElement.parentElement)
    payload.parentDisplay = parentDeclaration.getPropertyValue('display')
  }

  ipcRenderer.send(MainIpcChannel.RespElementStatus, payload)
}

const inspectActiveElement = (targetOrSelector: string | HTMLElement): void => {
  if (!PROJECTID) return

  selector = undefined
  if (activeElement) {
    activeElement.removeAttribute('data-active')
    activeElement.querySelector('ul.de-section')?.remove()
    activeElement = null
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

  const supportText = !activeElement.children.length && !EmptyElement.includes(tagName.toLowerCase())
  let text: string | undefined
  if (supportText) {
    text = activeElement.innerText
  }

  const payload: ElementPayload = { projectId: PROJECTID, codePosition, className, selector, text }
  ipcRenderer.send(MainIpcChannel.FocusElement, payload)
  activeElement.setAttribute('data-active', 'true')

  respElementActualStatus()
  if (ISWEAPP) return

  const viewportReact = activeElement.getBoundingClientRect()
  activeElement.insertAdjacentHTML('afterbegin', sectionText(viewportReact.top < 26))
  activeElement.querySelector('ul.de-section i.de-delete')?.addEventListener('click', (e) => {
    e.stopPropagation()
    if (window.confirm('Sure Delete?')) {
      sendBackIpc(Handler.DeleteElement, { projectId: PROJECTID, codePosition })
    }
  })
  activeElement.querySelector('ul.de-section i.de-insert')?.addEventListener('click', (e) => {
    e.stopPropagation()
    ipcRenderer.send(MainIpcChannel.InsertTab, true)
  })

  const tags = DropzoneTags
  if (tagName === 'LI') {
    tags.push('ul')
    tags.push('ol')
  }

  // console.log('droppable?.destroy()')
  droppable?.destroy()
  droppable = new Droppable(document.querySelectorAll('body > *'), {
    draggable: '[data-active]',
    handle: '[data-active] i.de-handle',
    dropzone: tags.map((t) => `${t}:not([data-active])`).join(','),
  })
  droppable.on('droppable:dropped', (e: DroppableDroppedEvent) => {
    console.log('dropped:dragEvent:source', e.dragEvent.source)
    console.log('dropped:dragEvent:originalSource', e.dragEvent.originalSource)
    console.log('dropped:dropzone', e.dropzone)

    const dropzoneCodePosition = e.dropzone.getAttribute(dataCode)
    if (!PROJECTID || !dropzoneCodePosition) return
    const mpayload: MoveElementPayload = {
      projectId: PROJECTID,
      codePosition,
      dropzoneCodePosition,
      className,
      selector: selector || '',
    }
    ipcRenderer.send(MainIpcChannel.Dropped, mpayload)
  })
  droppable.on('droppable:returned', () => console.log('droppable:returned'))
}

const derealizeListener = (e: Event) => {
  if (!e.currentTarget || !PROJECTID) return
  e.stopPropagation() // todo:用防反跳函数代替 stopPropagation()

  inspectActiveElement(e.currentTarget as HTMLElement)
}

ipcRenderer.on(MainIpcChannel.LiveUpdateClass, (event: Event, { projectId, className }: ElementPayload) => {
  if (projectId === PROJECTID && activeElement) {
    activeElement.className = className
    console.log('LiveUpdateClass', className)
    respElementActualStatus()
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

const listenElement = () => {
  document.querySelectorAll(`[${dataCode}]`).forEach((el) => {
    el.removeEventListener('click', derealizeListener)
    el.addEventListener('click', derealizeListener)
    el.removeEventListener('contextmenu', derealizeListener)
    el.addEventListener('contextmenu', derealizeListener)
    // 重复执行 inspectActiveElement 导致 droppable 不流畅
    // el.removeEventListener('focus', derealizeListener)
    // el.addEventListener('focus', derealizeListener)
  })
}

// document.addEventListener('DOMContentLoaded', () => {
//   const style = document.createElement('style')
//   style.appendChild(document.createTextNode(cssText))
//   document.head.appendChild(style)
//   listenElement()
// })

ipcRenderer.on('setParams', (event: Event, socketId, projectId, activeSelector, isWeapp) => {
  PROJECTID = projectId
  ISWEAPP = isWeapp
  dataCode = isWeapp ? 'title' : 'data-code'
  connectSocket(socketId)
  ipcRenderer.send(MainIpcChannel.Flush, PROJECTID)

  const style = document.createElement('style')
  style.appendChild(document.createTextNode(cssText))
  document.head.appendChild(style)
  listenElement()

  inspectActiveElement(activeSelector)
})

contextBridge.exposeInMainWorld('derealize', {
  isMac: process.platform === 'darwin',
  isDev: process.env.NODE_ENV === 'development',
  listenElement,
})
