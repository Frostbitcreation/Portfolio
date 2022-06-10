import { SearchResponseResult } from "./search-response-result.model";

export class SearchResponseResultContainer {
  Total: number;
  Max_Score: number;
  hits: SearchResponseResult[];
}
