import { SearchResponseResultContainer } from "./search-response-result-container.model";
import { SearchResponseShard } from "./search-response-shard.model";

export class SearchResponse {
  _took: number;
  _timed_Out: boolean;
  _shards: SearchResponseShard;
  hits: SearchResponseResultContainer;
}
