import profileModel, { ProfileModel } from './profile'
import projectModel, { ProjectModel } from './project'
import libraryModel, { LibraryModel } from './library'
import workspaceModel, { WorkspaceModel } from './workspace'
import controllesModel, { ControllesModel } from './controlles/controlles'
import layoutModel, { LayoutModel } from './controlles/layout'
import flexModel, { FlexModel } from './controlles/flex'
import spacingModel, { SpacingModel } from './controlles/spacing'
import gridModel, { GridModel } from './controlles/grid'

export interface StoreModel {
  profile: ProfileModel
  project: ProjectModel
  library: LibraryModel
  workspace: WorkspaceModel
  controlles: ControllesModel
  layout: LayoutModel
  flex: FlexModel
  spacing: SpacingModel
  grid: GridModel
}

const storeModel: StoreModel = {
  profile: profileModel,
  project: projectModel,
  library: libraryModel,
  workspace: workspaceModel,
  controlles: controllesModel,
  layout: layoutModel,
  flex: flexModel,
  spacing: spacingModel,
  grid: gridModel,
}

export default storeModel
