import React, { useMemo } from 'react'
import { Property } from '../../models/controlles/controlles'
import { useStoreState } from '../../reduxStore'

const useComputeProperty = (propertys: Array<Property>) => {
  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)
  const selectDark = useStoreState<boolean>((state) => state.controlles.selectDark)

  const property = useMemo<Property | undefined>(
    () =>
      propertys.find(
        (p) =>
          p.screen === selectScreenVariant &&
          p.state === selectStateVariant &&
          p.list === selectListVariant &&
          p.custom === selectCustomVariant &&
          (p.dark === true) === selectDark,
      ),
    [propertys, selectScreenVariant, selectStateVariant, selectListVariant, selectCustomVariant, selectDark],
  )
  return property
}

export default useComputeProperty
