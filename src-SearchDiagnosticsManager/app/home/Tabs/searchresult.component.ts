import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { Router } from '@angular/router';
import { SearchDiagnosticsEnvironmentComponent } from '../../modals/environment.component';
import { SearchDiagnosticsWebsitesComponent } from '../../modals/websites.component';
import { Colour } from '../../shared/colour.model';
import { IndexVersion } from '../../shared/index-version.model';
import { SearchDiagnosticsService } from '../../shared/search-diagnostics.service';
import { SearchResponseResultProduct } from '../../shared/search-response-result-product.model';
import { SearchResponseResult } from '../../shared/search-response-result.model';
import { SearchResponse } from '../../shared/search-response.model';
import { Website } from '../../shared/website.model';


@Component({
  selector: 'search-result',
  templateUrl: './searchresult.component.html'
})

export class SearchResultComponent implements OnInit {
  constructor(public dialog: MatDialog,
    private _searchDiagnosticsService: SearchDiagnosticsService,
    public _router: Router,
    private _toastr: MatSnackBar) { };

  readonly MaxWebsitesShown: number = 3;
  Loading: boolean = false;
  IndexName = this._searchDiagnosticsService.CurrentVersion.IndexName;
  IndexSelect: number = 0;
  ColourSelect: number = 0;
  ProductSelect: number = 0;
  Colours: string[];
  ColourVariantID: string;
  SelectedColour: Colour;
  SelectedSite: Website;
  Sites: Website[];
  ColourList: Colour[];
  ProductName: string;

  _searchBody = "{\"query\": {\"match\":{\"ProductId\":\"#value#\"}},\"size\": 10000}";
  SearchIndex: string;
  SearchResult: string = "";
  SearchObject: SearchResponse;
  SiteFiltered: SearchResponseResult[];
  SearchData: SearchResponseResultProduct = new SearchResponseResultProduct;
  prodId: string;

  IndexSelector: string[] = ["-- Please Select --"]
  IndexStore: string[];
  StringAlias: string[] = [];
  SelectedIndex: string;

  IndexWebsitesDialogRef: MatDialogRef<SearchDiagnosticsWebsitesComponent>;
  IndexEnvironmentDialogRef: MatDialogRef<SearchDiagnosticsEnvironmentComponent>;
  MainLoading: number = 1;

  ngOnInit(): void {
    this.PopulateIndexSelectorOptionsAndValues();

    document.getElementById("prodId").addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        document.getElementById("prodIdBtn").click();
      }
    });
  }

  //Index Selector
  HandleChangeIndexEvent(): void {
    var change = this.IndexSelect - 1;
    var temp = this.StringAlias[change];
    let tempArr = this._searchDiagnosticsService.Indices.filter(indices => indices.includes(temp));
    tempArr = tempArr.sort();
    this.SelectedIndex = tempArr[tempArr.length - 1];
  }

  PopulateIndexSelectorOptionsAndValues() {
    this._searchDiagnosticsService.Versions = this._searchDiagnosticsService.Versions.sort((a, b) => (a.IndexName > b.IndexName) ? 1 : -1);
    this._searchDiagnosticsService.Versions.forEach(version => this.IndexSelector.push(version.IndexName));
    this._searchDiagnosticsService.Versions.forEach(version => {
      let temp = version.LiveIndex.indexOf("v");
      let alias = version.LiveIndex.substring(0, temp - 1);
      this.StringAlias.push(alias);
    });
    this.StringAlias = this.StringAlias.sort();
  }

  MakeElasticSearch(Query: string) {
    this.SearchObject = null;
    this.SearchResult = "";
    this.SearchData = null;
    this.SiteFiltered = null;
    this.ColourList = null;
    this.Sites = null;
    //check query
    this.RegexCheck(Query);
    //make search
    try {
      this._searchDiagnosticsService.FetchesData(Query, this.SelectedIndex).subscribe(data => {
        this.SearchResult = data.StringResult;
        //ObjectResult recieved as string, relies on angular to parse.
        this.SearchObject = JSON.parse(data.StringResult)

        this.FilterWebsitesAndAssignDefaultWebsite();
        this.HandleSiteChangeEvent();
      });
    } catch (error) {
      //TODO add error handling using toaster
      window.alert(error);
    }
  }

  //SiteCodes (Site Oriented Filter)
  FilterWebsitesAndAssignDefaultWebsite() {
    // get flat array of all site shortcodes attached to search results
    var searchSiteShortCodes = this.SearchObject.hits.hits.map(hit => hit._source.SiteShortCode);

    //filter all websites for dropdown to only those contained in search results
    this.Sites = this._searchDiagnosticsService.Sites.filter(ls => searchSiteShortCodes.indexOf(ls.SHORTNAME) >= 0);

    //assign first site to auto-selected value
    this.SelectedSite = this.Sites[0];
  }

  // Colours for colour select
  FilterColoursBasedOnSelectedWebsiteAndAssignDefault() {
    let colours = this.SiteFiltered.map(function (hit) {
      var colObj = new Colour;
      colObj.Code = hit._source.ColourVariantID;
      colObj.Colour = hit._source.CleanColour;

      return colObj;
    });
    this.ColourList = colours.sort((a, b) => (a.Code > b.Code) ? 1 : -1);
    this.SelectedColour = this.ColourList[0];
  }


  // Change Colour option
  HandleColourChangeEvent(): void {
    this.ProductSelect = this.SiteFiltered.findIndex(hits => (hits._source.ColourVariantID === this.SelectedColour.Code) && (hits._source.SiteShortCode === this.SelectedSite.SHORTNAME));
    this.SearchData = this.SiteFiltered[this.ProductSelect]._source;
  };

  // Change Site option
  HandleSiteChangeEvent(): void {
    this.SiteFiltered = this.SearchObject.hits.hits.filter(hits => hits._source.SiteShortCode == this.SelectedSite.SHORTNAME);
    this.FilterColoursBasedOnSelectedWebsiteAndAssignDefault();
    this.HandleColourChangeEvent();
  };

  //Clientside validation for 6 digit product ID
  RegexCheck(Query: string) {
    const regex = /^([0-9]|[a-z]){2}[0-9]{4}$/i;
    const str = Query;
    let m;

    if ((m = regex.exec(str)) !== null) {
      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        //console.log(`Found match, group ${groupIndex}: ${match}`);
      });
    } else {
       window.alert("Search is not a valid ID. ID must be 2 letters/numbers, then 4 numbers e.g. AL4894");
    }
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
    this.IndexWebsitesDialogRef = this.dialog.open(SearchDiagnosticsWebsitesComponent, dialogConfig);
  }

  DecrementLoading(): void {
    if (this.MainLoading < 1) this.MainLoading = 0;
    else this.MainLoading--;
  }

  ErrorPopup(err: HttpErrorResponse): void {
    this._toastr.open("Error - " + err.status + ": " + err.error.ExceptionMessage, "ok", { duration: 5000 });
    this.Loading = false;
    this.DecrementLoading();
  }

}
