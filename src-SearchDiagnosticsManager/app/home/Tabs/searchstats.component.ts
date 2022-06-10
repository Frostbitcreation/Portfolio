import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material";
import { Router } from '@angular/router';
import { SearchDiagnosticsService } from '../../shared/search-diagnostics.service';
import { StatsResponseResultContainer } from '../../shared/SearchStats/stats-response-result-container.model';
import { StatsResponseResult } from '../../shared/SearchStats/stats-response-result.model';
import { Website } from '../../shared/website.model';


@Component({
  selector: 'search-stats',
  templateUrl: './searchstats.component.html'
})

export class SearchStatsComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private _searchDiagnosticsService: SearchDiagnosticsService,
    public _router: Router) { }

  Loading: boolean = false;
  SelectedSite: Website;

  StatsHits: StatsResponseResultContainer;
  //Filtered Properties
  SiteFiltered: StatsResponseResult[]; //Filtered object container
  FilteredTotal: number;
  Sites = [];
  SiteList: Website[];
  ParsedWebsites: Website[] = [];

  ngOnInit(): void {
    document.getElementById("prodSearch").addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        document.getElementById("prodSearchBtn").click();
      }
    });
  }

  MakeSearch(prodSearch: string) {
    this.SelectedSite = null;
    this._searchDiagnosticsService.PostStats(prodSearch).subscribe(data => {
      this._searchDiagnosticsService.StatsResult = data.StringResult;
      //ObjectResult recieved as string, relies on angular to parse.
      this._searchDiagnosticsService.StatsObject = JSON.parse(data.StringResult);
      this.Refresh();
    });
  }

  Refresh() {
    this.StatsHits = this._searchDiagnosticsService.StatsObject.hits;
    this.FilterUniqueSearchResultSites();
  };

  FilterUniqueSearchResultSites() {
    var siteCodes = this.StatsHits.hits.filter(function (hit) {
      return hit._source.SearchInput.Website;
    }).map(function (hit) { return hit._source.SearchInput.Website; });
    var sites = new Set(siteCodes);
    this.Sites = Array.from(sites);
    this.Sites.sort((n1, n2) => n1 - n2);
    this.AttachSitePropertiesAndAssignDefault();
  }

  AttachSitePropertiesAndAssignDefault() {
    var arr1 = this._searchDiagnosticsService.Sites;
    var filter = this.Sites.filter(function (val) {
      return arr1.indexOf(val) == -1;
    });

    this.ParsedWebsites = arr1.filter(function (item) {
      return filter.indexOf(item.SWSTORE) !== -1;
    });

    this.SelectedSite = this.ParsedWebsites[0];
    this.HandleSiteChangeEvent();
  }

  // Change site option
  HandleSiteChangeEvent(): void {
    this.SiteFiltered = this.StatsHits.hits.filter(hits => hits._source.SearchInput.Website == this.SelectedSite.SWSTORE);
  };

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
