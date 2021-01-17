import storageModel, { StorageModel } from './storage'
// import profileModel, { ProfileModel } from './profile'

export interface StoreModel {
  storage: StorageModel
  // profile: ProfileModel
}

const storeModel: StoreModel = {
  storage: storageModel,
  // profile: profileModel,
}

export default storeModel
