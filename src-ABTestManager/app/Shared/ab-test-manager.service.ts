import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Observable, Subscription } from 'rxjs/RX';
import { Variant } from './variant.model';
import { Experiment } from './experiment.model';
import { Website } from './website.model';
import { AbTestType } from './test-type.model';
import { NewTest } from './new-test-response.model';
import { ContentType } from '@angular/http/src/enums';
import { tempType } from './temp-type.model';
import { TestUpdate } from './test-update.model';

@Injectable()
export class ABTestManagerService {
  constructor(private http: HttpClient,
    private _toastr: MatSnackBar) {
  }

  Loading: boolean = false;
  MainLoading: number = 1;
  Experiments: Experiment[] = [];
  Filtered: Experiment[] = [];
  Variants: Variant[] = [];
  AllSites: Website[] = [];
  Sites: string[];
  Types: string[];
  TestTypes: AbTestType;
  SearchBody = "{\"testId\": #value# }";
  UpdateBody = "{\"testId\": #value#,\"status\": \"#status#\"}";
  TypesBody = "{\"referenceType\": #value#}";
  VariantBody = "{\"testId\": #test#, \"external\": #value#,\"percentage\": #percent#}";

  SelectedExperiment: Experiment;
  SelectedSite: string = null;
  SelectedType: string = null;
  SelectedStatus: string = "Enabled";

  SelectionChange(): void {
    //Filter for Site
    if (this.SelectedSite == null) {
      this.Filtered = this.Experiments;
    } else {
      this.Filtered = this.Experiments.filter(exp => exp.SWVALUE == this.SelectedSite);
    };
    //Filter for Type
    if (this.SelectedType !== null) {
      this.Filtered = this.Filtered.filter(exp => exp.Reference == this.SelectedType)
    };
    //Filter for Status
    if (this.SelectedStatus !== null) {
      this.Filtered = this.Filtered.filter(exp => exp.Status == this.SelectedStatus)
    };

  };

  GetExperiments(): void {
    this.http.get<Experiment[]>(apiUrl + getExperiments).subscribe(
      (data) => {
        this.Experiments = data;
        this.Sites = Array.from(
          new Set(data.filter(function (experiment) {
            return experiment.SWVALUE;
          }).map(function (experiment) { return experiment.SWVALUE; })));

        this.Types = Array.from(
          new Set(data.filter(function (experiment) {
            return experiment.Reference;
          }).map(function (experiment) { return experiment.Reference; })));

        this.FilterUniqueExperimentSites();
        this.FilterUniqueExperimentTypes();
        this.SelectionChange();
      }), (err) => { this.ErrorHandler(err) };
  };

  DeleteExperiment(testId: number): void {
    this.SearchBody = this.SearchBody.replace("#value#", testId.toString());
    this.http.post(apiUrl + deleteExperiment + "?testId=" + testId, this.SearchBody).subscribe((data) => console.log(data))
  };

  CreateExperiment(exp: Experiment, type: AbTestType): void {
    var test = new NewTest();
    test.Name = exp.Name;
    test.BranchCode = exp.BranchCode;
    test.Reference = exp.Reference;
    test.CookieName = exp.CookieName;
    test.CookiePersistenceDays = exp.CookiePersistenceDays;
    test.ExternalID = exp.ExternalID;
    test.Status = exp.Status;
    test.Variants = type.Variants;
    test.Description = exp.Description;

    const body = new tempType();
    body.Response = JSON.stringify(test);

    const headers= new HttpHeaders({ 'Content-Type': 'application/json' })

    this.http.post(apiUrl + createExperiment, body, { headers }).subscribe(
      (data) => { console.log(data) }), (err) => { this.ErrorHandler(err) }
  };

  GetVariants(Id: number): void {
    this.SearchBody = this.SearchBody.replace("#value#", Id.toString());
    this.http.post<Variant[]>(apiUrl + getVariants +"?id="+Id, this.SearchBody).subscribe(
      (data) => { this.Variants = data }), (err) => { this.ErrorHandler(err) }
  };

  GetTypes(): void {
    this.http.get<AbTestType>(apiUrl + getTypes).subscribe((data) => { this.TestTypes = data }), (err) => { this.ErrorHandler(err) }
  };

  GetWebsites(): void {
    this.http.get<Website[]>(apiUrl + getWebsites).subscribe((data) => { this.AllSites = data; }), (err) => {this.ErrorHandler(err)}
  };

  UpdateVariant(testId: number, variantId: number, percentage: number): void {
    this.VariantBody = this.VariantBody.replace("#test#", testId.toString());
    this.VariantBody = this.VariantBody.replace("#value#", variantId.toString());
    this.VariantBody = this.VariantBody.replace("#percent#", percentage.toString());
    this.http.post(apiUrl + updateVariants, this.VariantBody)
      .subscribe((data) => { console.log(data) }, (err) => { this.ErrorHandler(err) });
  };

  UpdateTest(testId: number, status: string): void {
    var update = new TestUpdate();
    update.Status = status;
    update.Id = testId;

    const body = new tempType();
    body.Response = JSON.stringify(update);

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' })

    this.http.post(apiUrl + updateTest, body, { headers })
      .subscribe((data) => { console.log(data) }, (err) => { this.ErrorHandler(err) });
  }

  FilterUniqueExperimentSites() {
    var siteCodes = this.Experiments.filter(function (experiment) {
      return experiment.SWVALUE;
    }).map(function (experiment) { return experiment.SWVALUE; });
    var sites = new Set(siteCodes);
    this.Sites = Array.from(sites);
  };

  FilterUniqueExperimentTypes() {
    var expTypes = this.Experiments.map(function (experiment) { return experiment.Reference; });
    var types = new Set(expTypes);
    this.Types = Array.from(types);
  };

  FlushCache(): void {
    this.http.get<boolean>(apiUrl + flushCache)
      .subscribe((data) => { console.log(data) }, (err) => { this.ErrorHandler(err) });
  }

  ErrorHandler(err: HttpErrorResponse): void {
    var errMessage: string;
    if (err.status == 404) {
      errMessage = '404 - ' + err.url.replace("http://", "") + ' Not Found'
    }
    else {
      errMessage = err.status + " Error" + ": " + err.error.ExceptionType + " - " + err.error.ExceptionMessage;
    }
    this.ErrorPopup(errMessage);
  };

  DecrementLoading(): void {
    if (this.MainLoading < 1) this.MainLoading = 0;
    else this.MainLoading--;
  };

  ErrorPopup(message: string): void {
    this._toastr.open(message, "ok", { duration: 5000 });
  };
}

const apiUrl = "api/abTestManager/";
const getExperiments = "getExperiments";
const getVariants = "getVariants";
const getTypes = "getTypes";
const getWebsites = "getAllWebsites";
const updateVariants = "updateVariants";
const updateTest = "updateTest";
const deleteExperiment = "deleteExperiment";
const createExperiment = "createExperiment";
const flushCache = "flushCache";
