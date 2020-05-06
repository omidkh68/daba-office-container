import {Component, Type} from '@angular/core';

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
  loaded = false;
  myComponent?: Type<any>;
  menus: Menu[] = [
    {
      name: 'PAGES.HOME.MENU.DASHBOARD',
      icon: 'dashboard',
      link: ''
    },
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

  /*openLazyLoadDialog() {
    import('../../components/lazy-dialog/lazy-dialog.module')
      .then(module => module.LazyDialogModule)
      .then(lazyModule => {
        this.loaded = true;
        this.myComponent = lazyModule.components['lazy'];
      });
  }*/
}
