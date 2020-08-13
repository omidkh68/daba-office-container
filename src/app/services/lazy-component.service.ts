import {Injectable, Compiler, Injector} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LazyComponentService {
  private componentRefs = {
    tasksModuleId: import('../components/tasks/tasks.module'),
    conferenceModuleId: import('../components/conference/conference.module'),
    softPhoneModuleId: import('../components/soft-phone/soft-phone.module'),
    webBrowserModuleId: import('../components/web-browser/web-browser.module')
  };

  constructor(private compiler: Compiler,
              private injector: Injector) {
  }

  async loadComponent(moduleId, container) {
    let ref;

    try {
      const moduleObj = await this.componentRefs[moduleId];
      const module = moduleObj[Object.keys(moduleObj)[0]];
      const moduleFactory = await this.compiler.compileModuleAsync(module);
      const moduleRef: any = moduleFactory.create(this.injector);
      const componentFactory = moduleRef.instance.resolveComponent();

      ref = container.createComponent(componentFactory, null, moduleRef.injector);
    } catch (e) {
      console.log(e);
    }

    return ref;
  }
}
