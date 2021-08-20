/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useCallback, ChangeEvent, useMemo } from 'react'
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
  Select,
} from '@chakra-ui/react'
import { BeatLoader, BarLoader } from 'react-spinners'
import { FaRegFolderOpen, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { FiKey } from 'react-icons/fi'
import type { BoolReply } from '../backend/backend.interface'
import type { ImportPayloadStd } from '../interface'
import { Handler, ProjectStatus, Broadcast, ProcessPayload, SshKey } from '../backend/backend.interface'
import { useStoreActions, useStoreState } from '../reduxStore'
import { useDebounce } from '../utils/hooks'
import type { ProjectStd } from '../models/project.interface'
import style from './ImportModal.module.scss'
import type { PreloadWindow } from '../preload'
import { MainIpcChannel, TEMPLATES } from '../interface'
import { ReactComponent as GoodSvg } from '../styles/images/undraw_coolness_dtmq.svg'

declare const window: PreloadWindow
const { sendBackIpc, sendMainIpcSync, listenBackIpc, unlistenBackIpc } = window.derealize

const gitUrlPattern = /((git|ssh|http(s)?)|(git@[\w.]+))(:(\/\/)?)([\S]+:[\S]+@)?([\w.@:/\-~]+)(\.git)(\/)?/i

type Inputs = {
  path: string
  giturl: string
  sshkey: string
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

  const insideFirewall = useStoreState<boolean>((state) => state.profile.insideFirewall)
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
  const isHttpGitUrl = useMemo<boolean | undefined>(() => {
    return watchGitUrl?.startsWith('http')
  }, [watchGitUrl])
  const [sshkeys, setSshKeys] = useState<Array<SshKey>>([])

  const watchPath = watch('path')
  const [showPassword, setShowPassword] = useState(false)

  const [importloading, setImportloading] = useState(false)
  const [installOutput, setInstallOutput] = useState<Array<string>>([])

  const isReady = useStoreState<boolean | undefined>((state) => !!projectId && state.projectStd.isReady(projectId))

  const onChangeNamePassword = useCallback(
    ({ username, password }) => {
      if (!watchGitUrl) return
      try {
        const parseURL = new URL(watchGitUrl)
        if (username) parseURL.username = username
        if (password) parseURL.password = password
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

  const onChangeGitUrl = useDebounce(
    async (giturl: string) => {
      if (!giturl) return

      try {
        const parseURL = new URL(giturl)
        setValue('username', parseURL.username)
        setValue('password', parseURL.password)

        const projectName = parseURL.pathname.substring(1).replace('.git', '').replaceAll('/', '-')
        setValue('displayname', projectName)

        if (!giturl.startsWith('http')) {
          const keys = await sendBackIpc(Handler.ExploreSSHKeys, {})
          setSshKeys(keys as SshKey[])
        }
      } catch (err) {
        toast({
          title: err.message,
          status: 'error',
        })
      }
    },
    500,
    [setValue, toast],
  )

  const submit = useCallback(
    async (data) => {
      if (!projectId) return

      const { path, displayname, giturl, sshkey, branch } = data
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
        sshkey,
        editedTime: dayjs().toString(),
        status: ProjectStatus.Initialized,
      })

      setImportloading(true)
      let reply: BoolReply
      if (useTemplate) {
        const templateGitUrl = insideFirewall ? TEMPLATES[useTemplate].url_firewall : TEMPLATES[useTemplate].url
        const payload: ImportPayloadStd = { projectId, path, giturl: templateGitUrl, branch: 'main' }
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

      // https://stackoverflow.com/a/1234337
      installOutput.length = 0

      if (!reply.result) {
        setImportloading(false)
        removeProject(projectId)
        installOutput.push(`error: import - ${reply.error}`)
        setInstallOutput([...installOutput])
        toast({
          title: `Import error`,
          description: reply.error,
          status: 'error',
        })
        return
      }

      await sendBackIpc(Handler.Install, { projectId })
    },
    [projectId, projects, addProject, useGit, useTemplate, toast, insideFirewall, removeProject, installOutput],
  )

  const open = useCallback(() => {
    if (isReady && projectId) {
      toggleModal(false)
      openProject(projectId)
    }
  }, [openProject, projectId, isReady, toggleModal])

  useEffect(() => {
    listenBackIpc(Broadcast.Installing, (payload: ProcessPayload) => {
      if (projectId !== payload.projectId) return
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
  }, [installOutput, projectId, toast])

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
                disabled={importloading}
                onChange={(e) => setUseTemplate(e.target.checked ? 'nextjs' : undefined)}
              >
                Use Template
              </Checkbox>
              <Collapse in={!!useTemplate} animateOpacity>
                <RadioGroup onChange={setUseTemplate} value={useTemplate} disabled={importloading}>
                  <Stack pl={6} className={style.templates}>
                    {Object.entries(TEMPLATES).map(([key, value]) => (
                      <Radio key={key} value={key}>
                        {value.name}{' '}
                        <a href={value.url} target="_blank" rel="noreferrer">
                          via
                        </a>
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </Collapse>

              <FormControl id="path" mt={4} isInvalid={!!errors.path}>
                <FormLabel>Local Path</FormLabel>
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
              </FormControl>

              <Checkbox
                mt={4}
                isChecked={useGit}
                disabled={importloading}
                onChange={(e) => setUseGit(e.target.checked)}
              >
                Use Git
              </Checkbox>
              <Collapse in={!!useGit} animateOpacity>
                <FormControl id="giturl" mt={4} isInvalid={!!errors.giturl}>
                  <FormLabel htmlFor="giturl">Git URL</FormLabel>
                  <Input
                    type="text"
                    {...register('giturl', { required: useGit, pattern: gitUrlPattern })}
                    disabled={importloading}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      onChangeGitUrl(e.target.value)
                    }}
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

                {!isHttpGitUrl && (
                  <FormControl id="sshkey" mt={4} isInvalid={!!errors.sshkey}>
                    <Select
                      size="sm"
                      variant="flushed"
                      icon={<FiKey />}
                      placeholder="Select SSHKey"
                      disabled={importloading}
                      {...register('sshkey', { required: useGit && !isHttpGitUrl })}
                    >
                      {sshkeys.map((key) => (
                        <option key={key.privateKeyPath} value={key.privateKeyPath}>
                          {key.privateKeyPath}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {isHttpGitUrl && (
                  <FormControl id="username" mt={4} isInvalid={!!errors.username}>
                    <FormLabel>Username</FormLabel>
                    <Input
                      type="text"
                      {...register('username', { required: useGit })}
                      disabled={importloading}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        onChangeNamePassword({ username: e.target.value })
                      }}
                    />
                    {errors.username && <FormErrorMessage>This field is required</FormErrorMessage>}
                  </FormControl>
                )}

                {isHttpGitUrl && (
                  <FormControl id="password" mt={4} isInvalid={!!errors.password}>
                    <FormLabel>Password</FormLabel>

                    <InputGroup size="md">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', { required: useGit })}
                        disabled={importloading}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          onChangeNamePassword({ password: e.target.value })
                        }}
                      />
                      <InputRightElement width={12} className={style.pwdright}>
                        {!showPassword && <FaRegEye onClick={() => setShowPassword(true)} />}
                        {showPassword && <FaRegEyeSlash onClick={() => setShowPassword(false)} />}
                      </InputRightElement>
                    </InputGroup>
                    {errors.password && <FormErrorMessage>This field is required</FormErrorMessage>}
                  </FormControl>
                )}

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
              <p className={style.output}>
                {installOutput.map((o, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Text key={i} color={o.startsWith('error') || o.startsWith('stderr') ? 'red.500' : 'gray.500'}>
                    {o}
                  </Text>
                ))}
              </p>
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
                Start Project
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
