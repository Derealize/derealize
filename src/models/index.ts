import profileModel, { ProfileModel } from './profile'
import projectModel, { ProjectModel } from './project'
import libraryModel, { LibraryModel } from './library'
import workspaceModel, { WorkspaceModel } from './workspace'
import controllesModel, { ControllesModel } from './controlles/controlles'
import layoutModel, { LayoutModel } from './controlles/layout'
import flexModel, { FlexModel } from './controlles/flex'
import sizeModel, { SizeModel } from './controlles/size'
import spacingModel, { SpacingModel } from './controlles/spacing'

export interface StoreModel {
  profile: ProfileModel
  project: ProjectModel
  library: LibraryModel
  workspace: WorkspaceModel
  controlles: ControllesModel
  layout: LayoutModel
  flex: FlexModel
  size: SizeModel
  spacing: SpacingModel
}

const storeModel: StoreModel = {
  profile: profileModel,
  project: projectModel,
  library: libraryModel,
  workspace: workspaceModel,
  controlles: controllesModel,
  layout: layoutModel,
  flex: flexModel,
  size: sizeModel,
  spacing: spacingModel,
}

export default storeModel
