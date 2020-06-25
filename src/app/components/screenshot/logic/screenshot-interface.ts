// import {UserInterface} from '../../users/logic/user-interface';
import {UserContainerInterface} from '../../users/logic/user-container.interface';

export interface ScreenshotInterface {
  userId: UserContainerInterface,
  files: Array<string>;
}
