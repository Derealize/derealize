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
import { VscRepoPush, VscRepoPull, VscOutput, VscDebugStart, VscDebugStop } from 'react-icons/vsc'
import { HiCursorClick, HiOutlineStatusOnline } from 'react-icons/hi'
import { IoBookmarksOutline, IoChevronForward } from 'react-icons/io5'
import { MdUndo, MdRedo } from 'react-icons/md'
import { IoIosArrowDown } from 'react-icons/io'
import type { BoolReply } from '../backend/backend.interface'
import { ProjectStatus, Handler } from '../backend/backend.interface'
import { Project, ProjectView } from '../models/project.interface'
import type { ElementState, ElementHistory } from '../models/element'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'
import { MainIpcChannel, BreadcrumbPayload } from '../interface'
import type { PreloadWindow } from '../preload'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpc } = window.derealize

const BarIconButton = React.forwardRef(
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
  const toast = useToast()

  const project = useStoreState<Project | undefined>((state) => state.project.frontProject)
  const startProject = useStoreActions((actions) => actions.project.startProject)
  const stopProject = useStoreActions((actions) => actions.project.stopProject)

  const setProjectView = useStoreActions((actions) => actions.project.setProjectView)

  const callGitHistory = useStoreActions((actions) => actions.project.callGitHistory)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)
  const pendingElements = useStoreState<Array<ElementState>>((state) => state.element.pendingElements)
  const savedElements = useStoreActions((actions) => actions.element.savedElements)

  const historys = useStoreState<Array<ElementHistory>>((state) => state.element.frontHistory)

  const revokeHistory = useStoreActions((actions) => actions.element.revokeHistory)
  const redoHistory = useStoreActions((actions) => actions.element.redoHistory)

  const breadcrumbs = useMemo(() => {
    return element?.selector.split('>').map((sel, index) => ({ sel: sel.split(/[#\\.]/)[0], tooltip: sel, index }))
  }, [element])

  const callPull = useCallback(async () => {
    if (!project) return null

    const reply = (await sendBackIpc(Handler.Pull, { projectId: project.id })) as BoolReply
    if (reply.error) {
      toast({
        title: `Pull error:${reply.error}`,
        status: 'error',
      })
    } else {
      toast({
        title: `Pull: ${reply.result}`,
        status: 'success',
      })
    }
    return null
  }, [project, toast])

  const callPush = useCallback(async () => {
    if (!project) return null

    const reply = (await sendBackIpc(Handler.Push, { projectId: project.id })) as BoolReply
    if (reply.error) {
      toast({
        title: `Push error:${reply.error}`,
        status: 'error',
      })
    } else {
      toast({
        title: `Push: ${reply.result}`,
        status: 'success',
      })
    }
    return null
  }, [project, toast])

  if (!project) return <></>

  return (
    <Flex className={style.topbar} justify="space-between">
      <Flex align="center">
        <BarIconButton
          aria-label="Pages"
          icon={<IoBookmarksOutline />}
          onClick={() => sendMainIpc(MainIpcChannel.PagesMenu)}
        />

        <Tooltip label="files status and history">
          <BarIconButton
            aria-label="FileStatus"
            selected={project.view === ProjectView.FileStatus}
            icon={<HiOutlineStatusOnline />}
            onClick={() => {
              if (project.view !== ProjectView.FileStatus) {
                callGitHistory()
                setProjectView({ projectId: project.id, view: ProjectView.FileStatus })
              } else {
                setProjectView({ projectId: project.id, view: ProjectView.BrowserView })
              }
            }}
          />
        </Tooltip>

        <Tooltip label="pull remote files">
          <BarIconButton
            aria-label="Pull"
            icon={<VscRepoPull />}
            disabled={project.changes?.length !== 0}
            onClick={() => callPull()}
          />
        </Tooltip>

        <Tooltip label="push files to remote">
          <BarIconButton
            aria-label="Push"
            icon={<VscRepoPush />}
            disabled={project.changes?.length === 0}
            onClick={() => callPush()}
          />
        </Tooltip>

        <ButtonGroup size="sm" isAttached variant="outline" isDisabled={!historys.filter((h) => !h.revoked)?.length}>
          <Tooltip label="Undo">
            <IconButton
              borderRadius="full"
              aria-label="Undo"
              icon={<MdUndo />}
              onClick={() => revokeHistory(project.id)}
            />
          </Tooltip>
          <Tooltip label="Redo">
            <IconButton
              borderRadius="full"
              aria-label="Redo"
              icon={<MdRedo />}
              onClick={() => redoHistory(project.id)}
            />
          </Tooltip>
        </ButtonGroup>

        <ButtonGroup size="sm" isAttached variant="outline" isDisabled={!historys.filter((h) => h.revoked)?.length}>
          <Button
            borderRadius="full"
            mr="-px"
            disabled={!pendingElements?.length}
            onClick={() => savedElements(project.id)}
          >
            Save
          </Button>
          <IconButton
            borderRadius="full"
            aria-label="Save"
            icon={<IoIosArrowDown />}
            onClick={() => {
              setProjectView({
                projectId: project.id,
                view: project.view === ProjectView.Elements ? ProjectView.BrowserView : ProjectView.Elements,
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
        <BarIconButton aria-label="Disable Cursor" icon={<HiCursorClick />} />
        {project.status === ProjectStatus.Ready && (
          <Tooltip label="start">
            <BarIconButton aria-label="Start" icon={<VscDebugStart />} onClick={() => startProject(project.id)} />
          </Tooltip>
        )}
        {(project.status === ProjectStatus.Running || project.status === ProjectStatus.Starting) && (
          <Tooltip label="stop">
            <BarIconButton aria-label="Stop" icon={<VscDebugStop />} onClick={() => stopProject(project.id)} />
          </Tooltip>
        )}
        {/* https://discuss.atom.io/t/emulate-touch-scroll/27429/3 */}
        {/* <BarIconButton aria-label="Mobile Device" icon={<BiDevices />} /> */}
        <Tooltip label="debug information">
          <BarIconButton
            aria-label="Debug"
            selected={project.view === ProjectView.Debugging}
            icon={<VscOutput />}
            onClick={() => {
              if (project.view !== ProjectView.Debugging) {
                setProjectView({ projectId: project.id, view: ProjectView.Debugging })
              } else {
                setProjectView({ projectId: project.id, view: ProjectView.BrowserView })
              }
            }}
          />
        </Tooltip>
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
