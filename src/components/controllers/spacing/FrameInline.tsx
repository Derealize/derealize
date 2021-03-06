import React, { useMemo, useState, useContext } from 'react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { Target } from './Frame'
import style from './Frame.module.scss'

const FrameInline: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)

  const mxValues = useStoreState<Array<string>>((state) => state.spacing.marginXValues)
  const mxPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginXPropertys)
  const mxProperty = useComputeProperty(mxPropertys)

  const mlValues = useStoreState<Array<string>>((state) => state.spacing.marginLeftValues)
  const mlPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginLeftPropertys)
  const mlProperty = useComputeProperty(mlPropertys)

  const mrValues = useStoreState<Array<string>>((state) => state.spacing.marginRightValues)
  const mrPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginRightPropertys)
  const mrProperty = useComputeProperty(mrPropertys)

  const pValues = useStoreState<Array<string>>((state) => state.spacing.paddingValues)
  const pPropertys = useStoreState<Array<Property>>((state) => state.spacing.paddingPropertys)
  const pProperty = useComputeProperty(pPropertys)

  const pyValues = useStoreState<Array<string>>((state) => state.spacing.paddingYValues)
  const pyPropertys = useStoreState<Array<Property>>((state) => state.spacing.paddingYPropertys)
  const pyProperty = useComputeProperty(pyPropertys)

  const pxValues = useStoreState<Array<string>>((state) => state.spacing.paddingXValues)
  const pxPropertys = useStoreState<Array<Property>>((state) => state.spacing.paddingXPropertys)
  const pxProperty = useComputeProperty(pxPropertys)

  const ptValues = useStoreState<Array<string>>((state) => state.spacing.paddingTopValues)
  const ptPropertys = useStoreState<Array<Property>>((state) => state.spacing.paddingTopPropertys)
  const ptProperty = useComputeProperty(ptPropertys)

  const pbValues = useStoreState<Array<string>>((state) => state.spacing.paddingBottomValues)
  const pbPropertys = useStoreState<Array<Property>>((state) => state.spacing.paddingBottomPropertys)
  const pbProperty = useComputeProperty(pbPropertys)

  const plValues = useStoreState<Array<string>>((state) => state.spacing.paddingLeftValues)
  const plPropertys = useStoreState<Array<Property>>((state) => state.spacing.paddingLeftPropertys)
  const plProperty = useComputeProperty(plPropertys)

  const prValues = useStoreState<Array<string>>((state) => state.spacing.paddingRightValues)
  const prPropertys = useStoreState<Array<Property>>((state) => state.spacing.paddingRightPropertys)
  const prProperty = useComputeProperty(prPropertys)

  const [selValues, setSelValues] = useState<Array<string>>([])

  const [target, setTarget] = useState<Target | undefined>()
  const selProperty = useMemo<Property | undefined>(() => {
    switch (target) {
      case Target.mx:
        return mxProperty
      case Target.ml:
        return mlProperty
      case Target.mr:
        return mrProperty
      case Target.p:
        return pProperty
      case Target.py:
        return pyProperty
      case Target.px:
        return pxProperty
      case Target.pt:
        return ptProperty
      case Target.pl:
        return plProperty
      case Target.pr:
        return prProperty
      case Target.pb:
        return pbProperty
      default:
        return undefined
    }
  }, [
    mlProperty,
    mrProperty,
    mxProperty,
    pProperty,
    pbProperty,
    plProperty,
    prProperty,
    ptProperty,
    pxProperty,
    pyProperty,
    target,
  ])

  const cleanPropertys = useMemo<Array<Property>>(() => {
    switch (target) {
      case Target.m:
        return [mxProperty, mlProperty, mrProperty].filter(Boolean) as Array<Property>
      case Target.mx:
        return [mlProperty, mrProperty].filter(Boolean) as Array<Property>
      case Target.mt:
      case Target.mb:
      case Target.ml:
      case Target.mr:
        return []
      case Target.p:
        return [pyProperty, pxProperty, ptProperty, pbProperty, plProperty, prProperty].filter(
          Boolean,
        ) as Array<Property>
      case Target.py:
        return [ptProperty, pbProperty].filter(Boolean) as Array<Property>
      case Target.px:
        return [plProperty, prProperty].filter(Boolean) as Array<Property>
      case Target.pt:
      case Target.pl:
      case Target.pr:
      case Target.pb:
        return []
      default:
        return []
    }
  }, [
    mlProperty,
    mrProperty,
    mxProperty,
    pbProperty,
    plProperty,
    prProperty,
    ptProperty,
    pxProperty,
    pyProperty,
    target,
  ])

  const [mxHover, setMxHover] = useState(false)
  const [mlHover, setMlHover] = useState(false)
  const [mrHover, setMrHover] = useState(false)
  const [pHover, setPHover] = useState(false)
  const [pyHover, setPyHover] = useState(false)
  const [pxHover, setPxHover] = useState(false)
  const [ptHover, setPtHover] = useState(false)
  const [pbHover, setPbHover] = useState(false)
  const [plHover, setPlHover] = useState(false)
  const [prHover, setPrHover] = useState(false)

  if (
    already &&
    !mlProperty &&
    !mrProperty &&
    !mxProperty &&
    !pProperty &&
    !pbProperty &&
    !plProperty &&
    !prProperty &&
    !ptProperty &&
    !pxProperty &&
    !pyProperty
  )
    return <></>

  return (
    <div className={style.component}>
      <div className={cs(style.frame, style.inline)}>
        <div
          className={cs(style.ml_row_span3, {
            [style.active]: target === Target.m || target === Target.mx || target === Target.ml,
          })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(mlValues)
            setTarget(Target.ml)
          }}
          onMouseEnter={() => setMlHover(true)}
          onMouseLeave={() => setMlHover(false)}
        >
          <span className={cs(style.ml_value)}>{mlProperty?.classname || mxProperty?.classname}</span>
          <div
            className={cs(style.stick, { [style.hover]: mxHover })}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(mxValues)
              setTarget(Target.mx)
            }}
            onMouseEnter={() => setMxHover(true)}
            onMouseLeave={() => setMxHover(false)}
          />
        </div>

        <div
          className={cs(style.ptl, {
            [style.active]:
              target === Target.p ||
              target === Target.py ||
              target === Target.px ||
              target === Target.pt ||
              target === Target.pl,
            [style.hover]: ptHover || plHover,
          })}
        />
        <div
          className={cs(style.pt, {
            [style.active]: target === Target.p || target === Target.py || target === Target.pt,
          })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(ptValues)
            setTarget(Target.pt)
          }}
          onMouseEnter={() => setPtHover(true)}
          onMouseLeave={() => setPtHover(false)}
        >
          <span className={cs(style.pt_value)}>
            {ptProperty?.classname || pyProperty?.classname || pProperty?.classname}
          </span>
          <div
            className={cs(style.stick, { [style.hover]: pyHover })}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pyValues)
              setTarget(Target.py)
            }}
            onMouseEnter={() => setPyHover(true)}
            onMouseLeave={() => setPyHover(false)}
          />
        </div>
        <div
          className={cs(style.ptr, {
            [style.active]:
              target === Target.p ||
              target === Target.py ||
              target === Target.px ||
              target === Target.pt ||
              target === Target.pr,
            [style.hover]: ptHover || prHover,
          })}
        />

        <div
          className={cs(style.mr_row_span3, {
            [style.active]: target === Target.m || target === Target.mx || target === Target.mr,
          })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(mrValues)
            setTarget(Target.mr)
          }}
          onMouseEnter={() => setMrHover(true)}
          onMouseLeave={() => setMrHover(false)}
        >
          <span className={cs(style.mr_value)}>{mrProperty?.classname || mxProperty?.classname}</span>
          <div
            className={cs(style.stick, { [style.hover]: mxHover })}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(mxValues)
              setTarget(Target.mx)
            }}
            onMouseEnter={() => setMxHover(true)}
            onMouseLeave={() => setMxHover(false)}
          />
        </div>

        <div
          className={cs(style.pl, {
            [style.active]: target === Target.p || target === Target.px || target === Target.pl,
          })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(plValues)
            setTarget(Target.pl)
          }}
          onMouseEnter={() => setPlHover(true)}
          onMouseLeave={() => setPlHover(false)}
        >
          <span className={cs(style.pl_value)}>
            {plProperty?.classname || pxProperty?.classname || pProperty?.classname}
          </span>
          <div
            className={cs(style.stick, { [style.hover]: pxHover })}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pxValues)
              setTarget(Target.px)
            }}
            onMouseEnter={() => setPxHover(true)}
            onMouseLeave={() => setPxHover(false)}
          />
        </div>
        <div className={style.center}>
          <div
            className={cs(style.stick, style.stick_py, { [style.hover]: pHover })}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pValues)
              setTarget(Target.p)
            }}
            onMouseEnter={() => setPHover(true)}
            onMouseLeave={() => setPHover(false)}
          />
          <div
            className={cs(style.stick, style.stick_px, { [style.hover]: pHover })}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pValues)
              setTarget(Target.p)
            }}
            onMouseEnter={() => setPHover(true)}
            onMouseLeave={() => setPHover(false)}
          />
        </div>
        <div
          className={cs(style.pr, {
            [style.active]: target === Target.p || target === Target.px || target === Target.pr,
          })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(prValues)
            setTarget(Target.pr)
          }}
          onMouseEnter={() => setPrHover(true)}
          onMouseLeave={() => setPrHover(false)}
        >
          <span className={cs(style.pr_value)}>
            {prProperty?.classname || pxProperty?.classname || pProperty?.classname}
          </span>
          <div
            className={cs(style.stick, { [style.hover]: pxHover })}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pxValues)
              setTarget(Target.px)
            }}
            onMouseEnter={() => setPxHover(true)}
            onMouseLeave={() => setPxHover(false)}
          />
        </div>

        <div
          className={cs(style.pbl, {
            [style.active]:
              target === Target.p ||
              target === Target.py ||
              target === Target.px ||
              target === Target.pb ||
              target === Target.pl,
            [style.hover]: pbHover || plHover,
          })}
        />
        <div
          className={cs(style.pb, {
            [style.active]: target === Target.p || target === Target.py || target === Target.pb,
          })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(pbValues)
            setTarget(Target.pb)
          }}
          onMouseEnter={() => setPbHover(true)}
          onMouseLeave={() => setPbHover(false)}
        >
          <span className={cs(style.pb_value)}>
            {pbProperty?.classname || pyProperty?.classname || pProperty?.classname}
          </span>
          <div
            className={cs(style.stick, { [style.hover]: pyHover })}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pyValues)
              setTarget(Target.py)
            }}
            onMouseEnter={() => setPyHover(true)}
            onMouseLeave={() => setPyHover(false)}
          />
        </div>
        <div
          className={cs(style.pbr, {
            [style.active]:
              target === Target.p ||
              target === Target.py ||
              target === Target.px ||
              target === Target.pb ||
              target === Target.pr,
            [style.hover]: pbHover || prHover,
          })}
        />
      </div>

      <SelectController
        placeholder={selValues[0]?.split('-')[0]}
        values={selValues}
        property={selProperty}
        cleanPropertys={cleanPropertys}
      />
    </div>
  )
}

export default FrameInline
