export class SearchFilters {
     
        SearchBookName:string= '';
        SelectedPublicationIds: number[]=[];
        SelectedDepartmentId: number | null = null;

        PageNumber: number=1;
        PageSize: number=10;
        SortColumn:string= 'BookId';
        SortDirection:string= 'ASC'
      
}

