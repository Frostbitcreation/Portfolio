import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef, MatSnackBar, MatTabChangeEvent } from "@angular/material";
import { ABTestManagerService } from '../../shared/ab-test-manager.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ABTestCreateComponent } from '../create.component';

@Component({
  selector: 'ab-test-create-variants',
  templateUrl: './create.variants.component.html'
})

export class ABTestCreateVariantsComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public _create: ABTestCreateComponent,
    public _router: Router,
    public _service: ABTestManagerService,
    private toastr: MatSnackBar) { };

  total: number = 0;

  ngOnInit(): void {
    
  }

  UpdateTotal() {
    var sum: number = 0;
    this._create.Type.Variants.forEach(variant => sum = sum + +variant.Percentage);
    this.total = sum;
  }

}
