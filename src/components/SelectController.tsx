/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState, useEffect } from 'react'
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
  onMouseEnter?: boolean
  cleanPropertys?: Array<Property | undefined>
  // onChange: (value: ValueType<OptionType, boolean>, actionMeta: ActionMeta<OptionType>) => void
}

const SelectController: React.FC<Props> = ({
  placeholder,
  values,
  property,
  onMouseEnter,
  cleanPropertys,
}: Props): JSX.Element => {
  const project = useStoreState<Project | null>((state) => state.project.frontProject)
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)
  const updateClassName = useStoreActions((actions) => actions.controlles.updateClassName)

  const Option = (props: OptionProps<OptionType, boolean, GroupType>) => {
    return (
      <div
        onMouseEnter={() => {
          if (!props.data.value && property) {
            deleteProperty(property.id)
          } else if (property) {
            property.classname = props.data.value
            setProperty(property)
          } else {
            setProperty({
              id: nanoid(),
              classname: props.data.value,
            } as Property)
          }

          cleanPropertys?.forEach((p) => p && deleteProperty(p.id))
          updateClassName()
        }}
      >
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
        control: (provided: CSSObject, state: ControlProps<OptionType, boolean, GroupType>) => {
          // state.isFocused
          return {
            ...provided,
            boxShadow: 'none',
            borderRadius: 0,
            border: 'none',
            borderBottom: `1px solid ${property ? theme.colors.teal['400'] : theme.colors.gray['200']}`,
            cursor: 'pointer',
          }
        },
        valueContainer: (provided: CSSObject, state: ValueContainerProps<OptionType, boolean, GroupType>) => ({
          ...provided,
          // padding: 0,
        }),
        placeholder: (provided: CSSObject, state: PlaceholderProps<OptionType, boolean, GroupType>) => ({
          ...provided,
          margin: 0,
        }),
        input: (provided: CSSObject, state: InputProps) => ({
          ...provided,
          margin: 0,
        }),
      }}
      components={onMouseEnter ? { Option } : {}}
      placeholder={placeholder}
      isClearable
      options={
        typeof values[0] === 'string'
          ? (values as ReadonlyArray<string>).map((v) => ({ value: v, label: v.split('-').splice(-1)[0] }))
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
                .map((g) => g.options.map((o) => o.value).join(' '))
                .join(' ')
        const payload: JitTiggerPayload = { projectId: project.id, className }
        sendBackIpc(Handler.JitTigger, payload as any)
      }}
      onChange={(ovalue, { action }) => {
        if (action === 'clear' && property) {
          deleteProperty(property.id)
        } else if (action === 'select-option') {
          if (!ovalue && property) {
            deleteProperty(property.id)
          } else if (property) {
            property.classname = (ovalue as OptionType).value
            setProperty(property)
          } else {
            setProperty({
              id: nanoid(),
              classname: (ovalue as OptionType).value,
            } as Property)
          }
        }

        cleanPropertys?.forEach((p) => p && deleteProperty(p.id))
        updateClassName(true)
      }}
    />
  )
}

SelectController.defaultProps = {
  onMouseEnter: true,
  cleanPropertys: [],
}

export default SelectController
