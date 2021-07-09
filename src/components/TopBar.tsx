import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  useStyleConfig,
  useToast,
  Flex,
  Text,
  IconButton,
  Tooltip,
  IconButtonProps,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup,
  Button,
} from '@chakra-ui/react'
import { HiCursorClick, HiOutlineStatusOnline } from 'react-icons/hi'
import { IoBookmarksOutline, IoChevronForward } from 'react-icons/io5'
import { MdUndo, MdRedo, MdRefresh, MdArrowForward, MdArrowBack } from 'react-icons/md'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { AiOutlineSave } from 'react-icons/ai'
import { getCrossCtrl } from '../utils/assest'
import { Project, ProjectView } from '../models/project.interface'
import type { ElementState, ElementHistory } from '../models/element'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'
import { MainIpcChannel, BreadcrumbPayload } from '../interface'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { sendMainIpc } = window.derealize

export const BarIconButton = React.forwardRef(
  (props: { selected?: boolean } & IconButtonProps, ref: React.LegacyRef<HTMLButtonElement>) => {
    const { selected, ...rest } = props
    const styles = useStyleConfig('BarIconButton')

    // eslint-disable-next-line react/jsx-props-no-spreading
    return <IconButton ref={ref} sx={styles} bg={selected ? 'gray.200' : 'transparent'} {...rest} />
  },
)
BarIconButton.defaultProps = {
  selected: false,
}

const TopBar: React.FC = (): JSX.Element => {
  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const setProjectViewHistory = useStoreActions((actions) => actions.project.setProjectViewHistory)

  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)
  const pendingElements = useStoreState<Array<ElementState>>((state) => state.element.pendingElements)
  const savedElements = useStoreActions((actions) => actions.element.savedElements)

  const historys = useStoreState<Array<ElementHistory>>((state) => state.element.frontHistory)

  const revokeHistory = useStoreActions((actions) => actions.element.revokeHistory)
  const redoHistory = useStoreActions((actions) => actions.element.redoHistory)

  const breadcrumbs = useMemo(() => {
    return element?.selector.split('>').map((sel, index) => ({ sel: sel.split(/[#\\.]/)[0], tooltip: sel, index }))
  }, [element])

  if (!project) return <></>

  return (
    <Flex className={style.topbar} justify="space-between">
      <Flex align="center">
        <Tooltip label="Pages" placement="top">
          <IconButton
            size="sm"
            aria-label="Pages"
            icon={<IoBookmarksOutline />}
            onClick={() => sendMainIpc(MainIpcChannel.PagesMenu)}
          />
        </Tooltip>
        <ButtonGroup size="sm" ml={2} isAttached>
          <Tooltip label="Undo">
            <IconButton
              aria-label="Undo"
              isDisabled={!historys.filter((h) => !h.revoked)?.length}
              icon={<MdUndo />}
              onClick={() => revokeHistory(project.id)}
              mr="-px"
            />
          </Tooltip>
          <Tooltip label="Redo">
            <IconButton
              aria-label="Redo"
              isDisabled={!historys.filter((h) => h.revoked)?.length}
              icon={<MdRedo />}
              onClick={() => redoHistory(project.id)}
              mr="-px"
            />
          </Tooltip>
          <Tooltip label={`View Historys (${getCrossCtrl()}+H)`} placement="top">
            <IconButton
              aria-label="Historys"
              icon={project.viewHistory ? <IoIosArrowUp /> : <IoIosArrowDown />}
              isDisabled={!pendingElements?.length}
              onClick={() => {
                setProjectViewHistory({
                  projectId: project.id,
                  isView: !project.viewHistory,
                })
              }}
            />
          </Tooltip>
        </ButtonGroup>

        <Tooltip label={`${getCrossCtrl()}+S`} placement="top">
          <Button
            size="sm"
            ml={2}
            leftIcon={<AiOutlineSave />}
            isDisabled={!pendingElements?.length}
            onClick={() => savedElements(project.id)}
          >
            Save
          </Button>
        </Tooltip>
      </Flex>

      <Flex align="center" justify="center" className={style.breadcrumb}>
        <Breadcrumb spacing="4px" separator={<IoChevronForward color="#a0aec0" />}>
          {breadcrumbs?.map(({ sel, index, tooltip }) => (
            <BreadcrumbItem key={sel + index}>
              <Tooltip label={tooltip} placement="top">
                {index === breadcrumbs.length - 1 ? (
                  <Text textColor="teal.500">{sel}</Text>
                ) : (
                  <BreadcrumbLink
                    onMouseEnter={() =>
                      sendMainIpc(MainIpcChannel.SelectBreadcrumb, {
                        projectId: project.id,
                        index,
                      } as BreadcrumbPayload)
                    }
                    onClick={() => {
                      sendMainIpc(MainIpcChannel.SelectBreadcrumb, {
                        projectId: project.id,
                        index,
                        isClick: true,
                      } as BreadcrumbPayload)
                    }}
                  >
                    {sel}
                  </BreadcrumbLink>
                )}
              </Tooltip>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Flex>

      <Flex align="center" justify="right">
        <Tooltip label="Refresh" placement="top">
          <IconButton
            size="sm"
            aria-label="Refresh"
            icon={<MdRefresh />}
            onClick={() => sendMainIpc(MainIpcChannel.Refresh, project.id)}
          />
        </Tooltip>
        <ButtonGroup size="sm" ml={2} isAttached isDisabled={project.view !== ProjectView.BrowserView}>
          <Tooltip label="Backward" placement="top">
            <IconButton
              aria-label="Backward"
              mr="-px"
              icon={<MdArrowBack />}
              onClick={() => sendMainIpc(MainIpcChannel.Backward, project.id)}
            />
          </Tooltip>
          <Tooltip label="Forward" placement="top">
            <IconButton
              aria-label="Forward"
              icon={<MdArrowForward />}
              onClick={() => sendMainIpc(MainIpcChannel.Forward, project.id)}
            />
          </Tooltip>
        </ButtonGroup>
        <Tooltip label="Disable Cursor" placement="top">
          <IconButton ml={2} size="sm" aria-label="Disable Cursor" icon={<HiCursorClick />} />
        </Tooltip>
        {/* https://discuss.atom.io/t/emulate-touch-scroll/27429/3 */}
        {/* <BarIconButton aria-label="Mobile Device" icon={<BiDevices />} /> */}
        {/* <BarIconButton
          aria-label="Project Menu"
          icon={<CgMenu />}
          onClick={() => sendMainIpc(MainIpcChannel.ProjectMenu)}
        /> */}
      </Flex>
    </Flex>
  )
}

export default TopBar
