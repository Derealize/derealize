import React, { useMemo, useState, useContext } from 'react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'
import style from './Frame.module.scss'

enum Target {
  m,
  my,
  mx,
  mt,
  mb,
  ml,
  mr,
  p,
  py,
  px,
  pt,
  pb,
  pl,
  pr,
}

const Frame: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const mValues = useStoreState<Array<string>>((state) => state.spacing.marginValues)
  const mPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginPropertys)
  const mProperty = useComputeProperty(mPropertys)

  const myValues = useStoreState<Array<string>>((state) => state.spacing.marginYValues)
  const myPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginYPropertys)
  const myProperty = useComputeProperty(myPropertys)

  const mxValues = useStoreState<Array<string>>((state) => state.spacing.marginXValues)
  const mxPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginXPropertys)
  const mxProperty = useComputeProperty(mxPropertys)

  const mtValues = useStoreState<Array<string>>((state) => state.spacing.marginTopValues)
  const mtPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginTopPropertys)
  const mtProperty = useComputeProperty(mtPropertys)

  const mbValues = useStoreState<Array<string>>((state) => state.spacing.marginBottomValues)
  const mbPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginBottomPropertys)
  const mbProperty = useComputeProperty(mbPropertys)

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
      case Target.m:
        return mProperty
      case Target.my:
        return myProperty
      case Target.mx:
        return mxProperty
      case Target.mt:
        return mtProperty
      case Target.ml:
        return mlProperty
      case Target.mr:
        return mrProperty
      case Target.mb:
        return mbProperty
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
    mProperty,
    mbProperty,
    mlProperty,
    mrProperty,
    mtProperty,
    mxProperty,
    myProperty,
    pProperty,
    pbProperty,
    plProperty,
    prProperty,
    ptProperty,
    pxProperty,
    pyProperty,
    target,
  ])

  const cleanPropertys = useMemo<Array<Property | undefined>>(() => {
    switch (target) {
      case Target.m:
        return [myProperty, mxProperty, mtProperty, mbProperty, mlProperty, mrProperty]
      case Target.my:
        return [mtProperty, mbProperty]
      case Target.mx:
        return [mlProperty, mrProperty]
      case Target.mt:
      case Target.mb:
      case Target.ml:
      case Target.mr:
        return []
      case Target.p:
        return [pyProperty, pxProperty, ptProperty, pbProperty, plProperty, prProperty]
      case Target.py:
        return [ptProperty, pbProperty]
      case Target.px:
        return [plProperty, prProperty]
      case Target.pt:
      case Target.pl:
      case Target.pr:
      case Target.pb:
        return []
      default:
        return []
    }
  }, [
    mbProperty,
    mlProperty,
    mrProperty,
    mtProperty,
    mxProperty,
    myProperty,
    pbProperty,
    plProperty,
    prProperty,
    ptProperty,
    pxProperty,
    pyProperty,
    target,
  ])

  const [mtHover, setMtHover] = useState(false)
  const [mbHover, setMbHover] = useState(false)
  const [mlHover, setMlHover] = useState(false)
  const [mrHover, setMrHover] = useState(false)
  const [ptHover, setPtHover] = useState(false)
  const [pbHover, setPbHover] = useState(false)
  const [plHover, setPlHover] = useState(false)
  const [prHover, setPrHover] = useState(false)

  if (already || !element) return <></>

  return (
    <div className={style.component}>
      <div className={style.frame}>
        <div
          className={cs(style.mtl, {
            [style.active]:
              target === Target.m ||
              target === Target.my ||
              target === Target.mx ||
              target === Target.mt ||
              target === Target.ml,
            [style.hover]: mtHover || mlHover,
          })}
        />
        <div
          className={cs(style.mt_column_span3, {
            [style.active]: target === Target.m || target === Target.my || target === Target.mt,
          })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(mtValues)
            setTarget(Target.mt)
          }}
          onMouseEnter={() => setMtHover(true)}
          onMouseLeave={() => setMtHover(false)}
        >
          <span>{mtProperty?.classname || myProperty?.classname || mProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(myValues)
              setTarget(Target.my)
            }}
          />
        </div>
        <div
          className={cs(style.mtr, {
            [style.active]:
              target === Target.m ||
              target === Target.my ||
              target === Target.mx ||
              target === Target.mt ||
              target === Target.mr,
            [style.hover]: mtHover || mrHover,
          })}
        />

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
          <span>{mlProperty?.classname || mxProperty?.classname || mProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(mxValues)
              setTarget(Target.mx)
            }}
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
          <span>{ptProperty?.classname || pyProperty?.classname || pProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pyValues)
              setTarget(Target.py)
            }}
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
          <span>{mrProperty?.classname || mxProperty?.classname || mProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(mxValues)
              setTarget(Target.mx)
            }}
          />
        </div>

        <div
          className={cs(style.pl, {
            [style.active]: target === Target.p || target === Target.px || target === Target.ml,
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
          <span>{plProperty?.classname || pxProperty?.classname || pProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pxValues)
              setTarget(Target.px)
            }}
          />
        </div>
        <div className={style.center} />
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
          <span>{prProperty?.classname || pxProperty?.classname || pProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pxValues)
              setTarget(Target.px)
            }}
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
          <span>{pbProperty?.classname || pyProperty?.classname || pProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(pyValues)
              setTarget(Target.py)
            }}
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

        <div
          className={cs(style.mbl, {
            [style.active]:
              target === Target.m ||
              target === Target.my ||
              target === Target.mx ||
              target === Target.mb ||
              target === Target.ml,
            [style.hover]: mbHover || mlHover,
          })}
        />
        <div
          className={cs(style.mb_column_span3, {
            [style.active]: target === Target.m || target === Target.mb || target === Target.my,
          })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(mbValues)
            setTarget(Target.mb)
          }}
          onMouseEnter={() => setMbHover(true)}
          onMouseLeave={() => setMbHover(false)}
        >
          <span>{mbProperty?.classname || myProperty?.classname || mProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(myValues)
              setTarget(Target.my)
            }}
          />
        </div>
        <div
          className={cs(style.mbr, {
            [style.active]:
              target === Target.m ||
              target === Target.my ||
              target === Target.mx ||
              target === Target.mb ||
              target === Target.mr,
            [style.hover]: mbHover || mrHover,
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

export default Frame
