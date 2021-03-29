import React, { useMemo, useState, useEffect } from 'react'
import Select, { GroupTypeBase, OptionTypeBase, ActionMeta, ValueType } from 'react-select'
import cs from 'classnames'
import { css } from '@emotion/react'
import styles from './SelectController.module.scss'

export interface OptionType extends OptionTypeBase {
  label: string
  value: string
}

type Props = {
  options: ReadonlyArray<OptionType | GroupTypeBase<OptionType>>
  value: OptionType | null
  onChange: (value: ValueType<OptionType, false>, actionMeta: ActionMeta<OptionType>) => void
}

const formatGroupLabel = (data: GroupTypeBase<OptionType>) => (
  <div className={styles.groupStyles}>
    <span>{data.label}</span>
    <span className={styles.groupBadgeStyles}>{data.options.length}</span>
  </div>
)

const SelectController: React.FC<Props> = ({ options, value, onChange }: Props): JSX.Element => {
  return <Select isClearable options={options} value={value} formatGroupLabel={formatGroupLabel} onChange={onChange} />
}

export default SelectController
