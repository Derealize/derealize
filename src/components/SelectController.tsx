/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState, useCallback } from 'react'
// import clone from 'lodash.clone' // 巨坑：不是100%的clone，导致liveUpdateClassName更新了state对象
import clone from 'lodash.clonedeep'
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
} from 'react-select'
import { CSSObject } from '@emotion/serialize'
import styles from './SelectController.module.scss'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { Project } from '../models/project.interface'
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

type Props = {
  placeholder: string
  values: ReadonlyArray<string | OptionType | GroupType>
  property: Property | undefined
  isDisabled?: boolean
  isColors?: boolean
  onMouseEnter?: boolean
  cleanPropertys?: Array<Property>
}

const SelectController: React.FC<Props> = ({
  placeholder,
  values,
  property,
  isDisabled,
  isColors,
  onMouseEnter,
  cleanPropertys,
}: Props): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const element = useStoreState<ElementState | undefined>((state) => state.element.activeElement)

  const jitClassNames = useStoreActions((actions) => actions.controlles.jitClassNames)
  const deleteProperty = useStoreActions((actions) => actions.element.deleteActiveElementProperty)
  const setActiveElementPropertyClassName = useStoreActions(
    (actions) => actions.element.setActiveElementPropertyClassName,
  )
  const pushNewProperty = useStoreActions((actions) => actions.controlles.pushNewProperty)
  const liveUpdateClassName = useStoreActions((actions) => actions.controlles.liveUpdateClassName)
  const liveApplyClassName = useStoreActions((actions) => actions.controlles.liveApplyClassName)

  const propertysClone = useMemo(() => {
    const clean = cleanPropertys?.map((p) => p.id) || []
    const result = element?.propertys?.filter((p) => !clean.includes(p.id))
    return clone(result)
  }, [cleanPropertys, element?.propertys])

  const onOptionEnter = useCallback(
    async (value: string) => {
      if (!project || !propertysClone) return
      liveUpdateClassName({
        propertysClone,
        propertyId: property?.id || '',
        classname: value,
        projectId: project.id,
      })
    },
    [project, liveUpdateClassName, propertysClone, property?.id],
  )

  const Option = (props: OptionProps<OptionType, boolean, GroupType>) => {
    const {
      data: { label, value },
    } = props

    return (
      <div
        className={isColors ? styles.colorOption : undefined}
        style={isColors ? { backgroundColor: label } : undefined}
        onMouseEnter={() => onOptionEnter(value)}
      >
        <components.Option {...props} />
      </div>
    )
  }

  const Group = (props: GroupProps<OptionType, boolean, GroupType>) => (
    <div className={styles.colorGroup}>
      <components.Group {...props} />
    </div>
  )

  return (
    <Select
      className={styles.select}
      styles={{
        // https://react-select.com/styles#provided-styles-and-state
        dropdownIndicator: (provided: CSSObject, state: IndicatorProps<OptionType, boolean, GroupType>) => ({
          display: 'none',
        }),
        indicatorSeparator: (provided: CSSObject, state: IndicatorProps<OptionType, boolean, GroupType>) => ({
          display: 'none',
        }),
        indicatorsContainer: (provided: CSSObject, state: IndicatorContainerProps<OptionType, boolean, GroupType>) => ({
          ...provided,
          width: 30,
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
      components={{
        Option: onMouseEnter ? Option : components.Option,
        Group: isColors ? Group : components.Group,
      }}
      placeholder={placeholder}
      isClearable
      // menuIsOpen
      isDisabled={isDisabled}
      options={
        typeof values[0] === 'string'
          ? (values as ReadonlyArray<string>).map((v) => ({
              value: v,
              label: v.startsWith('-') ? `-${v.split('-').splice(2).join('-')}` : v.split('-').splice(1).join('-'),
            }))
          : (values as ReadonlyArray<OptionType | GroupType>)
      }
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
          const classname = (ovalue as OptionType).value
          if (property) {
            setActiveElementPropertyClassName({ projectId: project.id, propertyId: property.id, classname })
          } else {
            pushNewProperty(classname)
          }
        }
        cleanPropertys?.forEach((p) => p && deleteProperty({ projectId: project.id, propertyId: p.id }))
        liveApplyClassName()
      }}
    />
  )
}

SelectController.defaultProps = {
  isDisabled: false,
  isColors: false,
  onMouseEnter: true,
  cleanPropertys: [],
}

export default SelectController
