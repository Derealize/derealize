import React, { useMemo, useState, useEffect } from 'react'
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
} from 'react-select'
import { CSSObject } from '@emotion/serialize'
import cs from 'classnames'
import { css } from '@emotion/react'
import styles from './SelectController.module.scss'

export interface OptionType extends OptionTypeBase {
  label: string
  value: string
}

export type GroupType = GroupTypeBase<OptionType>

type Props = {
  placeholder: string
  options: ReadonlyArray<OptionType | GroupType>
  value: OptionType | null
  onChange: (value: ValueType<OptionType, boolean>, actionMeta: ActionMeta<OptionType>) => void
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

const SelectController: React.FC<Props> = ({ placeholder, options, value, onChange }: Props): JSX.Element => {
  return (
    <Select
      className={styles.select}
      styles={customStyles}
      placeholder={placeholder}
      isClearable
      options={options}
      value={value}
      formatGroupLabel={formatGroupLabel}
      onChange={onChange}
    />
  )
}

export default SelectController
