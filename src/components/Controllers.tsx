import React, { useState, useEffect } from 'react'
import {
  useStyleConfig,
  useToast,
  Flex,
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  List,
  ListItem,
  ListIcon,
  IconButton,
} from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import Project from '../models/project.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './Controllers.module.scss'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow

type Props = {
  project: Project
}

const Controllers: React.FC<Props> = ({ project }: Props): JSX.Element => {
  const toast = useToast()

  return <Flex className={style.controllers} />
}

export default Controllers
