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
  const setProjectViewElements = useStoreActions((actions) => actions.project.setProjectViewElements)

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
        <BarIconButton
          aria-label="Pages"
          icon={<IoBookmarksOutline />}
          onClick={() => sendMainIpc(MainIpcChannel.PagesMenu)}
        />

        <ButtonGroup size="sm" ml={2} isAttached variant="outline">
          <Tooltip label="Undo">
            <IconButton
              borderRadius="full"
              aria-label="Undo"
              isDisabled={!historys.filter((h) => !h.revoked)?.length}
              icon={<MdUndo />}
              onClick={() => revokeHistory(project.id)}
            />
          </Tooltip>
          <Tooltip label="Redo">
            <IconButton
              borderRadius="full"
              aria-label="Redo"
              isDisabled={!historys.filter((h) => h.revoked)?.length}
              icon={<MdRedo />}
              onClick={() => redoHistory(project.id)}
            />
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="sm" ml={2} isAttached variant="outline">
          <Button
            borderRadius="full"
            mr="-px"
            isDisabled={!pendingElements?.length}
            onClick={() => savedElements(project.id)}
          >
            Save
          </Button>
          <IconButton
            borderRadius="full"
            aria-label="Save"
            icon={project.viewElements ? <IoIosArrowUp /> : <IoIosArrowDown />}
            onClick={() => {
              setProjectViewElements({
                projectId: project.id,
                isView: !project.viewElements,
              })
            }}
          />
        </ButtonGroup>
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
        <IconButton
          aria-label="Refresh"
          borderRadius="full"
          icon={<MdRefresh />}
          onClick={() => sendMainIpc(MainIpcChannel.Refresh, project.id)}
        />
        <ButtonGroup
          size="sm"
          ml={2}
          isAttached
          variant="outline"
          isDisabled={project.view !== ProjectView.BrowserView}
        >
          <IconButton
            aria-label="Backward"
            borderRadius="full"
            mr="-px"
            icon={<MdArrowBack />}
            onClick={() => sendMainIpc(MainIpcChannel.Backward, project.id)}
          />
          <IconButton
            aria-label="Forward"
            borderRadius="full"
            icon={<MdArrowForward />}
            onClick={() => sendMainIpc(MainIpcChannel.Forward, project.id)}
          />
        </ButtonGroup>
        <BarIconButton aria-label="Disable Cursor" icon={<HiCursorClick />} />
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
