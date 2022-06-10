import { TestVariant } from "./test-type.model";

export class NewTest {
  Name: string;
  BranchCode: number;
  Description: string;
  Reference: string; //Experiment Type
  CookieName: string;
  CookiePersistenceDays: number; //Experiment Duration
  ExternalID: string; //ID from Google Optimize
  Status: string; // Enabled/Disabled
  Variants: TestVariant[]
}
