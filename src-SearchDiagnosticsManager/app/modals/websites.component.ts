import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CloseModals } from '../../../src-SharedResources/scripts/closeModals';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar, MatTabChangeEvent } from "@angular/material";
import { SearchDiagnosticsService } from '../shared/search-diagnostics.service';

@Component({
  selector: 'serch-diagnostic-websites',
  templateUrl: './websites.component.html'
})

export class SearchDiagnosticsWebsitesComponent implements OnInit {
  constructor(public dialogref: MatDialogRef<SearchDiagnosticsWebsitesComponent>,
    private searchDiagnosticsService: SearchDiagnosticsService) { };

  ngOnInit(): void {
    if (this.searchDiagnosticsService.CurrentVersion)
      this.ViewingSites = this.searchDiagnosticsService.CurrentVersion.Websites;
  }

  ViewingSites: string[] = [];
  SearchTerm: string = "";

  Filter(): void {
    this.ViewingSites = this.searchDiagnosticsService.CurrentVersion.Websites
      .filter(site => {
        return site.toLowerCase().includes(this.SearchTerm.toLowerCase());
      });
  }

  ClearSearch(): void {
    this.SearchTerm = "";
    this.Filter();
  }
}
