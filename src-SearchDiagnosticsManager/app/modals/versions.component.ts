import { SearchDiagnosticsService } from '../shared/search-diagnostics.service';
import { Component, OnInit, Input, Inject } from "@angular/core";
import { Router } from '@angular/router';
import { SearchDiagnosticsHomeComponent } from '../home/home.component';
import { IndexVersion } from '../shared/index-version.model';
import { SearchFilter } from '../shared/filter.model';

@Component({
  selector: 'serch-diagnostics-versions',
  templateUrl: './versions.component.html'
})

export class SearchDiagnosticsVersionsComponent implements OnInit{
  constructor(public router: Router,
    private homeComponent: SearchDiagnosticsHomeComponent,
    private searchDiagnosticsService: SearchDiagnosticsService) { };

  Versions: IndexVersion[];
  Websites: string[];
  SearchTerm: string = "";
  ListFilter: string = "";

  ngOnInit(): void {
    this.Versions = this.searchDiagnosticsService.Versions.filter(vers => vers.IndexId == this.searchDiagnosticsService.CurrentVersion.IndexId);
    this.Versions.sort((a, b) => {
      return b.VersionNumber - a.VersionNumber; //sort by version number descending
    });
    var temp = this.Versions.map(vers => vers.Websites); //get all of the arrays of websites
    var tempFlat = temp.reduce((acc, val) => acc.concat(val), []); //flatten the array of arrays
    this.Websites = tempFlat.filter((v, i, a) => a.indexOf(v) === i); //filter the array to have only unique values
  }

  ClearFilters(): void {
    this.SearchTerm = "";
    this.ListFilter = "";
  }

  ClearSearchTerm(): void {
    this.SearchTerm = "";
  }

  FormatWebsites(): string {
    return this.Websites.filter(site => {
      if (this.SearchTerm) {
        return site.toLowerCase().includes(this.SearchTerm.toLowerCase());
      }
      else if (this.ListFilter) {
        return site.toLowerCase() == this.ListFilter.toLowerCase();
      }
      else {
        return true;
      }
    }).toString().replace(/,/g, ", ");
  }

  SelectVersion(version: IndexVersion): void {
    this.searchDiagnosticsService.CurrentVersion = version;
    this.router.navigateByUrl('');
  }

  Close(): void {
    this.router.navigateByUrl('');
  }
}
