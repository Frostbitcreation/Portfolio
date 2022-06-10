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
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { SearchDiagnosticsHomeComponent } from './home/home.component';
import { SearchDiagnosticsAppComponent } from './search-Diagnostics-app.component';
import { SearchStatsComponent } from './home/tabs/searchstats.component';
import { SearchResultComponent } from './home/tabs/searchresult.component';
import { SearchAnalyzerComponent } from './home/tabs/searchanalyzer.component';

import { SearchDiagnosticsService } from './shared/search-diagnostics.service';

import { SearchDiagnosticsVersionsComponent } from './modals/versions.component';
import { SearchDiagnosticsHelpComponent } from './modals/help.component';
import { SearchDiagnosticsWebsitesComponent } from './modals/websites.component';
import { SearchDiagnosticsEnvironmentComponent } from './modals/environment.component';
import { CloseModals } from '../../src-SharedResources/scripts/closeModals';


@NgModule({
  declarations: [
    SearchResultComponent,
    SearchStatsComponent,
    SearchAnalyzerComponent,
    SearchDiagnosticsAppComponent,
    SearchDiagnosticsHomeComponent,
    SearchDiagnosticsVersionsComponent,
    SearchDiagnosticsHelpComponent,
    SearchDiagnosticsWebsitesComponent,
    SearchDiagnosticsEnvironmentComponent,
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
    NgxJsonViewerModule,
  ],
  providers: [
    SearchDiagnosticsHomeComponent,
    SearchDiagnosticsService,
    NgbTabsetConfig,
    CloseModals
  ],
  bootstrap: [SearchDiagnosticsAppComponent],
  entryComponents: [
    SearchDiagnosticsWebsitesComponent,
    SearchDiagnosticsEnvironmentComponent,
    CloseModals
  ]
})
export class AppModule { }
