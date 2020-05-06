import {UserInterface} from './user-interface';

export interface ScreenshotInterface {
  userId: UserInterface,
  files: Array<string>;
}
