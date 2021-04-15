import profileModel, { ProfileModel } from './profile'
import projectModel, { ProjectModel } from './project'
import libraryModel, { LibraryModel } from './library'
import workspaceModel, { WorkspaceModel } from './workspace'
import controllesModel, { ControllesModel } from './controlles/controlles'
import layoutModel, { LayoutModel } from './controlles/layout'
import spacingModel, { SpacingModel } from './controlles/spacing'
import advancedModel, { AdvancedModel } from './controlles/advanced'
import borderModel, { BorderModel } from './controlles/border'

export interface StoreModel {
  profile: ProfileModel
  project: ProjectModel
  library: LibraryModel
  workspace: WorkspaceModel
  controlles: ControllesModel
  layout: LayoutModel
  spacing: SpacingModel
  advanced: AdvancedModel
  border: BorderModel
}

const storeModel: StoreModel = {
  profile: profileModel,
  project: projectModel,
  library: libraryModel,
  workspace: workspaceModel,
  controlles: controllesModel,
  layout: layoutModel,
  spacing: spacingModel,
  advanced: advancedModel,
  border: borderModel,
}

export default storeModel
