export class BookIssueDetailRow {
  BookIssueDetailID?: number;
  BookIssueID?: number;
  BookID: number;
  BookName?: string;
  Quantity: number;
}

export class BookIssueModel {
  BookIssueID?: number;       
  UserID: number;
  IssueDate: string;          
  DueDate: string;            
  CreatedBy?: number;        
  ModifiedBy?: number;       
  Books: BookIssueDetailRow[];
  DeletedDetailIds?: number[]; 
}
