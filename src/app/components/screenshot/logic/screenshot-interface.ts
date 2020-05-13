import {UserInterface} from '../../users/logic/user-interface';

export interface ScreenshotInterface {
  userId: UserInterface,
  files: Array<string>;
}
