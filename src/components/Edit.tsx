/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
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
  Button,
} from '@chakra-ui/react'
import { useStoreActions, useStoreState } from '../reduxStore'
import type { Project } from '../models/project.interface'

type Inputs = {
  displayname: string
  branch: string
}

const EditProject = (): JSX.Element => {
  // const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const project = useStoreState<Project | undefined>((state) => state.project.editingProject)
  const setEditingProject = useStoreActions((actions) => actions.project.setEditingProject)
  const editProject = useStoreActions((actions) => actions.project.editProject)

  const submit = useCallback(
    (data) => {
      if (!project) return
      editProject(data)
      setEditingProject(null)
    },
    [project, setEditingProject, editProject],
  )

  return (
    <>
      <Modal isOpen={!!project} onClose={() => setEditingProject(null)} scrollBehavior="outside" size="5xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Import Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="displayname" mt={4}>
              <FormLabel>Display Name</FormLabel>
              <Input
                defaultValue={project?.name}
                type="text"
                {...register('displayname', { required: true, shouldUnregister: true })}
              />
              {errors.displayname && <FormErrorMessage>This field is required</FormErrorMessage>}
            </FormControl>

            <FormControl id="branch" mt={4} isInvalid={!!errors.branch}>
              <FormLabel>Git Branch</FormLabel>
              <Input
                {...register('branch', { required: true, shouldUnregister: true })}
                type="text"
                defaultValue={project?.branch}
                colorScheme="gray"
              />
              <FormHelperText>If you don&apos;t know what this means please don&apos;t change</FormHelperText>
              {errors.branch && <FormErrorMessage>This field is required</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="teal" size="lg" variant="solid" onClick={handleSubmit(submit)} ml={6}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default EditProject
