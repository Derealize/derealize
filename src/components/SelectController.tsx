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
import cs from 'classnames'
import styles from './SelectController.module.scss'
import { useStoreActions } from '../reduxStore'
import type { Property } from '../models/controlles/controlles'

export interface OptionType extends OptionTypeBase {
  label: string
  value: string
}

export type GroupType = GroupTypeBase<OptionType>

type Props = {
  placeholder: string
  options: ReadonlyArray<OptionType | GroupType>
  property: Property | undefined
  // onChange: (value: ValueType<OptionType, boolean>, actionMeta: ActionMeta<OptionType>) => void
}

const formatGroupLabel = (data: GroupTypeBase<OptionType>) => (
  <div className={styles.groupStyles}>
    <span>{data.label}</span>
    <span className={styles.groupBadgeStyles}>{data.options.length}</span>
  </div>
)

const customStyles = {
  // option: (provided: CSSObject, state: OptionProps<OptionType, boolean, GroupType>) => ({
  //   ...provided,
  //   borderBottom: '1px dotted pink',
  //   color: state.isSelected ? 'red' : 'blue',
  //   padding: 20,
  // }),
  dropdownIndicator: (provided: CSSObject, state: IndicatorProps<OptionType, boolean, GroupType>) => ({
    display: 'none',
  }),
  indicatorSeparator: (provided: CSSObject, state: IndicatorProps<OptionType, boolean, GroupType>) => ({
    display: 'none',
  }),
  control: (provided: CSSObject, state: ControlProps<OptionType, boolean, GroupType>) => {
    const borderColor = state.isFocused ? '#3182CE' : '#E2E8F0'
    return {
      ...provided,
      boxShadow: 'none',
      borderRadius: 0,
      border: 'none',
      borderBottom: `1px solid ${borderColor}`,
      cursor: 'pointer',
    }
  },
  valueContainer: (provided: CSSObject, state: ValueContainerProps<OptionType, boolean, GroupType>) => ({
    ...provided,
    padding: 0,
  }),
  placeholder: (provided: CSSObject, state: PlaceholderProps<OptionType, boolean, GroupType>) => ({
    ...provided,
    margin: 0,
  }),
  input: (provided: CSSObject, state: InputProps) => ({
    ...provided,
    margin: 0,
  }),
}

const SelectController: React.FC<Props> = ({ placeholder, options, property }: Props): JSX.Element => {
  const setProperty = useStoreActions((actions) => actions.controlles.setProperty)
  const deleteProperty = useStoreActions((actions) => actions.controlles.deleteProperty)
  const updateClassName = useStoreActions((actions) => actions.controlles.updateClassName)

  const Option = (props: OptionProps<OptionType, boolean, GroupType>) => {
    return (
      <div
        onMouseEnter={() => {
          console.log('onMouseEnter', props.data.value)
          if (property) {
            property.classname = props.data.value
            setProperty(property)
          } else {
            setProperty({
              id: nanoid(),
              classname: props.data.value,
            } as Property)
          }
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
      styles={customStyles}
      components={{ Option }}
      placeholder={placeholder}
      isClearable
      options={options}
      value={property ? { value: property.classname, label: property.classname } : null}
      formatGroupLabel={formatGroupLabel}
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
        updateClassName(true)
      }}
    />
  )
}

export default SelectController
