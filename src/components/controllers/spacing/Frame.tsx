import React, { useMemo, useState, useContext } from 'react'
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

  const pValues = useStoreState<Array<string>>((state) => state.spacing.marginValues)
  const pPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginPropertys)
  const pProperty = useComputeProperty(pPropertys)

  const pyValues = useStoreState<Array<string>>((state) => state.spacing.marginYValues)
  const pyPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginYPropertys)
  const pyProperty = useComputeProperty(pyPropertys)

  const pxValues = useStoreState<Array<string>>((state) => state.spacing.marginXValues)
  const pxPropertys = useStoreState<Array<Property>>((state) => state.spacing.marginXPropertys)
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

  const [targetValues, setTargetValues] = useState<Array<string>>([])
  const [targetProperty, setTargetProperty] = useState<Property | undefined>()
  const [cleanPropertys, setCleanPropertys] = useState<Array<Property | undefined>>([])

  if (already || !element) return <></>

  return (
    <div className={style.component}>
      <div className={style.frame}>
        <div className={style.mtl} />
        <div
          className={style.mt_column_span3}
          role="button"
          aria-hidden="true"
          onClick={() => {
            setTargetValues(mtValues)
            setTargetProperty(mtProperty)
            setCleanPropertys([])
          }}
        >
          <span>{mtProperty?.classname || myProperty?.classname || mProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={() => {
              setTargetValues(myValues)
              setTargetProperty(myProperty)
              setCleanPropertys([mtProperty, mbProperty])
            }}
          />
        </div>
        <div className={style.mtr} />

        <div
          className={style.ml_row_span3}
          role="button"
          aria-hidden="true"
          onClick={() => {
            setTargetValues(mlValues)
            setTargetProperty(mlProperty)
            setCleanPropertys([])
          }}
        >
          <span>{mlProperty?.classname || mxProperty?.classname || mProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={() => {
              setTargetValues(mxValues)
              setTargetProperty(mxProperty)
              setCleanPropertys([mlProperty, mrProperty])
            }}
          />
        </div>

        <div className={style.ptl} />
        <div
          className={style.pt}
          role="button"
          aria-hidden="true"
          onClick={() => {
            setTargetValues(ptValues)
            setTargetProperty(ptProperty)
            setCleanPropertys([])
          }}
        >
          <span>{ptProperty?.classname || pyProperty?.classname || pProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={() => {
              setTargetValues(pyValues)
              setTargetProperty(pyProperty)
              setCleanPropertys([ptProperty, pbProperty])
            }}
          />
        </div>
        <div className={style.ptr} />

        <div
          className={style.mr_row_span3}
          role="button"
          aria-hidden="true"
          onClick={() => {
            setTargetValues(mrValues)
            setTargetProperty(mrProperty)
            setCleanPropertys([])
          }}
        >
          <span>{mrProperty?.classname || mxProperty?.classname || mProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={() => {
              setTargetValues(mxValues)
              setTargetProperty(mxProperty)
              setCleanPropertys([mlProperty, mrProperty])
            }}
          />
        </div>

        <div
          className={style.pl}
          role="button"
          aria-hidden="true"
          onClick={() => {
            setTargetValues(plValues)
            setTargetProperty(plProperty)
            setCleanPropertys([])
          }}
        >
          <span>{plProperty?.classname || pxProperty?.classname || pProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={() => {
              setTargetValues(pxValues)
              setTargetProperty(pxProperty)
              setCleanPropertys([plProperty, prProperty])
            }}
          />
        </div>
        <div className={style.center} />
        <div
          className={style.pr}
          role="button"
          aria-hidden="true"
          onClick={() => {
            setTargetValues(prValues)
            setTargetProperty(prProperty)
            setCleanPropertys([])
          }}
        >
          <span>{prProperty?.classname || pxProperty?.classname || pProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={() => {
              setTargetValues(pxValues)
              setTargetProperty(pxProperty)
              setCleanPropertys([plProperty, prProperty])
            }}
          />
        </div>

        <div className={style.pbl} />
        <div
          className={style.pb}
          role="button"
          aria-hidden="true"
          onClick={() => {
            setTargetValues(pbValues)
            setTargetProperty(pbProperty)
            setCleanPropertys([])
          }}
        >
          <span>{pbProperty?.classname || pyProperty?.classname || pProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={() => {
              setTargetValues(pyValues)
              setTargetProperty(pyProperty)
              setCleanPropertys([ptProperty, pbProperty])
            }}
          />
        </div>
        <div className={style.pbr} />

        <div className={style.mbl} />
        <div
          className={style.mb_column_span3}
          role="button"
          aria-hidden="true"
          onClick={() => {
            setTargetValues(mbValues)
            setTargetProperty(mbProperty)
            setCleanPropertys([])
          }}
        >
          <span>{mbProperty?.classname || myProperty?.classname || mProperty?.classname}</span>
          <div
            className={style.stick}
            role="button"
            aria-hidden="true"
            onClick={() => {
              setTargetValues(mbValues)
              setTargetProperty(mbProperty)
              setCleanPropertys([mtProperty, mbProperty])
            }}
          />
        </div>
        <div className={style.mbr} />
      </div>

      <SelectController
        placeholder="value"
        values={targetValues}
        property={targetProperty}
        cleanPropertys={cleanPropertys}
      />
    </div>
  )
}

export default Frame
