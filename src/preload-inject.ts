import { ipcRenderer, contextBridge } from 'electron'
import 'selector-generator'
import { connectSocket, sendBackIpc, listenBackIpc } from './client-ipc'
import { Handler } from './backend/backend.interface'
import { ElementPayload, BreadcrumbPayload, MainIpcChannel } from './interface'
import { cssText, sectionText } from './preload-inject-code'

let PROJECTID: string | undefined
let selector: string | undefined
let activeElement: HTMLElement | null = null
let hoverElement: Element | null = null

// https://developer.mozilla.org/en-US/docs/Glossary/Empty_element
const EmptyElement = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]

const generator = new (window as any).SelectorGenerator()
const getSelectorString = (el: Element): string => {
  return generator.getPath(el).replace('html body ', '').split(' ').join('>')
}

const InspectActiveElement = async (targetOrSelector: string | HTMLElement): Promise<void> => {
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
    ipcRenderer.send(MainIpcChannel.BlurElement, { projectId: PROJECTID })
    return
  }

  const codePosition = activeElement.getAttribute('data-code')
  if (!codePosition) {
    alert('This element does not support deraelize update')
    return
  }

  const { tagName, className } = activeElement

  const supportText = !activeElement.children.length && !EmptyElement.includes(tagName.toLowerCase())
  let text: string | undefined
  if (supportText) {
    text = activeElement.innerText
  }
  const payload: ElementPayload = { projectId: PROJECTID, codePosition, className, tagName, selector, text }

  // https://stackoverflow.com/a/11495671
  // getComputedStyle() 不支持伪类查询，任何伪类style都会被检索。目前只能使用tailwindcss classname
  // 但parentDeclaration还无法被tailwindcss classname取代
  const declaration = getComputedStyle(activeElement)
  payload.display = declaration.getPropertyValue('display')
  payload.position = declaration.getPropertyValue('position')
  if (payload.position === 'static') {
    activeElement.style.cssText = 'position: relative'
  }

  if (activeElement.parentElement) {
    payload.parentTagName = activeElement.parentElement.tagName
    const parentDeclaration = getComputedStyle(activeElement.parentElement)
    payload.parentDisplay = parentDeclaration.getPropertyValue('display')
  }

  ipcRenderer.send(MainIpcChannel.FocusElement, payload)

  activeElement.setAttribute('data-active', 'true')
  const viewportReact = activeElement.getBoundingClientRect()
  activeElement.insertAdjacentHTML('afterbegin', sectionText(viewportReact.top < 26, supportText))
  activeElement.querySelector('ul.de-section i.de-delete')?.addEventListener('click', async (e) => {
    e.stopPropagation()
    if (window.confirm('Sure Delete?')) {
      await sendBackIpc(Handler.DeleteElement, { projectId: PROJECTID, codePosition })
    }
  })
  activeElement.querySelector('ul.de-section i.de-insert')?.addEventListener('click', async (e) => {
    e.stopPropagation()
    ipcRenderer.send(MainIpcChannel.InsertTab, true)
  })
  activeElement.querySelector('ul.de-section i.de-text')?.addEventListener('click', async (e) => {
    e.stopPropagation()
    ipcRenderer.send(MainIpcChannel.TextTab, true)
  })
}

ipcRenderer.on('setParams', async (event: Event, { socketId, projectId, activeSelector }: Record<string, string>) => {
  PROJECTID = projectId
  connectSocket(socketId)
  await InspectActiveElement(activeSelector)
})

const derealizeListener = async (e: Event) => {
  if (!e.currentTarget || !PROJECTID) return
  e.stopPropagation() // todo:用防反跳函数代替 stopPropagation()

  await InspectActiveElement(e.currentTarget as HTMLElement)
}

ipcRenderer.on(MainIpcChannel.LiveUpdateClass, async (event: Event, { projectId, className }: ElementPayload) => {
  if (projectId === PROJECTID && activeElement) {
    // console.log('LiveUpdateClass', className)
    activeElement.className = className
  }
})

ipcRenderer.on(
  MainIpcChannel.SelectBreadcrumb,
  async (event: Event, { projectId, index, isClick }: BreadcrumbPayload) => {
    if (projectId !== PROJECTID || !selector) return
    hoverElement?.removeAttribute('data-hover')

    const sels = selector.split('>')
    const sel = sels.slice(0, index + 1).join('>')

    const target = document.querySelector(sel)
    if (target) {
      if (isClick) {
        InspectActiveElement(target as HTMLElement)
      } else {
        hoverElement = target
        hoverElement.setAttribute('data-hover', 'true')
      }
    }
  },
)

const listenElement = async () => {
  document.querySelectorAll('[data-code]').forEach((el) => {
    el.removeEventListener('click', derealizeListener)
    el.addEventListener('click', derealizeListener)
    el.removeEventListener('focus', derealizeListener)
    el.addEventListener('focus', derealizeListener)
    el.removeEventListener('contextmenu', derealizeListener)
    el.addEventListener('contextmenu', derealizeListener)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style')
  style.appendChild(document.createTextNode(cssText))
  document.head.appendChild(style)
  listenElement()
})

contextBridge.exposeInMainWorld('derealize', {
  isMac: process.platform === 'darwin',
  isDev: process.env.NODE_ENV === 'development',
  listenElement,
})
