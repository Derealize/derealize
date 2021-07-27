import React, { useEffect, useCallback, useMemo } from 'react'
import {
  useToast,
  Flex,
  Text,
  IconButton,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup,
  Button,
} from '@chakra-ui/react'
import { VscRepoPush, VscRepoPull, VscOutput, VscDebugStart, VscDebugStop, VscFileCode } from 'react-icons/vsc'
import { BsFillStopFill } from 'react-icons/bs'
import { GrUnlink } from 'react-icons/gr'
import { HiCursorClick, HiOutlineStatusOnline } from 'react-icons/hi'
import { IoBookmarksOutline, IoChevronForward } from 'react-icons/io5'
import { AiOutlineSave } from 'react-icons/ai'
import { MdUndo, MdRedo, MdRefresh, MdArrowForward, MdArrowBack } from 'react-icons/md'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { getCrossCtrl } from '../utils/assest'
import type { BoolReply } from '../backend/backend.interface'
import { ProjectStatus, Handler } from '../backend/backend.interface'
import { ProjectWithRuntime, ProjectViewWithRuntime } from '../models/project.interface'
import type { ElementState, ElementHistory } from '../models/element'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'
import { MainIpcChannel, BreadcrumbPayload } from '../interface'
import type { PreloadWindow } from '../preload'
import { BarIconButton } from './TopBar'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpc } = window.derealize

const TopBarWithRuntime: React.FC = (): JSX.Element => {
  const toast = useToast()

  const project = useStoreState<ProjectWithRuntime | undefined>((state) => state.projectWithRuntime.frontProject)
  const startProject = useStoreActions((actions) => actions.projectWithRuntime.startProject)
  const stopProject = useStoreActions((actions) => actions.projectWithRuntime.stopProject)

  const setProjectView = useStoreActions((actions) => actions.projectWithRuntime.setProjectView)
  const setProjectViewHistory = useStoreActions((actions) => actions.project.setProjectViewHistory)

  const callGitHistory = useStoreActions((actions) => actions.projectWithRuntime.callGitHistory)
  const element = useStoreState<ElementState | undefined>((state) => state.element.selectedElement)
  const pendingElements = useStoreState<Array<ElementState>>((state) => state.element.pendingElements)
  const savedElements = useStoreActions((actions) => actions.element.savedElements)

  const historys = useStoreState<Array<ElementHistory>>((state) => state.element.frontHistory)

  const revokeHistory = useStoreActions((actions) => actions.element.revokeHistory)
  const redoHistory = useStoreActions((actions) => actions.element.redoHistory)

  const isDisableLink = useStoreState<boolean>((state) => state.project.isDisableLink)
  const setIsDisableLink = useStoreActions((actions) => actions.project.setIsDisableLink)

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
        <Tooltip label="Pages" placement="top">
          <IconButton
            size="sm"
            aria-label="Pages"
            icon={<IoBookmarksOutline />}
            onClick={() => sendMainIpc(MainIpcChannel.PagesMenu)}
          />
        </Tooltip>

        <ButtonGroup size="sm" ml={2} isAttached>
          <Tooltip label="File Status">
            <IconButton
              aria-label="FileStatus"
              variant={project.view === ProjectViewWithRuntime.FileStatus ? 'outline' : 'solid'}
              icon={<HiOutlineStatusOnline />}
              onClick={() => {
                if (project.view !== ProjectViewWithRuntime.FileStatus) {
                  callGitHistory()
                  setProjectView({ projectId: project.id, view: ProjectViewWithRuntime.FileStatus })
                } else {
                  setProjectView({ projectId: project.id, view: ProjectViewWithRuntime.BrowserView })
                }
              }}
              mr="-px"
            />
          </Tooltip>
          <Tooltip label="Git Pull">
            <IconButton
              aria-label="Pull"
              icon={<VscRepoPull />}
              isDisabled={project.changes?.length === 0}
              onClick={() => callPull()}
              mr="-px"
            />
          </Tooltip>
          <Tooltip label="Git Push">
            <IconButton
              aria-label="Push"
              icon={<VscRepoPush />}
              isDisabled={project.changes?.length === 0}
              onClick={() => callPush()}
            />
          </Tooltip>
        </ButtonGroup>

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
                  <BreadcrumbLink
                    className={style.target}
                    textColor="teal.500"
                    onClick={(e) => {
                      e.stopPropagation()
                      sendMainIpc(MainIpcChannel.OpenPath, project.path, element?.codePosition.split(':')[0])
                    }}
                  >
                    {sel}
                    <VscFileCode className={style.codefile} />
                  </BreadcrumbLink>
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
        <ButtonGroup size="sm" isAttached isDisabled={project.view !== ProjectViewWithRuntime.BrowserView}>
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
              mr="-px"
              icon={<MdArrowForward />}
              onClick={() => sendMainIpc(MainIpcChannel.Forward, project.id)}
            />
          </Tooltip>
          <Tooltip label="Refresh" placement="top">
            <IconButton
              aria-label="Refresh"
              icon={<MdRefresh />}
              onClick={() => sendMainIpc(MainIpcChannel.Refresh, project.id)}
            />
          </Tooltip>
        </ButtonGroup>

        {/* <Tooltip label="Disable Cursor" placement="top">
          <IconButton ml={2} size="sm" aria-label="Disable Cursor" icon={<HiCursorClick />} />
        </Tooltip> */}

        <ButtonGroup size="sm" ml={2} isAttached>
          <Tooltip label="Start" placement="top">
            <IconButton
              aria-label="Start"
              mr="-px"
              icon={<VscDebugStart />}
              onClick={() => startProject(project.id)}
              isDisabled={project.status !== ProjectStatus.Ready}
            />
          </Tooltip>
          <Tooltip label="Stop" placement="top">
            <IconButton
              mr="-px"
              aria-label="Stop"
              icon={<BsFillStopFill />}
              onClick={() => stopProject(project.id)}
              isDisabled={project.status !== ProjectStatus.Running && project.status !== ProjectStatus.Starting}
            />
          </Tooltip>
          <Tooltip label="debug information">
            <IconButton
              aria-label="Debug"
              icon={<VscOutput />}
              onClick={() => {
                if (project.view !== ProjectViewWithRuntime.Debugging) {
                  setProjectView({ projectId: project.id, view: ProjectViewWithRuntime.Debugging })
                } else {
                  setProjectView({ projectId: project.id, view: ProjectViewWithRuntime.BrowserView })
                }
              }}
            />
          </Tooltip>
        </ButtonGroup>

        <Tooltip label="Disable Link (or right click element)" placement="top">
          <IconButton
            size="sm"
            ml={2}
            aria-label="Disable Link"
            icon={<GrUnlink />}
            colorScheme={isDisableLink ? 'pink' : 'gray'}
            onClick={() => {
              sendMainIpc(MainIpcChannel.DisableLink, project.id, !isDisableLink)
              setIsDisableLink(!isDisableLink)
            }}
          />
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

export default TopBarWithRuntime
