import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef, MatSnackBar, MatTabChangeEvent, MatSnackBarConfig} from "@angular/material";
import { ABTestManagerService } from '../../shared/ab-test-manager.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'ab-test-variants',
  templateUrl: './variants.component.html'
})

export class ABTestVariantsComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public _router: Router,
    public _service: ABTestManagerService,
    private _toastr: MatSnackBar) { };

  ngOnInit(): void {
    
  }

  UpdateVariants() {
    let varWeight: number = 0;
    this._service.Variants.forEach(variant => varWeight = varWeight + +variant.PercentageOfTestUsers);
    if (varWeight == 100) {
      this._service.Variants.forEach(variant => {
        this._service.UpdateVariant(this._service.SelectedExperiment.ID, variant.ExternalID, variant.PercentageOfTestUsers);
      });

      this._toastr.open("Requested edit to variants", "ok", {
        panelClass: ['green-snackbar'],
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });

    } else {
      this._toastr.open("Error editing variants", "ok", {
        panelClass: ['red-snackbar'],
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  }
}
