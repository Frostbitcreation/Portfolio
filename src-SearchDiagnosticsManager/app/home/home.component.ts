import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { Router } from '@angular/router';
import { SearchDiagnosticsWebsitesComponent } from '../modals/websites.component';
import { IndexVersion } from '../shared/index-version.model';
import { SearchDiagnosticsService } from '../shared/search-diagnostics.service';

@Component({
  selector: 'search-diagnostics-manager',
  templateUrl: './home.component.html',
})

export class SearchDiagnosticsHomeComponent implements OnInit {

  constructor(public dialog: MatDialog,
    public _router: Router,
    private toastr: MatSnackBar,
    private _searchDiagnosticsService: SearchDiagnosticsService) { };

  ProdId: string;
  Title: string = 'Search Diagnostics Manager';
  IndexSelect: number = 1;
  readonly MaxWebsitesShown: number = 3;
  _indexWebsitesDialogRef: MatDialogRef<SearchDiagnosticsWebsitesComponent>;
  Loading: boolean = false;
  MainLoading: number = 1;

  ngOnInit(): void {
    this._searchDiagnosticsService.GetVersions();
    this._searchDiagnosticsService.GetElasticIndices();
    this._searchDiagnosticsService.GetWebsites();

    if (this._searchDiagnosticsService.CurrentVersion) this.IndexSelect = this._searchDiagnosticsService.CurrentVersion.IndexId;

    if (!this._searchDiagnosticsService.escListener) {
      this._searchDiagnosticsService.escListener = true;
      document.addEventListener("keyup", (event) => {
        if (event.keyCode == 27 && this._router.url != '/') this._router.navigateByUrl('');
      });
    }
    this._searchDiagnosticsService.ChangeSelectedIndexVersion(this.IndexSelect);
    this.DecrementLoading();
    setInterval(func => {
      this._searchDiagnosticsService.GetVersions();
      this._searchDiagnosticsService.GetElasticIndices();
      this._searchDiagnosticsService.GetWebsites();
      return func;
    }, (1000 * 60 * 10));
    //Every 10 minutes, update the background data 
  }

  FilterObject(toFilter: object, searchTerm: string): boolean {
    let temp = JSON.parse(JSON.stringify(toFilter));

    for (let prop in temp) {
      if (temp[prop] != null) {
        if (typeof temp[prop] == "object") {
          var obj = temp[prop];
          if (this.FilterObject(obj, searchTerm)) return true;
        }
        else {
          var propStr = '' + temp[prop];
          if (propStr.toLowerCase().includes(searchTerm.toLowerCase())) return true;
        }
      }
    }
    return false;
  }

  FormatWebsites(): string {
    if (this._searchDiagnosticsService.CurrentVersion) return this._searchDiagnosticsService.CurrentVersion.Websites.slice(0, this.MaxWebsitesShown).toString().replace(/,/g, ", ");
    else return "";
  }

  FormatWebsiteTooltip(): string {
    if (this._searchDiagnosticsService.CurrentVersion) return this._searchDiagnosticsService.CurrentVersion.Websites.slice(this.MaxWebsitesShown, this.MaxWebsitesShown * 2).toString().replace(/,/g, ", ") + (this.MaxWebsitesShown * 2 > this._searchDiagnosticsService.CurrentVersion.Websites.length ? "" : "... Click icon to see all.");
    else return "";
  }

  FormatEnvironmentTooltip(): string {
    if (this._searchDiagnosticsService.PreviewIndex != null) { return "Click to Configure Index..." } else { return "err" }
  }

  GetLiveVersions(): IndexVersion[] {
    if (this._searchDiagnosticsService.Versions.length) return this._searchDiagnosticsService.Versions.filter(vers => vers.Live);
    else return []
  }

  OpenHelp(): void {
    this._router.navigateByUrl('Help');
  }

  OpenWebsites(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '550px';
    dialogConfig.height = '750px';
    dialogConfig.position = { top: '100px' };
    dialogConfig.disableClose = false;
    this._indexWebsitesDialogRef = this.dialog.open(SearchDiagnosticsWebsitesComponent, dialogConfig);
  }

  DecrementLoading(): void {
    if (this.MainLoading < 1) this.MainLoading = 0;
    else this.MainLoading--;
  }

  ErrorPopup(err: HttpErrorResponse): void {
    this.toastr.open("Error - " + err.status + ": " + err.error.ExceptionMessage, "ok", { duration: 5000 });
    this.Loading = false;
    this.DecrementLoading();
  }

}
