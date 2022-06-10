import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef, MatSnackBar, MatSnackBarConfig, MatTabChangeEvent } from "@angular/material";
import { ABTestManagerService } from '../shared/ab-test-manager.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Experiment } from '../shared/experiment.model';


@Component({
  selector: 'ab-test-delete-experiment',
  templateUrl: './delete.component.html'
})

export class ABTestDeleteComponent implements OnInit {

  constructor(public dialogref: MatDialogRef<ABTestDeleteComponent>,
    public _router: Router,
    public _service: ABTestManagerService,
    private _toastr: MatSnackBar) { };

  TestToDelete: Experiment;

  ngOnInit(): void {
    this.TestToDelete = this._service.SelectedExperiment;
  }

  ConfirmDelete() {
    try {
      this._service.Experiments = this._service.Experiments.filter(exp => exp.ID != this.TestToDelete.ID);
      this._service.DeleteExperiment(this.TestToDelete.ID);
      this._service.SelectionChange();
      this.Close();
    } catch (err) {
      const config = new MatSnackBarConfig();
      config.panelClass = ['red-snackbar'];
      config.duration = 5000;
      config.verticalPosition = 'top';
      config.horizontalPosition = 'right';
      this._toastr.open("Error deleting experiment", "ok", config)
    }
  }

  Close(): void {
    this.dialogref.close(false);
  }
}
