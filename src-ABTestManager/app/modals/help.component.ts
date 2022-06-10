import { ABTestManagerService } from '../shared/ab-test-manager.service';
import { Component, OnInit, Input, Inject, AfterViewInit } from "@angular/core";
import { Router } from '@angular/router';
import { ABTestManagerHomeComponent } from '../home/home.component';
import { MatButtonToggleGroup } from '@angular/material';

@Component({
  selector: 'ab-test-help',
  templateUrl: './help.component.html'
})

export class ABTestHelpComponent {
  constructor(public router: Router,
    private homeComponent: ABTestManagerHomeComponent,
    private _service: ABTestManagerService) { };
  CurrentExample: string = "1";

  Close(): void {
    this.router.navigateByUrl('');
  }

  public OnValChange(val: string) {
    this.CurrentExample = val;
  }
}
