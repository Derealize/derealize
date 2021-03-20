import profileModel, { ProfileModel } from './profile'
import projectModel, { ProjectModel } from './project'
import libraryModel, { LibraryModel } from './library'
import workspaceModel, { WorkspaceModel } from './workspace'
import controllesModel, { ControllesModel } from './controlles'

export interface StoreModel {
  profile: ProfileModel
  project: ProjectModel
  library: LibraryModel
  workspace: WorkspaceModel
  controlles: ControllesModel
}

const storeModel: StoreModel = {
  profile: profileModel,
  project: projectModel,
  library: libraryModel,
  workspace: workspaceModel,
  controlles: controllesModel,
}

export default storeModel
