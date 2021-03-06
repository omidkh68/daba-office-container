import {Compiler, ComponentRef, Injectable, Injector, ViewContainerRef} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LazyComponentService {
  private componentRefs = {
    tasksModuleId: import('../components/tasks/tasks.module'),
    softPhoneModuleId: import('../components/soft-phone/soft-phone.module'),
    conferenceModuleId: import('../components/conference/conference.module'),
    webBrowserModuleId: import('../components/web-browser/web-browser.module'),
    adminPanelModuleId: import('../components/admin-panel/admin-panel.module'),
    eventsHandlerModuleId: import('../components/events/events-handler.module'),
    learningSystemModuleId: import('../components/learning-system/learning-system.module'),
    conferenceCollaborationModuleId: import('../components/conferences-collaboration/conferences-collaboration.module')
  };

  constructor(private compiler: Compiler,
              private injector: Injector) {
  }

  async loadComponent(moduleId: string, container: ViewContainerRef): Promise<ComponentRef<any>> {
    let ref: ComponentRef<any> = null;

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
