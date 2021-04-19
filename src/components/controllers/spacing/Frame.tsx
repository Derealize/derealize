import React, { useMemo, useState, useContext } from 'react'
import cs from 'classnames'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'
import style from './Frame.module.scss'

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
  const [selProperty, setSelProperty] = useState<Property | undefined>()
  const [cleanPropertys, setCleanPropertys] = useState<Array<Property | undefined>>([])

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
              selValues === mtValues || selValues === mlValues || selValues === myValues || selValues === mxValues,
            [style.hover]: mtHover || mlHover,
          })}
        />
        <div
          className={cs(style.mt_column_span3, { [style.active]: selValues === mtValues || selValues === myValues })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(mtValues)
            setSelProperty(mtProperty)
            setCleanPropertys([])
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
              setSelProperty(myProperty)
              setCleanPropertys([mtProperty, mbProperty])
            }}
          />
        </div>
        <div
          className={cs(style.mtr, {
            [style.active]:
              selValues === mtValues || selValues === mrValues || selValues === myValues || selValues === mxValues,
            [style.hover]: mtHover || mrHover,
          })}
        />

        <div
          className={cs(style.ml_row_span3, { [style.active]: selValues === mlValues || selValues === mxValues })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(mlValues)
            setSelProperty(mlProperty)
            setCleanPropertys([])
          }}
          onMouseEnter={() => setMlHover(true)}
          onMouseLeave={() => setMlHover(false)}
        >
          <span>{mlProperty?.classname || mxProperty?.classname || mProperty?.classname}</span>
          <div
            className={cs(style.stick, { [style.active]: selValues === mxValues })}
            role="button"
            aria-hidden="true"
            onClick={(e) => {
              e.stopPropagation()
              setSelValues(mxValues)
              setSelProperty(mxProperty)
              setCleanPropertys([mlProperty, mrProperty])
            }}
          />
        </div>

        <div
          className={cs(style.ptl, {
            [style.active]:
              selValues === ptValues || selValues === plValues || selValues === pyValues || selValues === pxValues,
            [style.hover]: ptHover || plHover,
          })}
        />
        <div
          className={cs(style.pt, { [style.active]: selValues === ptValues || selValues === pyValues })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(ptValues)
            setSelProperty(ptProperty)
            setCleanPropertys([])
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
              setSelProperty(pyProperty)
              setCleanPropertys([ptProperty, pbProperty])
            }}
          />
        </div>
        <div
          className={cs(style.ptr, {
            [style.active]:
              selValues === ptValues || selValues === prValues || selValues === pyValues || selValues === pxValues,
            [style.hover]: ptHover || prHover,
          })}
        />

        <div
          className={cs(style.mr_row_span3, { [style.active]: selValues === mrValues || selValues === mxValues })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(mrValues)
            setSelProperty(mrProperty)
            setCleanPropertys([])
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
              setSelProperty(mxProperty)
              setCleanPropertys([mlProperty, mrProperty])
            }}
          />
        </div>

        <div
          className={cs(style.pl, { [style.active]: selValues === plValues || selValues === pxValues })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(plValues)
            setSelProperty(plProperty)
            setCleanPropertys([])
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
              setSelProperty(pxProperty)
              setCleanPropertys([plProperty, prProperty])
            }}
          />
        </div>
        <div className={style.center} />
        <div
          className={cs(style.pr, { [style.active]: selValues === prValues || selValues === pxValues })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(prValues)
            setSelProperty(prProperty)
            setCleanPropertys([])
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
              setSelProperty(pxProperty)
              setCleanPropertys([plProperty, prProperty])
            }}
          />
        </div>

        <div
          className={cs(style.pbl, {
            [style.active]:
              selValues === pbValues || selValues === plValues || selValues === pyValues || selValues === pxValues,
            [style.hover]: pbHover || plHover,
          })}
        />
        <div
          className={cs(style.pb, { [style.active]: selValues === pbValues || selValues === pyValues })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(pbValues)
            setSelProperty(pbProperty)
            setCleanPropertys([])
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
              setSelProperty(pyProperty)
              setCleanPropertys([ptProperty, pbProperty])
            }}
          />
        </div>
        <div
          className={cs(style.pbr, {
            [style.active]:
              selValues === pbValues || selValues === prValues || selValues === pyValues || selValues === pxValues,
            [style.hover]: pbHover || prHover,
          })}
        />

        <div
          className={cs(style.mbl, {
            [style.active]:
              selValues === mbValues || selValues === mlValues || selValues === myValues || selValues === mxValues,
            [style.hover]: mbHover || mlHover,
          })}
        />
        <div
          className={cs(style.mb_column_span3, { [style.active]: selValues === mbValues || selValues === myValues })}
          role="button"
          aria-hidden="true"
          onClick={(e) => {
            e.stopPropagation()
            setSelValues(mbValues)
            setSelProperty(mbProperty)
            setCleanPropertys([])
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
              setSelProperty(myProperty)
              setCleanPropertys([mtProperty, mbProperty])
            }}
          />
        </div>
        <div
          className={cs(style.mbr, {
            [style.active]:
              selValues === mbValues || selValues === mrValues || selValues === myValues || selValues === mxValues,
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
