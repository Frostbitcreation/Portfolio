import { StatsResponseSourceInput } from "../SearchStats/stats-response-source-input.model";
import { StatsResponseSourceOutput } from "../SearchStats/stats-response-source-output.model";
import { StatsResponseSourceRedirect } from "../SearchStats/stats-response-source-redirect.model";
import { StatsResponseSourceProcess } from "./stats-response-source-process";

export class StatsResponseSource {
  LogId: number;
  SearchDateTime: Date;
  SearchProcessing: StatsResponseSourceProcess;
  SearchInput: StatsResponseSourceInput;
  SearchOutput: StatsResponseSourceOutput;
  SearchRedirect: StatsResponseSourceRedirect;
}
