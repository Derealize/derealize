import profileModel, { ProfileModel } from './profile'
import projectModel, { ProjectModel } from './project'
import libraryModel, { LibraryModel } from './library'
import workspaceModel, { WorkspaceModel } from './workspace'

export interface StoreModel {
  profile: ProfileModel
  project: ProjectModel
  library: LibraryModel
  workspace: WorkspaceModel
}

const storeModel: StoreModel = {
  profile: profileModel,
  project: projectModel,
  library: libraryModel,
  workspace: workspaceModel,
}

export default storeModel
