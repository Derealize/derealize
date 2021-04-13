import react from 'react'
import type { TailwindConfig } from 'tailwindcss/tailwind-config'
import { useStoreState } from '../../reduxStore'
import { Project } from '../../models/project'

export type VariantsPropertysName = keyof TailwindConfig['variants']

const useMatchVariants = (prop: VariantsPropertysName) => {
  const project = useStoreState<Project | null>((state) => state.project.frontProject)
  const variants: Array<string> | undefined = project?.tailwindConfig?.variants[prop]

  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)
  const selectDark = useStoreState<boolean>((state) => state.controlles.selectDark)

  if (!variants) return false

  if (selectScreenVariant && !variants.includes('responsive')) return false
  if (selectStateVariant && !variants.includes(selectStateVariant)) return false
  if (selectListVariant && !variants.includes(selectListVariant)) return false
  if (selectCustomVariant && !variants.includes(selectCustomVariant)) return false
  if (selectDark && !variants.includes('dark')) return false

  return true
}

export default useMatchVariants
