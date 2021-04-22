import { ipcRenderer, contextBridge } from 'electron'
import 'selector-generator'
// import { connectSocket, sendBackIpc, listenBackIpc } from './client-ipc'
import { ElementPayload, SelectPayload, MainIpcChannel } from './interface'

let PROJECTID: string | undefined
let selector: string | undefined
let activeElement: Element | null = null
let hoverElement: Element | null = null
const css = `
  [data-hover], [data-code]:hover {
    box-shadow: 0 0 0 2px #e2e8f0;
  }
  [data-active] {
    box-shadow: 0 0 0 2px #4fd1c5 !important;
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
    activeElement = document.querySelector(selector)
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

  activeElement.setAttribute('data-active', 'true')

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

  if (activeElement.parentElement) {
    payload.parentTagName = activeElement.parentElement.tagName
    const parentDeclaration = getComputedStyle(activeElement.parentElement)
    payload.parentDisplay = parentDeclaration.getPropertyValue('display')
  }

  ipcRenderer.send(MainIpcChannel.FocusElement, payload)
}

ipcRenderer.on('setParams', async (event: Event, { socketId, projectId, activeSelector }: Record<string, string>) => {
  PROJECTID = projectId
  // connectSocket(socketId)
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
