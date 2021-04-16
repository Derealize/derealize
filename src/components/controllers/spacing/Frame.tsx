import React, { useMemo, useState, useContext } from 'react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import SelectController from '../../SelectController'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import useComputeProperty from '../useComputeProperty'
import { ElementPayload } from '../../../backend/backend.interface'
import style from './Marging.module.scss'

const Marging: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementPayload | undefined>((state) => state.controlles.element)

  const valuesTop = useStoreState<Array<string>>((state) => state.spacing.marginTopValues)
  const propertysTop = useStoreState<Array<Property>>((state) => state.spacing.marginTopPropertys)
  const propertyTop = useComputeProperty(propertysTop)

  const valuesBottom = useStoreState<Array<string>>((state) => state.spacing.marginBottomValues)
  const propertysBottom = useStoreState<Array<Property>>((state) => state.spacing.marginBottomPropertys)
  const propertyBottom = useComputeProperty(propertysBottom)

  const valuesLeft = useStoreState<Array<string>>((state) => state.spacing.marginLeftValues)
  const propertysLeft = useStoreState<Array<Property>>((state) => state.spacing.marginLeftPropertys)
  const propertyLeft = useComputeProperty(propertysLeft)

  const valuesRight = useStoreState<Array<string>>((state) => state.spacing.marginRightValues)
  const propertysRight = useStoreState<Array<Property>>((state) => state.spacing.marginRightPropertys)
  const propertyRight = useComputeProperty(propertysRight)

  if ((already && !propertyTop && !propertyBottom && !propertyLeft && !propertyRight) || !element) return <></>

  return (
    <div className={style.component}>
      <div className={style.frame}>
        <div className={style.mtl} />
        <div className={style.mt_column_span3} />
        <div className={style.mtr} />

        <div className={style.ml_row_span3} />

        <div className={style.ptl} />
        <div className={style.pt} />
        <div className={style.ptr} />

        <div className={style.mr_row_span3} />

        <div className={style.pl} />
        <div className={style.center} />
        <div className={style.pr} />

        <div className={style.pbl} />
        <div className={style.pb} />
        <div className={style.pbr} />

        <div className={style.mbl} />
        <div className={style.mb_column_span3} />
        <div className={style.mbr} />
      </div>
      <SelectController placeholder="margin-left" values={valuesLeft} property={propertyLeft} />
    </div>
  )
}

export default Marging
