import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { ABTestManagerService } from '../shared/ab-test-manager.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ABTestManagerHomeComponent } from '../home/home.component';
import { Experiment } from '../shared/experiment.model';
import { Variant } from '../shared/variant.model';

@Component({
  selector: 'ab-test-edit',
  templateUrl: './edit.component.html'
})

export class ABTestEditComponent {

  constructor(public router: Router,
    private homeComponent: ABTestManagerHomeComponent,
    private _service: ABTestManagerService,
  private _router: Router) { };

  TestVariants: Variant[];

  ngOnInit(): void {
    this._service.GetVariants(this._service.SelectedExperiment.ID);
  }

  Cancel(): void {
    this._router.navigateByUrl('');
  }
}
