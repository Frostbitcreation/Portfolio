import { StatsResponseSource } from "./stats-response-source.model";

export class StatsResponseResult {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: StatsResponseSource;
}
