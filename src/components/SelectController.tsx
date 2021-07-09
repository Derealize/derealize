/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState, useCallback } from 'react'
// import clone from 'lodash.clone' // 巨坑：不是100%的clone，导致liveUpdateClassName更新了state对象
import clone from 'lodash.clonedeep'
import { Icon } from '@chakra-ui/react'
import Select, {
  GroupTypeBase,
  OptionTypeBase,
  ValueContainerProps,
  ControlProps,
  OptionProps,
  InputProps,
  PlaceholderProps,
  IndicatorProps,
  IndicatorContainerProps,
  SingleValueProps,
  components,
  GroupProps,
  MenuProps,
} from 'react-select'
import { CSSObject } from '@emotion/serialize'
import { AiOutlineControl, AiFillControl } from 'react-icons/ai'
import { HiOutlineExternalLink } from 'react-icons/hi'
import styles from './SelectController.module.scss'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { Project, Colors } from '../models/project.interface'
import type { ElementState } from '../models/element'
import type { Property } from '../models/controlles/controlles'
import theme from '../theme'

export interface OptionType extends OptionTypeBase {
  label: string
  value: string
}

export type GroupType = GroupTypeBase<OptionType>

const formatGroupLabel = (data: GroupTypeBase<OptionType>) => (
  <div className={styles.groupStyles}>
    <span>{data.label}</span>
    <span className={styles.groupBadgeStyles}>{data.options.length}</span>
  </div>
)

const Group = (props: GroupProps<OptionType, boolean, GroupType>) => (
  <div className={styles.colorGroup}>
    <components.Group {...props} />
  </div>
)

type Props = {
  placeholder: string
  values: ReadonlyArray<string | OptionType | GroupType>
  property: Property | undefined
  ignorePrefix?: boolean
  isDisabled?: boolean
  colors?: Colors
  colorsTheme?: string
  onMouseEnter?: boolean
  cleanPropertys?: Array<Property>
  doclink?: string | boolean
}

