import { SearchTermComparison } from "./search-analyzer-term-comparison.model";
import { SearchAttributeResult } from "./search-attribute-result.model";
import { SearchAttributeWrapper } from "./search-attribute-wrapper.model";

export class SearchAttributeSearch {
  SearchAnalyzerResults: SearchAttributeResult[];
  ProductAnalyzerResults: SearchAttributeWrapper[];
  SearchTermComparison: SearchTermComparison[];
  BadSearchTerms: string[];
}
