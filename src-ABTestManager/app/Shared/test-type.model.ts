export class AbTestType {
  Variants: TestVariant[]
}

export class TestVariant {
  TypeID: number;
  Name: string;
  CookieValue: string;
  TestType: string;
  Percentage: number;
  CookieName: string;
  ExternalID: number;
}
