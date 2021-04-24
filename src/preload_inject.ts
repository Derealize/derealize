import { ipcRenderer, contextBridge } from 'electron'
import 'selector-generator'
// import { connectSocket, sendBackIpc, listenBackIpc } from './client-ipc'
import { ElementPayload, SelectPayload, MainIpcChannel } from './interface'

const sectionText = `
<ul class="de-section">
  <li class="de-button" title="add">
    <i class="de-icon" aria-hidden="true"> ✚ </i>
  </li>
  <li class="de-button ui-sortable-handle" title="edit">
    <i class="de-icon" aria-hidden="true"> ☷ </i>
  </li>
  <li class="de-button" title="delete">
    <i class="de-icon" aria-hidden="true"> 🗙 </i>
  </li>
</ul>
`

const cssText = `
[data-hover],
[data-code]:hover {
  box-shadow: 0 0 0 2px #e2e8f0;
}
[data-active] {
  box-shadow: 0 0 0 2px #4fd1c5 !important;
}

i.de-icon {
  width: 32px;
  display: inline-block;
  cursor: pointer;
  font-style: normal;
  color: white;
  text-align: center;
}

.de-section {
  position: absolute;
  display: flex;
  height: 26px;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 24px;
  top: 1px;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  background-color: #71d7f7;
  border-radius: 5px 5px 0 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.de-section .de-button:hover {
  background-color: #10bcf2;
}

.de-section .de-button:first-child {
  border-radius: 5px 0 0 0;
}

.de-section .de-button:first-child:before {
  content: '';
  position: absolute;
  top: 2px;
  border: solid transparent;
  border-right: solid #71d7f7;
  border-width: 22px 12px 0 0;
  right: calc(100% - 1px);
}

.de-section .de-button:first-child:hover:before {
  border-right-color: #10bcf2;
}

.de-section .de-button:last-child {
  border-radius: 0 5px 0 0;
}

.de-section .de-button:last-child:after {
  content: '';
  position: absolute;
  top: 2px;
  border: solid transparent;
  border-left: solid #71d7f7;
  border-width: 22px 0 0 12px;
  left: calc(100% - 1px);
}

.de-section .de-button:last-child:hover:after {
  border-left-color: #10bcf2;
}

.de-section.de-inside {
  transform: translateX(-50%);
  border-radius: 0 0 5px 5px;
}

.de-section.de-inside .de-button:first-child {
  border-radius: 0 0 0 5px;
}

.de-section.de-inside .de-button:first-child:before {
  top: 0;
  border-width: 0 12px 22px 0;
}

.de-section.de-inside .de-button:last-child {
  border-radius: 0 0 5px 0;
}

.de-section.de-inside .de-button:last-child:after {
  top: 0;
  border-width: 0 0 22px 12px;
}
`

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

  activeElement.setAttribute('data-active', 'true')
  activeElement.insertAdjacentHTML('afterbegin', sectionText)

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
}

ipcRenderer.on('setParams', async (event: Event, { socketId, projectId, activeSelector }: Record<string, string>) => {
  PROJECTID = projectId
  // connectSocket(socketId)
  await InspectActiveElement(activeSelector)
})

const derealizeListener = async (e: Event) => {
  if (!e.target || !PROJECTID) return
  e.stopPropagation() // todo:用防反跳函数代替 stopPropagation()

  await InspectActiveElement(e.target as HTMLElement)
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
