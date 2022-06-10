import { SearchAnalyzerResponseLabel } from "./search-analyzer-response-label.model";

export class SearchAnalyzerResponse {
  custom_analyzer: boolean;
  charfilters?: object;
  tokenizer: SearchAnalyzerResponseLabel;
  tokenfilters: SearchAnalyzerResponseLabel[];
}
