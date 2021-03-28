import React, { useMemo, useState, useEffect } from 'react'
import Select, { GroupTypeBase, OptionTypeBase } from 'react-select'
import cs from 'classnames'
import { nanoid } from 'nanoid'
import { css } from '@emotion/react'
import styles from './SelectController.module.scss'

interface OptionType extends OptionTypeBase {
  label: string
  value: string
}

type Props = {
  options: ReadonlyArray<OptionType | GroupTypeBase<OptionType>>
}

const formatGroupLabel = (data: GroupTypeBase<OptionType>) => (
  <div className={styles.groupStyles}>
    <span>{data.label}</span>
    <span className={styles.groupBadgeStyles}>{data.options.length}</span>
  </div>
)

const SelectController: React.FC<Props> = ({ options }: Props): JSX.Element => {
  return <Select isClearable options={options} formatGroupLabel={formatGroupLabel} onChange={(value) => {}} />
}

export default SelectController
