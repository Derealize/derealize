import storageModel, { StorageModel } from './storage'
import projectModel, { ProjectModel } from './project'
// import profileModel, { ProfileModel } from './profile'

export interface StoreModel {
  storage: StorageModel
  project: ProjectModel
  // profile: ProfileModel
}

const storeModel: StoreModel = {
  storage: storageModel,
  project: projectModel,
  // profile: profileModel,
}

export default storeModel
