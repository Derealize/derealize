import React, { useContext } from 'react'
import { Flex, Button } from '@chakra-ui/react'
import ControllersContext from '../ControllersContext'
import type { Property } from '../../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../../reduxStore'
import SelectController, { GroupType } from '../../SelectController'
import useComputeProperty from '../useComputeProperty'
import { ElementState } from '../../../models/element'

const BackgroundImage: React.FC = (): JSX.Element => {
  const { already } = useContext(ControllersContext)
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)
  const toggleModal = useStoreActions((actions) => actions.project.toggleImagesModal)

  const values = useStoreState<Array<string>>((state) => state.background.backgroundImageValues)
  const propertys = useStoreState<Array<Property>>((state) => state.background.backgroundImagePropertys)
  const property = useComputeProperty(propertys)

  const fromValues = useStoreState<Array<GroupType>>((state) => state.background.fromColorValues)
  const fromPropertys = useStoreState<Array<Property>>((state) => state.background.fromColorPropertys)
  const fromProperty = useComputeProperty(fromPropertys)

  const viaValues = useStoreState<Array<GroupType>>((state) => state.background.viaColorValues)
  const viaPropertys = useStoreState<Array<Property>>((state) => state.background.viaColorPropertys)
  const viaProperty = useComputeProperty(viaPropertys)

  const toValues = useStoreState<Array<GroupType>>((state) => state.background.toColorValues)
  const toPropertys = useStoreState<Array<Property>>((state) => state.background.toColorPropertys)
  const toProperty = useComputeProperty(toPropertys)

  if (already && !property) return <></>

  return (
    <Flex alignItems="stretch" flexDirection="column">
      <Button colorScheme="teal" variant="ghost" onClick={() => toggleModal(true)}>
        Manage Images
      </Button>
      <SelectController placeholder="bg-image" values={values} property={property} />
      {!!element?.actualStatus?.background && element?.actualStatus?.background !== 'none' && (
        <>
          <SelectController placeholder="from" values={fromValues} property={fromProperty} />
          <SelectController placeholder="via" values={viaValues} property={viaProperty} />
          <SelectController placeholder="to" values={toValues} property={toProperty} />
        </>
      )}
    </Flex>
  )
}

export default BackgroundImage
