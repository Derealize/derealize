// <li class="de-button ui-sortable-handle" title="handle">
//   <i class="de-icon de-handle" aria-hidden="true"> ☷ </i>
// </li>
export const sectionText = (inside: boolean, text: boolean) => `
<ul class="de-section ${inside ? 'de-inside' : ''}">
  <li class="de-button" title="insert">
    <i class="de-icon de-insert" aria-hidden="true"> ✚ </i>
  </li>
  ${
    text
      ? `<li class="de-button" title="text">
    <i class="de-icon de-text" aria-hidden="true"> ✎ </i>
  </li>`
      : ''
  }
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
  display: inline-block;
  cursor: pointer;
  font-style: normal;
  color: white;
  text-align: center;
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
