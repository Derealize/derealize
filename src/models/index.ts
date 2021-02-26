import profileModel, { ProfileModel } from './profile'
import projectModel, { ProjectModel } from './project'
import libraryModel, { LibraryModel } from './library'
import historyModel, { HistoryModel } from './history'

export interface StoreModel {
  profile: ProfileModel
  project: ProjectModel
  library: LibraryModel
  history: HistoryModel
}

const storeModel: StoreModel = {
  profile: profileModel,
  project: projectModel,
  library: libraryModel,
  history: historyModel,
}

export default storeModel
