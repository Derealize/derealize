import profileModel, { ProfileModel } from './profile'
import projectModel, { ProjectModel } from './project'
import libraryModel, { LibraryModel } from './library'

export interface StoreModel {
  profile: ProfileModel
  project: ProjectModel
  library: LibraryModel
}

const storeModel: StoreModel = {
  profile: profileModel,
  project: projectModel,
  library: libraryModel,
}

export default storeModel
