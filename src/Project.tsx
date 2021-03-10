import React, { useEffect } from 'react'
import cs from 'classnames'
import { Text, Button } from '@chakra-ui/react'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { PuffLoader } from 'react-spinners'
import { useStoreActions, useStoreState } from './reduxStore'
import Project from './models/project.interface'
import TopBar from './components/TopBar'
import style from './Project.module.scss'
import PreloadWindow from './preload_interface'

declare const window: PreloadWindow

const ProjectView = (): JSX.Element => {
  const loading = useStoreState<boolean>((state) => state.project.loading)
  const debugging = useStoreState<boolean>((state) => state.project.debugging)
  const project = useStoreState<Project | null>((state) => state.project.frontProject)
  const setDebugging = useStoreActions((actions) => actions.project.setDebugging)

  return (
    <>
      <TopBar />
      <div className={style.content}>
        <PuffLoader loading={loading} color="#4FD1C5" />
        {debugging && project && (
          <>
            <div className={style.output}>
              {project.runningOutput?.map((o, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Text key={i} color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'}>
                  {o}
                </Text>
              ))}
            </div>
            <Button
              leftIcon={<AiOutlineCloseCircle />}
              onClick={() => {
                setDebugging(false)
                window.electron.frontProjectView(project)
              }}
            >
              Close
            </Button>
          </>
        )}
      </div>
    </>
  )
}

export default ProjectView
