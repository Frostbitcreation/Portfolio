import { StatsResponseResultContainer } from "./stats-response-result-container.model";
import { StatsResponseShard } from "./stats-response-shard.model";

export class StatsResponse {
  _took: number;
  _timed_Out: boolean;
  _shards: StatsResponseShard;
  hits: StatsResponseResultContainer;
}
