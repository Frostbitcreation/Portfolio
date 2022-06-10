import { SearchAttributeResult } from "./search-attribute-result.model";

export class SearchAttributeWrapper {
  AttributeId: number;
  AttributeName: string;
  QueryAttributeValue: SearchAttributeResult[];
  IndexAttributeValue: SearchAttributeResult[];
  Comparison: string[];
}
