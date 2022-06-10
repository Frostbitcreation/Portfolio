import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from "@angular/material";
import { Router } from '@angular/router';
import { SearchDiagnosticsService } from '../../shared/search-diagnostics.service';
import { SearchTermComparison } from '../../shared/SearchAnalyzer/search-analyzer-term-comparison.model';
import { SearchAttributeResult } from '../../shared/SearchAnalyzer/search-attribute-result.model';
import { SearchAttributeWrapper } from '../../shared/SearchAnalyzer/search-attribute-wrapper.model';


@Component({
  selector: 'search-analyzer',
  templateUrl: './searchanalyzer.component.html'
})

export class SearchAnalyzerComponent implements OnInit {
  constructor(public dialog: MatDialog,
    private _searchDiagnosticsService: SearchDiagnosticsService,
    public _router: Router,
    private _toastr: MatSnackBar) { };

  Loading: boolean = false;
  IndexName = this._searchDiagnosticsService.CurrentVersion.IndexName;
  IndexSelect: number = 0;

  _searchBody = "{\"analyzer\": \"#analyzer#\", \"explain\": true, \"text\": \"#query#\" }";
  SearchIndex: string;
  SearchQuery: SearchAttributeResult[];
  SearchProduct: SearchAttributeWrapper[];

  IndexSelector: string[] = ["-- Please Select --"]
  IndexStore: string[];
  StringAlias: string[] = [];
  SelectedIndex: string;
  ComparisonTerms: SearchTermComparison[];
  BadTerms: string[];

  SearchTermRegex: RegExp = /,/g;

  ngOnInit(): void {
    this.PopulateIndexSelectorOptionsAndValues();

    document.getElementById("anzerSearch").addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        document.getElementById("anzerSearchBtn").click();
      }
    });
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

  //Index Selector
  HandleChangeIndexEvent(): void {
    var change = this.IndexSelect - 1;
    var temp = this.StringAlias[change];
    let tempArr = this._searchDiagnosticsService.Indices.filter(indices => indices.includes(temp));
    tempArr = tempArr.sort();
    this.SelectedIndex = tempArr[tempArr.length - 1];
  }

  MakeAnalyzerSearch(product, query) {
    this.SearchProduct = null;
    this.SearchQuery = null;
    this.ComparisonTerms = null;
    this.BadTerms = null;

    this._searchDiagnosticsService.PostAnalyzer(product, query, this.SelectedIndex).subscribe(data => {
      this.SearchProduct = data.ProductAnalyzerResults;
      this.SearchQuery = data.SearchAnalyzerResults;
      this.ComparisonTerms = data.SearchTermComparison;
      this.BadTerms = data.BadSearchTerms;
    });
  }

  //Tooltips text
  FormatAnalyzerTermsTooltip(): string {
    return "Shows any search terms that are not present in the current test results, it is not representative of the quality of the search terms";
  }

  FormatFieldsHeaderTooltip(): string {
    return "Search Fields that were found to be included with the product used for the test";
  }

  FormatIndexHeaderTooltip(): string {
    return "The results of the text query when processed by the selected index's Index Analyzer filters";
  }

  FormatQueryHeaderTooltip(): string {
    return "The results of the text query when processed by the selected index's Query Analyzer filters";
  }

  FormatDifferencesHeaderTooltip(): string {
    return "The differences between the Index and Query analyzer test results";
  }

  FormatTermsHeaderTooltip(): string {
    return "The terms in the search that are found in the Query analyzer results (the terms have also been analyzed)";
  }

  FormatDataTooltip(): string {
    return "Each Attribute is present for the first available product, if you did not specify a colour or size value, one may be selected by default";
  }
}
