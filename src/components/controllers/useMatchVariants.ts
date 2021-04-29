import react from 'react'
import type { TailwindConfig, Variant } from 'tailwindcss/tailwind-config'
import { useStoreState } from '../../reduxStore'
import { Project } from '../../models/project'
import { StateVariantsType, ListVariantsType } from '../../models/controlles/controlles'

export type VariantsPropertyNames = keyof TailwindConfig['variants']

const useMatchVariants = (prop: VariantsPropertyNames) => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const variants: Variant[] | undefined = project?.tailwindConfig?.variants[prop]

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<StateVariantsType | undefined>(
    (state) => state.controlles.selectStateVariant,
  )
  const selectListVariant = useStoreState<ListVariantsType | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)
  const selectDark = useStoreState<boolean>((state) => state.controlles.selectDark)

  if (!variants) return false

  if (selectScreenVariant && !variants.includes('responsive')) return false
  if (selectStateVariant && !variants.includes(selectStateVariant)) return false
  if (selectListVariant && !variants.includes(selectListVariant)) return false
  if (selectCustomVariant && !(variants as string[]).includes(selectCustomVariant)) return false
  if (selectDark && !variants.includes('dark')) return false

  return true
}

export default useMatchVariants
