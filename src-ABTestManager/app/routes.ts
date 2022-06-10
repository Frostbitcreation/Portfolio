import { Routes } from '@angular/router';
import { ABTestManagerHomeComponent } from './home/home.component';
import { ABTestCreateComponent } from './modals/create.component';
import { ABTestEditComponent } from './modals/edit.component';
import { ABTestHelpComponent } from './modals/help.component';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ABTestManagerHomeComponent
  },
  {
    path: 'Edit',
    component: ABTestEditComponent
  },
  {
    path: 'Create',
    component: ABTestCreateComponent
  },
  {
    path: 'Help',
    component: ABTestHelpComponent
  }
];
