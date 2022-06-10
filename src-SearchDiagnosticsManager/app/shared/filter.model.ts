export class SearchFilter {
  
  constructor(type: string, baseTerm: string, createdBy?: string, linkedTerms?: SearchFilter[], id?: number) {
    this.Id = id ? id : 0;
    this.FilterType = type;
    this.BaseTerm = baseTerm;
    this.LinkedTerms = linkedTerms ? linkedTerms : [];
    this.CreatedBy = createdBy ? createdBy : "";
    this.Enabled = true;
  }

  Id: number;
  FilterType: string;
  Enabled: boolean;
  BaseTerm: string;
  LinkedTerms: SearchFilter[];
  CreatedBy: string;
  CreatedDate: Date;
  VersionId: number;
}
