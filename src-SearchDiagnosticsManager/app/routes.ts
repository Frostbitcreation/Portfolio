import { Routes } from '@angular/router';
import { SearchDiagnosticsHomeComponent } from './home/home.component';
import { SearchDiagnosticsVersionsComponent } from './modals/versions.component';
import { SearchDiagnosticsHelpComponent } from './modals/help.component';
//import { SearchConfigPublishComponent } from './modals/publish.component';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SearchDiagnosticsHomeComponent
  },
  {
    path: 'Versions',
    component: SearchDiagnosticsVersionsComponent
  },
  {
    path: 'Help',
    component: SearchDiagnosticsHelpComponent
  },
  /*{
    path: 'Publish',
    component: SearchDiagnosticsPublishComponent
  }*/
];
