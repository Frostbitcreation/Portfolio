import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef, MatSnackBar, MatTabChangeEvent, MatSnackBarConfig } from "@angular/material";
import { ABTestManagerService } from '../../shared/ab-test-manager.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Experiment } from '../../shared/experiment.model';
import { Variant } from '../../shared/variant.model';

@Component({
  selector: 'ab-test-experiment',
  templateUrl: './experiment.component.html'
})

export class ABTestExperimentComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public _router: Router,
    public _service: ABTestManagerService,
    private _toastr: MatSnackBar) { };

  TestToEdit: Experiment;
  ExistingLive: boolean;
  LiveCount: number;

  ngOnInit(): void {
    this.TestToEdit = this._service.SelectedExperiment;
    
    this.ExperimentsStatusCheck();
  }

  UpdateStatus() {
    this._service.UpdateTest(this.TestToEdit.ID, this.TestToEdit.Status);
    this.ExperimentsStatusCheck();
  }

  ExperimentsStatusCheck() {
    var tests = this._service.Experiments.filter(exp => exp.BranchCode == this.TestToEdit.BranchCode);
    this.LiveCount = tests.filter(exp => exp.Status == 'Enabled' && this.TestToEdit.Reference == exp.Reference).length;

    this.LiveCount > 0 ? this.ExistingLive = true : this.ExistingLive = false;
  }

}
