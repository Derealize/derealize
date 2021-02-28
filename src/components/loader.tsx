import React from 'react'
import cs from 'classnames'
import css from './loader.module.scss'

type Params = { type: number; gray?: boolean }

// https://codepen.io/Katrine-Marie/pen/pJgZBo
const Loader1: React.FC<Params> = ({ type, gray }: Params): JSX.Element => {
  return (
    <>
      <svg className={css.loaderSvg}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
          </filter>
        </defs>
      </svg>

      {type === 1 && (
        <div className={cs(css.container, css.goo1, { [css.gray]: gray })}>
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      )}

      {type === 2 && (
        <div className={cs(css.container, css.goo2, { [css.gray]: gray })}>
          <div />
          <div />
          <div />
          <div />
          <div />
        </div>
      )}
    </>
  )
}

Loader1.defaultProps = {
  gray: false,
}

export default Loader1
