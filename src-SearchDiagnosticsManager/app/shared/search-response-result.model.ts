import { SearchResponseResultProduct } from "./search-response-result-product.model";

export class SearchResponseResult {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: SearchResponseResultProduct;
}
