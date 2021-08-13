/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useCallback, ChangeEvent } from 'react'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import {
  useToast,
  Stack,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  ButtonGroup,
  Text,
  Grid,
  Box,
  Tooltip,
  Collapse,
  Checkbox,
  Radio,
  RadioGroup,
} from '@chakra-ui/react'
import { BeatLoader, BarLoader } from 'react-spinners'
import { FaRegFolderOpen, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import type { BoolReply } from '../backend/backend.interface'
import type { ImportPayloadStd } from '../interface'
import { Handler, ProjectStatus, Broadcast, ProcessPayload } from '../backend/backend.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { ProjectStd } from '../models/project.interface'
import style from './ImportModal.module.scss'
import type { PreloadWindow } from '../preload'
import { MainIpcChannel, TEMPLATES } from '../interface'
import { ReactComponent as GoodSvg } from '../styles/images/undraw_coolness_dtmq.svg'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpcSync, listenBackIpc, unlistenBackIpc, listenMainIpc, unlistenMainIpc } =
  window.derealize

const gitUrlPattern = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\S]+:[\S]+@)?([\w.@:/\-~]+)(\.git)(\/)?/i

type Inputs = {
  giturl: string
  path: string
  username: string
  password: string
  displayname: string
  branch: string
}

const ImportModal = (): JSX.Element => {
  const toast = useToast()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Inputs>()

  // https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
  // const [, forceUpdate] = useReducer((x) => x + 1, 0)

  const projectId = useStoreState<string | undefined>((state) => state.projectStd.importModalProjectId)
  const toggleModal = useStoreActions((actions) => actions.projectStd.toggleImportModal)

  const projects = useStoreState<Array<ProjectStd>>((state) => state.projectStd.projects)
  const addProject = useStoreActions((actions) => actions.projectStd.addProject)
  const removeProject = useStoreActions((actions) => actions.projectStd.removeProject)
  const openProject = useStoreActions((actions) => actions.projectStd.openProject)

  const useTemplate = useStoreState<string | undefined>((state) => state.projectStd.useTemplate)
  const setUseTemplate = useStoreActions((actions) => actions.projectStd.setUseTemplate)
  const useGit = useStoreState<boolean>((state) => state.projectStd.useGit)
  const setUseGit = useStoreActions((actions) => actions.projectStd.setUseGit)

  const watchGitUrl = watch('giturl')
  const watchPath = watch('path')
  const [showPassword, setShowPassword] = useState(false)

  const [importloading, setImportloading] = useState(false)
  const [installOutput, setInstallOutput] = useState<Array<string>>([])

  const isReady = useStoreState<boolean | undefined>((state) => !!projectId && state.projectStd.isReady(projectId))

  useEffect(() => {
    listenMainIpc(MainIpcChannel.OpenImport, () => {
      toggleModal(true)
    })

    return () => {
      unlistenMainIpc(MainIpcChannel.OpenImport)
    }
  }, [toggleModal])

  useEffect(() => {
    if (!watchGitUrl) return
    setInstallOutput([])

    try {
      const parseURL = new URL(watchGitUrl)
      setValue('username', parseURL.username)
      setValue('password', parseURL.password)

      const projectName = parseURL.pathname.substring(1).replace('.git', '').replaceAll('/', '-')
      setValue('displayname', projectName)
    } catch (err) {
      toast({
        title: err.message,
        status: 'error',
      })
    }
  }, [setInstallOutput, setValue, toast, watchGitUrl])

  const updateUrl = useCallback(
    ({ _username, _password }) => {
      if (!watchGitUrl) return
      try {
        const parseURL = new URL(watchGitUrl)
        if (_username) parseURL.username = _username
        if (_password) parseURL.password = _password
        setValue('giturl', parseURL.href)
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
        })
      }
    },
    [setValue, toast, watchGitUrl],
  )

  const submit = useCallback(
    async (data) => {
      if (!projectId) return

      const { path, displayname, giturl, branch } = data
      if (projects.some((p) => p.path === path || p.giturl === giturl)) {
        toast({
          title: `The path or git-url already exists in your project list.`,
          status: 'error',
        })
        return
      }

      addProject({
        id: projectId,
        path,
        name: displayname,
        giturl: useGit ? giturl : undefined,
        branch: useGit ? branch : undefined,
        editedTime: dayjs().toString(),
        status: ProjectStatus.Initialized,
      })

      setImportloading(true)
      let reply: BoolReply
      if (useTemplate) {
        const payload: ImportPayloadStd = { projectId, path, giturl: useTemplate, branch: 'main' }
        reply = (await sendBackIpc(Handler.Import, payload as any)) as BoolReply

        if (reply.result && useGit) {
          reply = (await sendBackIpc(Handler.MigrateGitOrigin, { projectId, giturl, branch } as any)) as BoolReply
        }
      } else {
        const payload: ImportPayloadStd = {
          projectId,
          path,
          giturl: useGit ? giturl : undefined,
          branch: useGit ? branch : undefined,
        }
        reply = (await sendBackIpc(Handler.Import, payload as any)) as BoolReply
      }

      if (!reply.result) {
        setImportloading(false)
        removeProject(projectId)
        installOutput.push(`import error: ${reply.error}`)
        setInstallOutput(installOutput)
        return
      }

      await sendBackIpc(Handler.Install, { projectId })
    },
    [projectId, projects, addProject, useGit, useTemplate, toast, removeProject, installOutput],
  )

  const open = useCallback(() => {
    if (isReady && projectId) {
      toggleModal(false)
      openProject(projectId)
    }
  }, [openProject, projectId, isReady, toggleModal])

  useEffect(() => {
    listenBackIpc(Broadcast.Installing, (payload: ProcessPayload) => {
      if (payload.error) {
        setImportloading(false)
        toast({
          title: `Installing error:${payload.error}`,
          status: 'error',
        })
        return
      }

      if (payload.stdout) {
        installOutput.push(`stdout: ${payload.stdout}`)
      } else if (payload.stderr) {
        installOutput.push(`stderr: ${payload.stderr}`)
      } else if (payload.exit !== undefined) {
        installOutput.push(`exit: ${payload.error}`)
        setImportloading(false)
      }
      setInstallOutput([...installOutput])
    })
    return () => unlistenBackIpc(Broadcast.Installing)
  }, [installOutput, toast])

  return (
    <Modal isOpen={!!projectId} onClose={() => toggleModal(false)} scrollBehavior="outside" size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Import Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="40% 60%" gap={6}>
            <Box>
              <Checkbox
                isChecked={!!useTemplate}
                mb={2}
                onChange={(e) => setUseTemplate(e.target.checked ? TEMPLATES[0].url : undefined)}
              >
                Use Template
              </Checkbox>
              <Collapse in={!!useTemplate} animateOpacity>
                <RadioGroup onChange={setUseTemplate} value={useTemplate}>
                  <Stack pl={6}>
                    {TEMPLATES.map(({ name, url }) => (
                      <Radio key={name} value={url}>
                        {name}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Collapse>

              <FormControl id="path" mt={4} isInvalid={!!errors.path}>
                <FormLabel>Local Path</FormLabel>
                <Button
                  leftIcon={<FaRegFolderOpen />}
                  colorScheme="gray"
                  disabled={importloading}
                  onClick={(e) => {
                    e.stopPropagation()
                    const filePaths = sendMainIpcSync(MainIpcChannel.SelectDirs)
                    setValue('path', filePaths[0])
                  }}
                >
                  Select Folder
                </Button>
                <Input type="hidden" {...register('path', { required: true })} />
                <Tooltip label={watchPath} aria-label="path">
                  <Text color="gray.500" isTruncated>
                    {watchPath}
                  </Text>
                </Tooltip>
                {errors.path && <FormErrorMessage>This field is required</FormErrorMessage>}
                {(!!useTemplate || useGit) && (
                  <FormHelperText className="prose">
                    Please select a empty folder to initialize the project.
                  </FormHelperText>
                )}
                {!useTemplate && !useGit && (
                  <FormHelperText className="prose">
                    Before select your local project, please configure the project according to{' '}
                    <a href="https://derealize.com/docs/guides/configuration" target="_blank" rel="noreferrer">
                      the documentation
                    </a>
                    .
                  </FormHelperText>
                )}
              </FormControl>

              <Checkbox mt={4} isChecked={useGit} onChange={(e) => setUseGit(e.target.checked)}>
                Use Git
              </Checkbox>
              <Collapse in={!!useGit} animateOpacity>
                <FormControl id="giturl" mt={4} isInvalid={!!errors.giturl}>
                  <FormLabel htmlFor="giturl">Git URL</FormLabel>
                  <Input
                    type="text"
                    {...register('giturl', { required: useGit, pattern: gitUrlPattern })}
                    disabled={importloading}
                  />
                  {!useTemplate && (
                    <FormHelperText className="prose">
                      Before importing your git project, please configure the project according to{' '}
                      <a href="https://derealize.com/docs/guides/configuration" target="_blank" rel="noreferrer">
                        the documentation
                      </a>
                      .
                    </FormHelperText>
                  )}
                  {!!useTemplate && (
                    <FormHelperText className="prose">Please use the url of a new empty git repository.</FormHelperText>
                  )}
                  {errors.giturl && <FormErrorMessage>This field format is not match</FormErrorMessage>}
                </FormControl>

                <FormControl id="username" mt={4} isInvalid={!!errors.username}>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type="text"
                    {...register('username', { required: useGit })}
                    disabled={importloading}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      // setValue('username', e.target.value)
                      updateUrl({ _username: e.target.value })
                    }}
                  />
                  {errors.username && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>

                <FormControl id="password" mt={4} isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>

                  <InputGroup size="md">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password', { required: useGit })}
                      disabled={importloading}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        // setValue('password', e.target.value)
                        updateUrl({ _password: e.target.value })
                      }}
                    />
                    <InputRightElement width={12} className={style.pwdright}>
                      {!showPassword && <FaRegEye onClick={() => setShowPassword(true)} />}
                      {showPassword && <FaRegEyeSlash onClick={() => setShowPassword(false)} />}
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>

                <FormControl id="branch" mt={4} isInvalid={!!errors.branch}>
                  <FormLabel>Git Branch</FormLabel>
                  <Input
                    {...register('branch', { required: useGit })}
                    type="text"
                    disabled={importloading}
                    defaultValue="derealize"
                    colorScheme="gray"
                  />
                  {/* <FormHelperText>If you don&apos;t know what this means please don&apos;t change</FormHelperText> */}
                  {errors.branch && <FormErrorMessage>This field is required</FormErrorMessage>}
                </FormControl>
              </Collapse>

              <FormControl id="displayname" mt={4} isInvalid={!!errors.displayname}>
                <FormLabel>Display Name</FormLabel>
                <Input type="text" {...register('displayname', { required: true })} disabled={importloading} />
                {errors.displayname && <FormErrorMessage>This field is required</FormErrorMessage>}
              </FormControl>
            </Box>
            <Box>
              {!installOutput.length && (
                <VStack justifyContent="center">
                  <GoodSvg className={style.undraw} />
                </VStack>
              )}
              <p className={style.output}>{installOutput.join('\n')}</p>
              {importloading && (
                <p className={style.spinner}>
                  <BarLoader height={4} width={100} color="gray" />
                </p>
              )}
            </Box>
          </Grid>
          {isReady && (
            <Text color="teal.500" align="center">
              Congratulations, it looks like the project is ready to work.
            </Text>
          )}
        </ModalBody>
        <ModalFooter justifyContent="center">
          {isReady && (
            <ButtonGroup variant="outline" size="lg" spacing={6}>
              <Button colorScheme="gray" onClick={() => toggleModal(false)}>
                Close Dialog
              </Button>
              <Button colorScheme="teal" onClick={open}>
                Open &amp; Start Project
              </Button>
            </ButtonGroup>
          )}
          <Button
            colorScheme="teal"
            size="lg"
            variant={isReady ? 'outline' : 'solid'}
            isLoading={importloading}
            spinner={<BeatLoader size={8} color="teal" />}
            onClick={handleSubmit(submit)}
            ml={6}
          >
            Import {isReady && 'Again'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ImportModal
