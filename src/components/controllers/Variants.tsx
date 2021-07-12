import React, { useMemo, useEffect } from 'react'
import cs from 'classnames'
import { IconButton, Collapse, Flex } from '@chakra-ui/react'
import { IoChevronDown, IoChevronUp } from 'react-icons/io5'
import { StateVariants, ListVariants } from '../../models/element'
import { AlreadyVariants } from '../../models/controlles/controlles'
import { useStoreActions, useStoreState } from '../../reduxStore'
import style from './Variants.module.scss'

type Props = {
  alreadyVariants: AlreadyVariants
}

const Variants: React.FC<Props> = ({ alreadyVariants }: Props): JSX.Element => {
  const screenVariants = useStoreState<Array<string>>((state) => state.element.screenVariants)
  const selectScreenVariant = useStoreState<string | undefined>((state) => state.controlles.selectScreenVariant)
  const setSelectScreenVariant = useStoreActions((actions) => actions.controlles.setSelectScreenVariantWithDevice)

  const selectStateVariant = useStoreState<string | undefined>((state) => state.controlles.selectStateVariant)
  const setSelectStateVariant = useStoreActions((actions) => actions.controlles.setSelectStateVariantThunk)

  const selectListVariant = useStoreState<string | undefined>((state) => state.controlles.selectListVariant)
  const setSelectListVariant = useStoreActions((actions) => actions.controlles.setSelectListVariant)

  const selectDark = useStoreState<boolean | undefined>((state) => state.controlles.selectDark)
  const setSelectDark = useStoreActions((actions) => actions.controlles.setSelectDark)

  const clearSelectVariant = useStoreActions((actions) => actions.controlles.clearSelectVariant)

  const customVariants = useStoreState<Array<string>>((state) => state.element.customVariants)
  const selectCustomVariant = useStoreState<string | undefined>((state) => state.controlles.selectCustomVariant)
  const setSelectCustomVariant = useStoreActions((actions) => actions.controlles.setSelectCustomVariant)

  const expandVariants = useStoreState<boolean>((state) => state.controlles.expandVariants)
  const setExpandVariants = useStoreActions((actions) => actions.controlles.setExpandVariants)

  const selectNone = useMemo(
    () => !selectScreenVariant && !selectStateVariant && !selectListVariant && !selectDark && !selectCustomVariant,
    [selectCustomVariant, selectDark, selectListVariant, selectScreenVariant, selectStateVariant],
  )

  return (
    <div className={style.variants}>
      <Flex justifyContent="space-between" alignItems="center">
        <div>
          <div className={style.variantsline}>
            <div
              className={cs(style.option, {
                [style.active]: selectNone,
                [style.already]: alreadyVariants.hasNone,
              })}
              onClick={() => clearSelectVariant()}
              aria-hidden="true"
            >
              <span>none</span>
            </div>
            {screenVariants.map((variant) => (
              <div
                key={variant}
                className={cs(style.option, {
                  [style.active]: variant === selectScreenVariant,
                  [style.already]: alreadyVariants.screens.includes(variant),
                })}
                onClick={() => setSelectScreenVariant(variant)}
                aria-hidden="true"
              >
                <span>{variant}</span>
              </div>
            ))}
          </div>
          <div className={style.variantsline}>
            <div
              className={cs(style.option, {
                [style.active]: selectDark,
                [style.already]: alreadyVariants.hasDark,
              })}
              onClick={() => setSelectDark(!selectDark)}
              aria-hidden="true"
            >
              <span>dark</span>
            </div>
            {StateVariants.slice(0, 3).map((variant) => (
              <div
                key={variant}
                className={cs(style.option, {
                  [style.active]: variant === selectStateVariant,
                  [style.already]: alreadyVariants.states.includes(variant),
                })}
                onClick={() => setSelectStateVariant(variant)}
                aria-hidden="true"
              >
                <span>{variant}</span>
              </div>
            ))}
          </div>
        </div>
        <IconButton
          size="sm"
          aria-label={expandVariants ? 'unfold' : 'fold'}
          colorScheme="gray"
          variant="ghost"
          icon={expandVariants ? <IoChevronUp /> : <IoChevronDown />}
          onClick={() => setExpandVariants(!expandVariants)}
        />
      </Flex>
      <Collapse animateOpacity in={expandVariants}>
        <div className={style.variantsline}>
          {StateVariants.slice(3).map((variant) => (
            <div
              key={variant}
              className={cs(style.option, {
                [style.active]: variant === selectStateVariant,
                [style.already]: alreadyVariants.states.includes(variant),
              })}
              onClick={() => setSelectStateVariant(variant)}
              aria-hidden="true"
            >
              <span>{variant}</span>
            </div>
          ))}
        </div>
        <div className={style.variantsline}>
          {ListVariants.map((variant) => (
            <div
              key={variant}
              className={cs(style.option, {
                [style.active]: variant === selectListVariant,
                [style.already]: alreadyVariants.lists.includes(variant),
              })}
              onClick={() => setSelectListVariant(variant)}
              aria-hidden="true"
            >
              <span>{variant}</span>
            </div>
          ))}
        </div>
        {!!customVariants.length && (
          <div className={style.variantsline}>
            {customVariants.map((variant) => (
              <div
                key={variant}
                className={cs(style.option, {
                  [style.active]: variant === selectCustomVariant,
                  [style.already]: alreadyVariants.customs.includes(variant),
                })}
                onClick={() => setSelectCustomVariant(variant)}
                aria-hidden="true"
              >
                <span>{variant}</span>
              </div>
            ))}
          </div>
        )}
      </Collapse>
    </div>
  )
}

export default Variants
