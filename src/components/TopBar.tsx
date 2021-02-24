import React, { useEffect } from 'react'
import {
  Flex,
  Box,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import { EditIcon, AddIcon, WarningTwoIcon, RepeatIcon } from '@chakra-ui/icons'
import cs from 'classnames'
import { css } from '@emotion/react'
import { Project } from '../models/project'
import { useStoreActions, useStoreState } from '../reduxStore'
import style from './TopBar.module.scss'

const TopBar = (): JSX.Element => {
  const project = useStoreState<Project | null>((state) => state.project.frontProject)

  return (
    <Flex className={style.topbar} justify="space-between">
      <Flex align="center">
        <Popover>
          <PopoverTrigger>
            <Text>✎{project?.changes?.length || 0}</Text>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <List spacing={3}>
                {project?.changes?.map((f) => (
                  <ListItem key={f.file}>
                    <ListIcon as={EditIcon} color="green.500" />
                    <Text>{f.file}</Text>
                  </ListItem>
                ))}
              </List>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Box>{project?.url}</Box>
      </Flex>
    </Flex>
  )
}

export default TopBar
