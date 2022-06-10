import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogConfig, MatDialogRef, MatSnackBar, MatTabChangeEvent } from "@angular/material";
import { ABTestManagerService } from '../../shared/ab-test-manager.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Experiment } from '../../shared/experiment.model';
import { Variant } from '../../shared/variant.model';
import { AbTestType } from '../../shared/test-type.model';
import { Website } from '../../shared/website.model';
import { ABTestCreateComponent } from '../create.component';

@Component({
  selector: 'ab-test-create-experiment',
  templateUrl: './create.experiment.component.html'
})

export class ABTestCreateExperimentComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public _router: Router,
    public _create: ABTestCreateComponent,
    public _service: ABTestManagerService,
    private _toastr: MatSnackBar) { };

  Types: string[];
  Sites: Website[];
  SelectionInvalid: boolean = false;
  Filtered: number = 0;

  ngOnInit(): void {
    this.FilterUniqueTypes();
    this.Sites = this._service.AllSites;
  };

  FilterUniqueTypes(): void {
    var expTypes = this._service.TestTypes.Variants.map(function (variant) { return variant.TestType; });
    var types = new Set(expTypes);
    this.Types = Array.from(types);
  };

  TypeChange(): void {
    this.TestAvailability();
    this._create.Type.Variants = this._service.TestTypes.Variants.filter(v => this._create.SelectedType == v.TestType)
  };

  SiteChange(): void {
    this.TestAvailability();
  };

  DescChange(): void {
    let desc: string = this._create.Description;
    this.RegCheck(desc);
  };

  TestAvailability(): void {
    if (this._create.SelectedType != null && this._create.Site != null) {

      var filtered = this._service.Experiments.filter(exp => (exp.Reference == this._create.SelectedType) && (exp.BranchCode == this._create.Site) && exp.Status == 'Enabled');
      if (filtered.length >= 1) {
        this._create.ExpValid = false;
      } else {
        this._create.ExpValid = true;
      };
    };
  };

  RegCheck(input: string) {
    var regex = new RegExp("[\\{}\$<>\"']")
    let test: boolean = regex.test(input)
    if (test) {
      //contains regex
      this._toastr.open("Must not use the following symbols ' { } < > $ \" ", "ok", {
        panelClass: ['red-snackbar'],
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
    }
  };

}
