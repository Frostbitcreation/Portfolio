export class SearchDiagnosticsExample {
  constructor(analyzerType: string, before: string, after: string) {
    this.AnalyzerType = analyzerType;
    this.Before = before;
    this.After = after;
  }
  
  AnalyzerType: string;
  Before: string;
  After: string;
}

export class SearchDiagnosticsFilterExample {
  constructor(filterType: string, current: boolean, index: SearchDiagnosticsExample, query: SearchDiagnosticsExample, usedByIndex?: boolean) {
    this.Current = current;
    this.FilterType = filterType;
    this.IndexExample = index;
    this.QueryExample = query;
    if (typeof usedByIndex === "undefined") {
      this.UsedByIndex = true;
      this.UsedByQuery = true;
    }
    else {
      this.UsedByIndex = usedByIndex;
      this.UsedByQuery = !usedByIndex;
    }
  }

  FormatFilterType(): string {
    if (this.notFormatted.includes(this.FilterType)) {
      return this.FilterType;
    }
    else if (this.FilterType == "Result") {
      return "Result - Search term matches product";
    }
    else {
      return this.FilterType + " Filter";
    }
  }

  Current: boolean;
  FilterType: string;
  IndexExample: SearchDiagnosticsExample;
  QueryExample: SearchDiagnosticsExample;
  UsedByIndex: boolean;
  UsedByQuery: boolean;
  readonly notFormatted: string[] = ["Standard Tokenizer", "Input Text", "Standard Filter", "ASCII Folding"]
}
