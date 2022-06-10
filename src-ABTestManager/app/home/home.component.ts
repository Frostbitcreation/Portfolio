import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatSnackBarConfig } from "@angular/material";
import { Router } from '@angular/router';
import { ABTestDeleteComponent } from '../modals/delete.component';
import { ABTestEditComponent } from '../modals/edit.component';
import { ABTestManagerService } from '../shared/ab-test-manager.service';
import { Experiment } from '../shared/experiment.model';

@Component({
  selector: 'ab-test-manager',
  templateUrl: './home.component.html',
})

export class ABTestManagerHomeComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public _router: Router,
    public _service: ABTestManagerService,
    private toastr: MatSnackBar) { };
  
  Title: string = 'AB Test Manager';
  Loading: boolean = false;
  MainLoading: number = 1;
  SiteFiltered: Experiment[];
  ABTestDeleteDialogRef: MatDialogRef<ABTestDeleteComponent>;
  CanFlush: boolean = true;
  FlushInterval: any;

  ngOnInit(): void {
    this._service.GetWebsites();
    this._service.GetExperiments();
    this._service.GetTypes();
    this.DecrementLoading();
  }

  EditExperiment(SelectedExperiment: Experiment): void {
    this._service.SelectedExperiment = SelectedExperiment;
    this._router.navigate(['Edit']);
  }

  OpenCreate(): void {
    this._router.navigateByUrl('Create');
  }

  OpenHelp(): void {
    this._router.navigateByUrl('Help');
  }

  OpenDelete(SelectedExperiment): void {
    this._service.SelectedExperiment = SelectedExperiment;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '600px';
    dialogConfig.height = '400px';
    dialogConfig.position = { top: '200px' };
    dialogConfig.disableClose = true;
    this.ABTestDeleteDialogRef = this.dialog.open(ABTestDeleteComponent, dialogConfig);
    this.ABTestDeleteDialogRef.afterClosed()
  }

  SuccessfulDelete() {
    const config = new MatSnackBarConfig();
    config.panelClass = ['green-snackbar'];
    config.duration = 5000;
    config.verticalPosition = 'top';
    config.horizontalPosition = 'right';
    this.toastr.open("delected Experiment", "ok", config);
  }

  DecrementLoading(): void {
    if (this.MainLoading < 1) this.MainLoading = 0;
    else this.MainLoading--;
  }

  FlushCache() {
    try {
      this._service.FlushCache();
      this.CanFlush = false;

      const config = new MatSnackBarConfig();
      config.panelClass = ['green-snackbar'];
      config.duration = 5000;
      config.verticalPosition = 'top';
      config.horizontalPosition = 'right';
      this.toastr.open("Requested cache flush", "ok", config);

    } catch {
      this.CanFlush = true;

      const config = new MatSnackBarConfig();
      config.panelClass = ['red-snackbar'];
      config.duration = 5000;
      config.verticalPosition = 'top';
      config.horizontalPosition = 'right';
      this.toastr.open("Error requesting cache flush", "ok", config);
    }
  }

  ErrorPopup(err: HttpErrorResponse): void {
    this.toastr.open("Error - " + err.status + ": " + err.error.ExceptionMessage, "ok", { duration: 5000 });
    this.Loading = false;
    this.DecrementLoading();
  }

}
