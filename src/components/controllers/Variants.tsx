import React, { useState, useEffect } from 'react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { Project } from '../../models/project'
import { ElementStates } from '../../models/controlles'
import type { ContainerPropertys } from '../../models/controlles/layout'
import { useStoreActions, useStoreState } from '../../reduxStore'
import style from './Layout.module.scss'
import type { PreloadWindow } from '../../preload'

declare const window: PreloadWindow

type Props = {
  project: Project
}

const Variants: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const screens = useStoreState<Array<string>>((state) => state.controlles.screens)
  const selectResponsive = useStoreState<string | null>((state) => state.controlles.selectResponsive)
  const selectElementState = useStoreState<string | null>((state) => state.controlles.selectElementState)

  return (
    <div className={style.variants}>
      <div className={style.responsives}>
        {screens.map((screen) => (
          <span key={screen} className={cs(style.option, { [style.active]: screen === selectResponsive })}>
            :{screen}
          </span>
        ))}

        {ElementStates.map((states) => (
          <span key={states} className={cs(style.option, { [style.active]: states === selectElementState })}>
            :{states}
          </span>
        ))}
      </div>
    </div>
  )
}

export default Variants
