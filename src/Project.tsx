import React, { useEffect } from 'react'
import cs from 'classnames'
import { Text } from '@chakra-ui/react'
import { PuffLoader } from 'react-spinners'
import { useStoreActions, useStoreState } from './reduxStore'
import { Project } from './models/project'
import TopBar from './components/TopBar'
import style from './Project.module.scss'

const ProjectView = (): JSX.Element => {
  const loading = useStoreState<boolean>((state) => state.project.loading)
  const debugging = useStoreState<boolean>((state) => state.project.debugging)
  const frontProject = useStoreState<Project | null>((state) => state.project.frontProject)

  return (
    <>
      <TopBar />
      <div className={style.content}>
        <PuffLoader loading={loading} color="#4FD1C5" />
        {debugging && frontProject && (
          <div className={style.output}>
            {frontProject.runningOutput?.map((o, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Text color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'} key={i}>
                {o}
              </Text>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default ProjectView
