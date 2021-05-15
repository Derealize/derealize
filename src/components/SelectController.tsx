/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import Select, {
  GroupTypeBase,
  OptionTypeBase,
  ActionMeta,
  ValueType,
  ValueContainerProps,
  ControlProps,
  OptionProps,
  InputProps,
  PlaceholderProps,
  IndicatorProps,
  IndicatorContainerProps,
  SingleValueProps,
  components,
} from 'react-select'
import { CSSObject } from '@emotion/serialize'
import styles from './SelectController.module.scss'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { Project } from '../models/project'
import type { Property } from '../models/controlles/controlles'
import theme from '../theme'
import { Handler } from '../backend/backend.interface'
import type { PreloadWindow } from '../preload'
import { JitTiggerPayload } from '../interface'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpc } = window.derealize

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
  onMouseEnter?: boolean
  cleanPropertys?: Array<Property>
  // onChange: (value: ValueType<OptionType, boolean>, actionMeta: ActionMeta<OptionType>) => void
}

const SelectController: React.FC<Props> = ({
  placeholder,
  values,
  property,
  isDisabled,
  onMouseEnter,
  cleanPropertys,
}: Props): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const setJitClassName = useStoreActions((actions) => actions.project.setJitClassName)
  const deleteProperty = useStoreActions((actions) => actions.project.deleteActiveElementProperty)
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const liveUpdateClassName = useStoreActions((actions) => actions.controlles.liveUpdateClassName)
  const liveApplyClassName = useStoreActions((actions) => actions.controlles.liveApplyClassName)

  const onOptionEnter = useCallback(
    async (value: string) => {
      liveUpdateClassName({
        propertyId: property?.id || '',
        classname: value,
        cleanPropertyIds: cleanPropertys?.map((p) => p.id) || [],
      })
    },
    [cleanPropertys, property, liveUpdateClassName],
  )

  const Option = (props: OptionProps<OptionType, boolean, GroupType>) => {
    return (
      <div onMouseEnter={() => onOptionEnter(props.data.value)}>
        <components.Option {...props} />
      </div>
    )
  }

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
      components={onMouseEnter ? { Option } : {}}
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
        if (!project) return
        const className =
          typeof values[0] === 'string'
            ? (values as ReadonlyArray<string>).join(' ')
            : (values as ReadonlyArray<OptionType | GroupType>)
                .map((g) => g.options.map((o: any) => o.value).join(' '))
                .join(' ')
        if (project.jitClassName === className) return
        const payload: JitTiggerPayload = { projectId: project.id, className }
        setJitClassName(payload)
        sendBackIpc(Handler.JitTigger, payload as any)
      }}
      onBlur={() => {
        liveApplyClassName()
      }}
      onChange={(ovalue, { action }) => {
        if (action === 'clear' && property) {
          deleteProperty(property.id)
        } else if (action === 'select-option') {
          const classname = (ovalue as OptionType).value
          if (property) {
            setProperty({ propertyId: property.id, classname })
          } else {
            setProperty({ propertyId: nanoid(), classname })
          }
        }
        cleanPropertys?.forEach((p) => p && deleteProperty(p.id))
        liveApplyClassName()
      }}
    />
  )
}

SelectController.defaultProps = {
  isDisabled: false,
  onMouseEnter: true,
  cleanPropertys: [],
}

export default SelectController
