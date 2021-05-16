// <li class="de-button" title="text">
//   <i class="de-icon de-text" aria-hidden="true"> ✎ </i>
// </li>
export const sectionText = (inside: boolean) => `
<ul class="de-section ${inside ? 'de-inside' : ''}">
  <li class="de-button" title="insert">
    <i class="de-icon de-insert" aria-hidden="true"> ✚ </i>
  </li>
  <li class="de-button" title="draggable">
    <i class="de-icon de-handle" aria-hidden="true"> <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8284 6.34313L16.2426 4.92892L12 0.686279L7.75735 4.92892L9.17156 6.34313L12 3.51471L14.8284 6.34313Z" fill="currentColor" /><path d="M4.92892 16.2426L6.34313 14.8284L3.51471 12L6.34313 9.17156L4.92892 7.75735L0.686279 12L4.92892 16.2426Z" fill="currentColor" /><path d="M7.75735 19.0711L12 23.3137L16.2426 19.0711L14.8284 17.6568L12 20.4853L9.17156 17.6568L7.75735 19.0711Z" fill="currentColor" /><path d="M17.6568 9.17156L20.4853 12L17.6568 14.8284L19.0711 16.2426L23.3137 12L19.0711 7.75735L17.6568 9.17156Z" fill="currentColor" /><path fill-rule="evenodd" clip-rule="evenodd" d="M12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8ZM12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10Z" fill="currentColor" /></svg></i>
  </li>
  <li class="de-button" title="delete">
    <i class="de-icon de-delete" aria-hidden="true"> 🗙 </i>
  </li>
</ul>
`

export const cssText = `
[data-hover],
[data-code]:hover {
  box-shadow: 0 0 0 2px #e2e8f0;
}
[data-active] {
  box-shadow: 0 0 0 2px #4fd1c5 !important;
}

i.de-icon {
  font-size: 14px;
  width: 30px;
  height: 24px;
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  font-style: normal;
  color: white;
  text-align: center;
  user-select:none;
}

.de-section {
  position: absolute;
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  height: 24px;
  line-height: 20px;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  background-color: #4fd1c5;
  border-radius: 5px 5px 0 0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.de-section .de-button:hover {
  background-color: #38B2AC;
}

.de-section .de-button:first-child {
  border-radius: 5px 0 0 0;
}

.de-section .de-button:first-child:before {
  content: '';
  position: absolute;
  top: 2px;
  border: solid transparent;
  border-right: solid #4fd1c5;
  border-width: 22px 12px 0 0;
  right: calc(100% - 1px);
}

.de-section .de-button:first-child:hover:before {
  border-right-color: #38B2AC;
}

.de-section .de-button:last-child {
  border-radius: 0 5px 0 0;
}

.de-section .de-button:last-child:after {
  content: '';
  position: absolute;
  top: 2px;
  border: solid transparent;
  border-left: solid #4fd1c5;
  border-width: 22px 0 0 12px;
  left: calc(100% - 1px);
}

.de-section .de-button:last-child:hover:after {
  border-left-color: #38B2AC;
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