const SelectController: React.FC<Props> = ({
  placeholder,
  values,
  property,
  ignorePrefix,
  isDisabled,
  colors,
  colorsTheme,
  onMouseEnter,
  cleanPropertys,
  doclink,
}: Props): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)

  const toggleColorsModal = useStoreActions((actions) => actions.project.colorsModalToggle)

  const jitClassNames = useStoreActions((actions) => actions.controlles.jitClassNames)
  const deleteProperty = useStoreActions((actions) => actions.element.deleteSelectedElementProperty)
  const setProperty = useStoreActions((actions) => actions.element.setSelectedElementPropertyValue)
  const pushNewProperty = useStoreActions((actions) => actions.controlles.pushNewProperty)
  const liveUpdateClassName = useStoreActions((actions) => actions.controlles.liveUpdateClassName)
  const liveApplyClassName = useStoreActions((actions) => actions.controlles.liveApplyClassName)

  const propertysClone = useMemo(() => {
    const clean = cleanPropertys?.map((p) => p.id) || []
    const propertys = element?.propertys?.filter((p) => !clean.includes(p.id))
    return clone(propertys)
  }, [cleanPropertys, element?.propertys])

  const options = useMemo(() => {
    if (typeof values[0] === 'string') {
      return (values as ReadonlyArray<string>).map((v) => {
        let label = v
        if (ignorePrefix) {
          label = v.startsWith('-') ? `-${v.split('-').splice(2).join('-')}` : v.split('-').splice(1).join('-')
        }
        return { value: v, label }
      })
    }
    return values as ReadonlyArray<OptionType | GroupType>
  }, [ignorePrefix, values])

  const onOptionEnter = useCallback(
    async (value: string) => {
      if (!element || !project || !propertysClone) return
      liveUpdateClassName({
        projectId: project.id,
        selector: element.selector,
        propertysClone,
        propertyId: property?.id || '',
        classname: value,
      })
    },
    [element, project, propertysClone, liveUpdateClassName, property?.id],
  )

  const Option = (props: OptionProps<OptionType, boolean, GroupType>) => {
    const {
      data: { label, value },
    } = props

    return (
      <div
        title={value}
        className={colors ? styles.colorOption : undefined}
        style={colors ? { backgroundColor: label } : undefined}
        onMouseEnter={() => onOptionEnter(value)}
      >
        <components.Option {...props} />
      </div>
    )
  }

  const Menu = (props: MenuProps<OptionType, boolean, GroupType>) => {
    const { children } = props
    return (
      <>
        <components.Menu {...props}>
          <>
            <div className={styles.controls}>
              <Icon
                as={AiOutlineControl}
                boxSize={6}
                onClick={() => toggleColorsModal({ show: true, colors, theme: colorsTheme })}
              />
              {/* <Icon as={AiFillControl} boxSize={6} onClick={() => toggleColorsModal({ show: true })} /> */}
            </div>
            {children}
          </>
        </components.Menu>
      </>
    )
  }

  return (
    <div className={styles.wapper}>
      <Select
        components={{
          Option: onMouseEnter ? Option : components.Option,
          Group: colors ? Group : components.Group,
          Menu: colors ? Menu : components.Menu,
        }}
        placeholder={placeholder}
        isClearable
        // menuIsOpen
        isDisabled={isDisabled}
        options={options}
        value={property ? { value: property.classname, label: property.classname } : null}
        formatGroupLabel={formatGroupLabel}
        onFocus={() => {
          if (!project || !values.length) return

          const classNames: Array<string> =
            typeof values[0] === 'string'
              ? (values as ReadonlyArray<string>)
              : (values as ReadonlyArray<OptionType | GroupType>)
                  .map((v) => v.options)
                  .reduce((pre, cur) => pre.concat(cur))
                  .map((o: OptionType) => o.value)

          jitClassNames({ project, classNames })
        }}
        onBlur={() => {
          liveApplyClassName()
        }}
        onChange={(ovalue, { action }) => {
          if (!project) return
          if (action === 'clear' && property) {
            deleteProperty({ projectId: project.id, propertyId: property.id })
          } else if (action === 'select-option') {
            const { value } = ovalue as OptionType
            if (property) {
              setProperty({ projectId: project.id, propertyId: property.id, value })
            } else {
              pushNewProperty(value)
            }
          }
          cleanPropertys?.forEach((p) => p && deleteProperty({ projectId: project.id, propertyId: p.id }))
          liveApplyClassName()
        }}
        className={styles.select}
        styles={{
          // https://react-select.com/styles#provided-styles-and-state
          dropdownIndicator: (provided: CSSObject, state: IndicatorProps<OptionType, boolean, GroupType>) => ({
            display: 'none',
          }),
          indicatorSeparator: (provided: CSSObject, state: IndicatorProps<OptionType, boolean, GroupType>) => ({
            display: 'none',
          }),
          indicatorsContainer: (
            provided: CSSObject,
            state: IndicatorContainerProps<OptionType, boolean, GroupType>,
          ) => ({
            ...provided,
            width: 26,
            height: 30,
            justifyContent: 'center',
          }),
          control: (provided: CSSObject, state: ControlProps<OptionType, boolean, GroupType>) => {
            // state.isFocused
            return {
              ...provided,
              boxShadow: 'none',
              borderRadius: 0,
              border: 'none',
              // borderBottom: `1px solid ${property ? theme.colors.teal['400'] : theme.colors.gray['200']}`,
              borderBottom: `1px solid ${state.isFocused && property ? theme.colors.teal['500'] : 'transparent'}`,
              cursor: 'pointer',
              minHeight: undefined,
              '&:hover': {
                borderBottom: `1px solid ${property ? theme.colors.teal['500'] : theme.colors.gray['300']}`,
              },
            }
          },
          singleValue: (provided: CSSObject, props: SingleValueProps<OptionType, GroupType>) => ({
            ...provided,
            margin: 0,
            color: property ? theme.colors.teal['500'] : theme.colors.gray['400'],
          }),
          valueContainer: (provided: CSSObject, state: ValueContainerProps<OptionType, boolean, GroupType>) => ({
            ...provided,
            padding: '2px 4px',
          }),
          placeholder: (provided: CSSObject, state: PlaceholderProps<OptionType, boolean, GroupType>) => ({
            ...provided,
            margin: 0,
          }),
          input: (provided: CSSObject, state: InputProps) => ({
            ...provided,
            margin: 0,
          }),
          option: (provided: CSSObject, props: OptionProps<OptionType, boolean, GroupType>) => ({
            ...provided,
            padding: '4px 8px',
          }),
        }}
      />
      {doclink !== false && (
        <a
          className={styles.doclink}
          href={`https://tailwindcss.com/docs/${typeof doclink === 'string' ? doclink : placeholder}`}
          target="_black"
        >
          <Icon as={HiOutlineExternalLink} boxSize={4} color="gray.300" _hover={{ color: 'gray.500' }} />
        </a>
      )}
    </div>
  )
}

SelectController.defaultProps = {
  ignorePrefix: true,
  isDisabled: false,
  colors: undefined,
  colorsTheme: '',
  onMouseEnter: true,
  cleanPropertys: [],
  doclink: true,
}

export default SelectController
