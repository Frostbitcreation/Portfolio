import { SearchDiagnosticsService } from '../shared/search-diagnostics.service';
import { Component, OnInit, Input, Inject, AfterViewInit } from "@angular/core";
import { Router } from '@angular/router';
import { SearchDiagnosticsHomeComponent } from '../home/home.component';
import { SearchDiagnosticsExample, SearchDiagnosticsFilterExample } from '../shared/example.model';
import { MatButtonToggleGroup } from '@angular/material';

@Component({
  selector: 'serch-diagnostics-help',
  templateUrl: './help.component.html'
})

export class SearchDiagnosticsHelpComponent {
  constructor(public router: Router,
    private homeComponent: SearchDiagnosticsHomeComponent,
    private searchDiagnosticsService: SearchDiagnosticsService) { };
  CurrentExample: string = "1";

  Close(): void {
    this.router.navigateByUrl('');
  }

  public OnValChange(val: string) {
    this.CurrentExample = val;
  }
}
