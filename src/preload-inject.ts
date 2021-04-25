import { ipcRenderer, contextBridge } from 'electron'
import 'selector-generator'
import { connectSocket, sendBackIpc, listenBackIpc } from './client-ipc'
import { Handler } from './backend/backend.interface'
import { ElementPayload, SelectPayload, MainIpcChannel } from './interface'
import { cssText, sectionText } from './preload-inject-code'

let PROJECTID: string | undefined
let selector: string | undefined
let activeElement: HTMLElement | null = null
let hoverElement: Element | null = null

const generator = new (window as any).SelectorGenerator()
const getSelectorString = (el: Element): string => {
  return generator.getPath(el).replace('html body ', '').split(' ').join('>')
}

const InspectActiveElement = async (targetOrSelector?: string | HTMLElement): Promise<void> => {
  if (!PROJECTID) return

  if (activeElement) {
    activeElement.removeAttribute('data-active')
    activeElement.querySelector('ul.de-section')?.remove()
  }

  if (typeof targetOrSelector === 'string') {
    selector = targetOrSelector
    if (selector) {
      activeElement = document.querySelector(selector)
    }
  } else if (targetOrSelector) {
    activeElement = targetOrSelector
  }

  if (!activeElement) {
    ipcRenderer.send(MainIpcChannel.FocusElement, { projectId: PROJECTID, tagName: '', selector: '' })
    return
  }

  const codePosition = activeElement.getAttribute('data-code')
  if (!codePosition) {
    alert('This element does not support deraelize update')
    return
  }

  if (!selector) {
    selector = getSelectorString(activeElement)
    // console.log('selector', selector)
  }

  const { tagName, className } = activeElement
  const payload: ElementPayload = { projectId: PROJECTID, codePosition, className, tagName, selector }

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
  activeElement.insertAdjacentHTML('afterbegin', sectionText(activeElement.offsetTop < 26))
  activeElement.querySelector('ul.de-section i.de-delete')?.addEventListener('click', async (e) => {
    e.stopPropagation()
    if (window.confirm('Sure Delete?')) {
      await sendBackIpc(Handler.DeleteElement, { projectId: PROJECTID, codePosition })
    }
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

ipcRenderer.on(MainIpcChannel.SelectElement, async (event: Event, { projectId, index, isClick }: SelectPayload) => {
  if (projectId !== PROJECTID || !selector) return
  hoverElement?.removeAttribute('data-hover')

  const sels = selector.split('>')
  const sel = sels.slice(0, index + 1).join('>')

  // console.log('SelectElement', sel)
  const target = document.querySelector(sel)
  if (target) {
    if (isClick) {
      InspectActiveElement(target as HTMLElement)
    } else {
      hoverElement = target
      hoverElement.setAttribute('data-hover', 'true')
    }
  }
})

const listenElement = async () => {
  document.querySelectorAll('[data-code]').forEach((el) => {
    el.removeEventListener('click', derealizeListener)
    el.addEventListener('click', derealizeListener)

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
