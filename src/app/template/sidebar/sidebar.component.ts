import {Component} from '@angular/core';

export interface Menu {
  name: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  menus: Menu[] = [
    {
      name: 'PAGES.HOME.MENU.TASKS',
      icon: 'playlist_add_check',
      link: 'tasks'
    },
    {
      name: 'PAGES.HOME.MENU.USERS',
      icon: 'persons',
      link: 'users'
    }
  ];
}
