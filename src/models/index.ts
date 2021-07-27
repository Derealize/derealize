import profileModel, { ProfileModel } from './profile'
import projectModel, { ProjectModel } from './project'
import projectStdModel, { ProjectStdModel } from './project.studio'
import elementModel, { ElementModel } from './element'
import libraryModel, { LibraryModel } from './library'
import workspaceModel, { WorkspaceModel } from './workspace'
import controllesModel, { ControllesModel } from './controlles/controlles'
import layoutModel, { LayoutModel } from './controlles/layout'
import spacingModel, { SpacingModel } from './controlles/spacing'
import borderModel, { BorderModel } from './controlles/border'
import typographyModel, { TypographyModel } from './controlles/typography'
import backgroundModel, { BackgroundModel } from './controlles/background'
import effectsModel, { EffectsModel } from './controlles/effects'

export interface StoreModel {
  profile: ProfileModel
  project: ProjectModel
  projectStd: ProjectStdModel
  element: ElementModel
  library: LibraryModel
  workspace: WorkspaceModel
  controlles: ControllesModel
  layout: LayoutModel
  spacing: SpacingModel
  border: BorderModel
  typography: TypographyModel
  background: BackgroundModel
  effects: EffectsModel
}

const storeModel: StoreModel = {
  profile: profileModel,
  project: projectModel,
  projectStd: projectStdModel,
  element: elementModel,
  library: libraryModel,
  workspace: workspaceModel,
  controlles: controllesModel,
  layout: layoutModel,
  spacing: spacingModel,
  border: borderModel,
  typography: typographyModel,
  background: backgroundModel,
  effects: effectsModel,
}

export default storeModel
