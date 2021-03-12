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
import { CommitLog, ProjectStage, HistoryPayload, PayloadError } from '../backend/project.interface'
import Project from '../models/project.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './Controllers.module.scss'
import { PreloadWindow } from '../preload'

declare const window: PreloadWindow

const Controllers = (): JSX.Element => {
  const toast = useToast()
  const project = useStoreState<Project | null>((state) => state.project.frontProject)

  if (!project) return <></>

  return <Flex className={style.controllers} />
}

export default Controllers
