import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, Subscription } from 'rxjs/RX';
import { IndexVersion } from './index-version.model';
import { SearchIndicesContainer } from './search-indices-container.model';
import { SearchResponseWrapper } from './search-response-wrapper.model';
import { SearchResponse } from './search-response.model';
import { SearchAttributeSearch } from './SearchAnalyzer/search-attribute-search.model';
import { StatsResponseWrapper } from './SearchStats/stats-response-wrapper.model';
import { StatsResponse } from './SearchStats/stats-response.model';
import { Website } from './website.model';

@Injectable()
export class SearchDiagnosticsService {
  constructor(private http: HttpClient,
    private _toastr: MatSnackBar) {
  }

  Versions: IndexVersion[] = [];
  CurrentVersion: IndexVersion;
  Loading: boolean = false;
  MainLoading: number = 1;
  escListener: boolean = false;
  Websites: string[];

  SearchBody = "{\"query\": {\"match\":{\"ProductId\":\"#value#\"}},\"size\": 10000}";
  StatsBody = "{\"query\": {\"match\":{\"SearchInput.UserSearch.keyword\": \"" + "#value#" + "\"}},\"size\": 1000}";
  AnalyzerBody = "{\"analyzer\": \"#analyzer#\", \"explain\": true, \"text\": \"#value#\"}";
  SearchIndex: string;
  PreviewIndex: boolean = false;
  ElasticIndices: object;
  Indices: string[];
  Sites: Website[];
  StatsResult: string = "";
  StatsObject: StatsResponse;

  SearchResult: string = "";
  SearchObject: SearchResponse;

  //Search against elastic search to get Indices for searches
  GetElasticIndices(): Subscription {
    return this.http.get<SearchIndicesContainer>(apiUrl + elasticSearchIndices).subscribe(data => {
      this.ElasticIndices = data;
      this.Indices = Object.keys(this.ElasticIndices);
      this.Indices = this.Indices.filter(indices => indices.includes("search"));
    });
  }

  //Product Stats search
  PostStats(Query: string): Observable<StatsResponseWrapper> {
    this.StatsBody.replace("#value#", Query);
     return this.http.post<StatsResponseWrapper>(apiUrl + elasticSearchStats + "?query=" + Query, this.StatsBody)
  };

  //Product ID search
  FetchesData(prodId: string, Index: string): Observable<SearchResponseWrapper> {
    this.SearchBody = this.SearchBody.replace("#value#", prodId);
    return this.http.post<SearchResponseWrapper>(apiUrl + elasticSearchResult + "?index=" + Index + "&query=" + prodId, this.SearchBody)
  };

  //Analyzer Search
  PostAnalyzer(product: string, query: string, index: string) {
    this.AnalyzerBody = this.AnalyzerBody.replace("#value#", query);
    this.AnalyzerBody = this.AnalyzerBody.replace("#analyzer#", index + "_index_analyzer");
    return this.http.post<SearchAttributeSearch>(apiUrl + elasticAnalyzerSearch + "?index=" + index + "&product=" + product +"&query=" + query, this.AnalyzerBody);
  }

  //Get index versions from API
  GetVersions(indexId?: number): void {
    if (!this.Versions.length || indexId) {
      this.http.get<IndexVersion[]>(apiUrl + getIndexVersions).subscribe((data) => {
        this.Versions = data;
        this.ChangeSelectedIndexVersion(indexId ? indexId : this.Versions[0].IndexId);
      },
        (err) => { this.ErrorPopup(err) },
        () => { this.DecrementLoading(); });
    };
  }

  ChangeSelectedIndexVersion(indexId: number) {
    var indexVersions = this.Versions.filter(vers => vers.IndexId == indexId);
    var versionIndex = indexVersions.findIndex(vers => vers.Working);
    if (versionIndex == -1) versionIndex = indexVersions.findIndex(vers => vers.Live);
    if (versionIndex == -1) versionIndex = 0;
    this.CurrentVersion = indexVersions[versionIndex];
  }

  GetWebsites(): void {
    this.http.get<Website[]>(apiUrl + getWebsites).subscribe((data) => {
      this.Sites = data;
    })
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

const apiUrl = "api/searchDiagnosticsManager/";
const elasticSearchIndices = "getElasticSearchIndices/";
const elasticSearchStats = "getElasticSearchStats/";
const elasticSearchResult = "getElasticSearchResult/";
const elasticAnalyzerSearch = "getElasticSearchAnalyzer/";
const getIndexVersions = "getIndexVersions/";
const getWebsites = "getWebsites/";
