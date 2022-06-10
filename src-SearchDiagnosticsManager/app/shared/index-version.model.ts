export class IndexVersion {
  VersionId: number;
  IndexId: number;
  IndexName: string;
  VersionNumber: number;
  Live: boolean;
  Working: boolean;
  Comment: string;
  CreatedBy: string;
  CreatedDateTime: Date;
  Websites: string[] = [];
  EditEnabled: boolean;
  LiveIndex: string;
  PreviewIndex: string;
}


