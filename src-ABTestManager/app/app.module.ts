import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ViewContainerRef } from '@angular/core';
import { MatDialogModule, MatInputModule, MatDatepickerModule, MatFormFieldModule, MatSnackBarModule, MatNativeDateModule, MatProgressSpinnerModule, MatTooltipModule, MatCheckboxModule, MatButtonToggleModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { appRoutes } from './routes';
import { NgbModule, NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { CloseModals } from '../../src-SharedResources/scripts/closeModals';

import { ABTestManagerHomeComponent } from './home/home.component';
import { ABTestManagerAppComponent } from './ab-test-app.component';
import { ABTestManagerService } from './shared/ab-test-manager.service';


import { ABTestEditComponent } from './modals/edit.component';
import { ABTestHelpComponent } from './modals/help.component';
import { ABTestVariantsComponent } from './modals/Tabs/variants.component';
import { ABTestExperimentComponent } from './modals/Tabs/experiment.component';
import { ABTestCreateComponent } from './modals/create.component';
import { ABTestDeleteComponent } from './modals/delete.component';
import { ABTestCreateExperimentComponent } from './modals/create/create.experiment.component';
import { ABTestCreateVariantsComponent } from './modals/create/create.variants.component';

@NgModule({
  declarations: [
    ABTestManagerHomeComponent,
    ABTestManagerAppComponent,
    ABTestEditComponent,
    ABTestCreateComponent,
    ABTestDeleteComponent,
    ABTestHelpComponent,
    ABTestVariantsComponent,
    ABTestExperimentComponent,
    ABTestCreateExperimentComponent,
    ABTestCreateVariantsComponent,
    CloseModals
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    MatDialogModule,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    NgbModule,
  ],
  providers: [
    ABTestManagerHomeComponent,
    ABTestManagerService,
    NgbTabsetConfig,
    CloseModals
  ],
  bootstrap: [ABTestManagerAppComponent],
  entryComponents: [
    ABTestEditComponent,
    ABTestDeleteComponent,
    ABTestCreateComponent,
    CloseModals
  ]
})
export class AppModule { }
