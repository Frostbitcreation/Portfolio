import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ABTestManagerService } from '../shared/ab-test-manager.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ABTestManagerHomeComponent } from '../home/home.component';
import { Experiment } from '../shared/experiment.model';
import { Variant } from '../shared/variant.model';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { AbTestType } from '../shared/test-type.model';
import { ABTestVariantsComponent } from './Tabs/variants.component';

@Component({
  selector: 'ab-test-create',
  templateUrl: './create.component.html'
})

export class ABTestCreateComponent {

  constructor(public router: Router,
    private homeComponent: ABTestManagerHomeComponent,
    private _service: ABTestManagerService,
    private _toastr: MatSnackBar,
    private _router: Router) { };

  Exp: Experiment = new Experiment();
  Status: string = 'Enabled';
  Site: number = null;
  Duration: number = 30;
  Description: string = null;
  Type: AbTestType = new AbTestType();
  SelectedType: string = null;
  Name: string;
  ExpID: string;
  ExpValid: boolean = null;

  ngOnInit(): void {

  }

  Cancel(): void {
    this._router.navigateByUrl('');
  }

  CreateExperiment() {
    this.Exp.BranchCode = this.Site;
    this.Exp.ExternalID = this.ExpID;
    this.Exp.Name = this.Name;
    this.Exp.CookiePersistenceDays = this.Duration;
    this.Exp.Status = this.Status;
    this.Exp.Description = this.Description;
    this.Exp.Reference = this.Type.Variants[0].TestType;
    this.Exp.CookieName = this.Type.Variants[0].CookieName;

    try {
      this._service.CreateExperiment(this.Exp, this.Type);

      const config = new MatSnackBarConfig();
      config.panelClass = ['green-snackbar'];
      config.duration = 5000;
      config.verticalPosition = 'top';
      config.horizontalPosition = 'right';
      this._toastr.open("Successfully created Experiment", "ok", config)

    } catch (err) {

      const config = new MatSnackBarConfig();
      config.panelClass = ['red-snackbar'];
      config.duration = 5000;
      config.verticalPosition = 'top';
      config.horizontalPosition = 'right';
      this._toastr.open("Error creating Experiment", "ok", config)
    }
  }
}
