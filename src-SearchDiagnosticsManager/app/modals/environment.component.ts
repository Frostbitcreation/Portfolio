import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CloseModals } from '../../../src-SharedResources/scripts/closeModals';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatTabChangeEvent } from "@angular/material";
import { SearchDiagnosticsService } from '../shared/search-diagnostics.service';

@Component({
  selector: 'serch-diagnostic-environment',
  templateUrl: './environment.component.html'
})

export class SearchDiagnosticsEnvironmentComponent implements OnInit {
  constructor(public dialogref: MatDialogRef<SearchDiagnosticsEnvironmentComponent>,
    private searchDiagnosticsService: SearchDiagnosticsService) { };

  Preview = this.searchDiagnosticsService.PreviewIndex;

  ngOnInit(): void {
    //this.Preview = this.searchDiagnosticsService.PreviewIndex;
  }

  goLive() {
    this.searchDiagnosticsService.PreviewIndex = false;
    console.log("test live")
  }

  goPreview() {
    this.searchDiagnosticsService.PreviewIndex = true;
    console.log("test preview")
  }
}
