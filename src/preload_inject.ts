import { ipcRenderer, contextBridge } from 'electron'
import 'selector-generator'
import { connectSocket, send, listen } from './client-ipc'
import { ElementPayload, SelectPayload, MainIpcChannel } from './interface'

let PROJECTID: string | undefined
let selector: string | undefined
let activeElement: Element | null = null
let hoverElement: Element | null = null
const css = `
  [data-hover], [data-code]:hover {
    box-shadow: 0 0 0 2px #4fd1c5;
  }
  [data-active] {
    box-shadow: 0 0 0 2px #319795;
  }
`

const generator = new (window as any).SelectorGenerator()
const getSelectorString = (el: Element): string => {
  return generator.getPath(el).replace('html body ', '').split(' ').join('>')
}

const InspectActiveElement = async (activeSelector?: string): Promise<void> => {
  if (!PROJECTID) return

  selector = activeSelector
  if (selector) {
    // console.log('InspectActiveElement', selector)
    activeElement = document.querySelector(selector)
  }

  if (!activeElement) {
    // await send(Handler.FocusElement, { projectId: PROJECTID, tagName: '' })
    ipcRenderer.send(MainIpcChannel.FocusElement, { projectId: PROJECTID, tagName: '', selector: '' })
    return
  }

  const codePosition = activeElement.getAttribute('data-code')
  if (!codePosition) {
    alert('This element does not support deraelize update')
    return
  }

  activeElement.setAttribute('data-active', 'true')

  if (!selector) {
    selector = getSelectorString(activeElement)
    // console.log('selector', selector)
  }

  const { tagName, className } = activeElement
  const payload: ElementPayload = { projectId: PROJECTID, codePosition, className, tagName, selector }

  const declaration = getComputedStyle(activeElement)
  payload.display = declaration.getPropertyValue('display')
  payload.position = declaration.getPropertyValue('position')

  if (activeElement.parentElement) {
    payload.parentTagName = activeElement.parentElement.tagName
    const parentDeclaration = getComputedStyle(activeElement.parentElement)
    payload.parentDisplay = parentDeclaration.getPropertyValue('display')
  }

  ipcRenderer.send(MainIpcChannel.FocusElement, payload)
  // await send(Handler.FocusElement, payload as any)
}

ipcRenderer.on('setParams', async (event: Event, { socketId, projectId, activeSelector }: Record<string, string>) => {
  // console.log('setParams', socketId, projectId, activeSelector)
  PROJECTID = projectId
  connectSocket(socketId)
  await InspectActiveElement(activeSelector)
})

const derealizeListener = async (e: Event) => {
  if (!e.target || !PROJECTID) return
  e.stopPropagation() // todo:用防反跳函数代替 stopPropagation()

  activeElement?.removeAttribute('data-active')
  activeElement = e.target as HTMLElement
  await InspectActiveElement()
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
      activeElement?.removeAttribute('data-active')
      activeElement = target
      InspectActiveElement()
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
  style.appendChild(document.createTextNode(css))
  document.head.appendChild(style)
  listenElement()
})

contextBridge.exposeInMainWorld('derealize', {
  isMac: process.platform === 'darwin',
  isDev: process.env.NODE_ENV === 'development',
  listenElement,
})
