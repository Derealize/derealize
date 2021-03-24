import React, { useState, useEffect } from 'react'
import cs from 'classnames'
import { css } from '@emotion/react'
import type { Project } from '../../models/project'
import { StateVariants, ListVariants, AlreadyVariants } from '../../models/controlles'
import { useStoreActions, useStoreState } from '../../reduxStore'
import style from './Variants.module.scss'
import type { PreloadWindow } from '../../preload'

declare const window: PreloadWindow

type Props = {
  alreadyVariants: AlreadyVariants
}

const Variants: React.FC<Props> = ({ alreadyVariants }: Props): JSX.Element => {
  const screenVariants = useStoreState<Array<string>>((state) => state.controlles.screenVariants)
  const selectScreenVariant = useStoreState<string | null>((state) => state.controlles.selectScreenVariant)
  const setSelectScreenVariant = useStoreActions((actions) => actions.controlles.setSelectScreenVariant)

  const selectStateVariant = useStoreState<string | null>((state) => state.controlles.selectStateVariant)
  const setSelectStateVariant = useStoreActions((actions) => actions.controlles.setSelectStateVariant)

  const selectListVariant = useStoreState<string | null>((state) => state.controlles.selectListVariant)
  const setSelectListVariant = useStoreActions((actions) => actions.controlles.setSelectListVariant)

  const customVariants = useStoreState<Array<string>>((state) => state.controlles.customVariants)
  const selectCustomVariant = useStoreState<string | null>((state) => state.controlles.selectCustomVariant)
  const setSelectCustomVariant = useStoreActions((actions) => actions.controlles.setSelectCustomVariant)

  return (
    <div className={style.variants}>
      <div className={style.screenVariants}>
        {screenVariants.map((screen) => (
          <span
            key={screen}
            className={cs(style.option, {
              [style.active]: screen === selectScreenVariant,
              [style.already]: alreadyVariants.screens.includes(screen),
            })}
            onClick={() => setSelectScreenVariant(screen)}
            aria-hidden="true"
          >
            :{screen}
          </span>
        ))}
      </div>
      <div className={style.stateVariants}>
        {StateVariants.map((state) => (
          <span
            key={state}
            className={cs(style.option, {
              [style.active]: state === selectStateVariant,
              [style.already]: alreadyVariants.states.includes(state),
            })}
            onClick={() => setSelectStateVariant(state)}
            aria-hidden="true"
          >
            :{state}
          </span>
        ))}
      </div>
      <div className={style.listVariants}>
        {ListVariants.map((variant) => (
          <span
            key={variant}
            className={cs(style.option, {
              [style.active]: variant === selectListVariant,
              [style.already]: alreadyVariants.lists.includes(variant),
            })}
            onClick={() => setSelectListVariant(variant)}
            aria-hidden="true"
          >
            :{variant}
          </span>
        ))}
      </div>
      {!!customVariants.length && (
        <div className={style.customVariants}>
          {customVariants.map((variant) => (
            <span
              key={variant}
              className={cs(style.option, {
                [style.active]: variant === selectCustomVariant,
                [style.already]: alreadyVariants.customs.includes(variant),
              })}
              onClick={() => setSelectCustomVariant(variant)}
              aria-hidden="true"
            >
              :{variant}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default Variants
