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
      {!element.display?.includes('inline') && (
        <SelectController placeholder="margin-top" values={valuesTop} property={propertyTop} />
      )}
      <div className={style.middle}>
        <div className={style.farm}>
          <div className={style.borderTop} />
          <div className={style.borderBottom} />
          <div className={style.borderLeft} />
          <div className={style.borderRight} />
        </div>
        <div className={style.fields}>
          <SelectController placeholder="margin-right" values={valuesRight} property={propertyRight} />
          <SelectController placeholder="margin-left" values={valuesLeft} property={propertyLeft} />
        </div>
      </div>
      {!element.display?.includes('inline') && (
        <SelectController placeholder="margin-bottom" values={valuesBottom} property={propertyBottom} />
      )}
    </div>
  )
}

export default Marging
