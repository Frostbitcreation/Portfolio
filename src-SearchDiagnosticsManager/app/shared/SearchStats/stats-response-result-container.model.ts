import { StatsResponseResult } from "./stats-response-result.model";

export class StatsResponseResultContainer {
  Total: number;
  Max_Score: number;
  hits: StatsResponseResult[];
}
