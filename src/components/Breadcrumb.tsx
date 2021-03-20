import React, { useState, useEffect, useCallback } from 'react'
import { useStyleConfig, useToast, Flex, IconButton, Tooltip, IconButtonProps } from '@chakra-ui/react'
import cs from 'classnames'
import { css } from '@emotion/react'
import { VscRepoPush, VscRepoPull, VscOutput, VscDebugStart, VscDebugStop } from 'react-icons/vsc'
import { CgSelectR, CgMenu } from 'react-icons/cg'
import { HiCursorClick, HiOutlineStatusOnline } from 'react-icons/hi'
import { BiRectangle, BiDevices } from 'react-icons/bi'
import { RiInputMethodLine } from 'react-icons/ri'
import { AiOutlineBorderHorizontal, AiOutlineBorder } from 'react-icons/ai'
import { FiLink2 } from 'react-icons/fi'
import type { ProjectStage, BoolReply } from '../backend/backend.interface'
import { Handler } from '../backend/handlers'
import type { Project, ProjectView } from '../models/project'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './Breadcrumb.module.scss'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { send, popupMenu } = window.derealize

type Props = {
  project: Project
}

const Breadcrumb: React.FC<Props> = ({ project }: Props): JSX.Element => {
  return <Flex align="center" />
}

export default Breadcrumb
