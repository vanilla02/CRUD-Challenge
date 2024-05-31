import { Component, OnInit, ViewChild } from '@angular/core';
import { CrudService } from './../../service/crud.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  
  Books: any = [];
  paginatedBooks: any = [];
  filteredBooks: any = [];
  searchTerm: string = '';
  selectedType: string = 'all'; // Default selected type

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.crudService.GetBooks().subscribe(res => {
      this.Books = res;
      this.filteredBooks = this.Books;
      this.paginatedBooks = this.filteredBooks.slice(0, 5);
    });    
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      const startIndex = event.pageIndex * event.pageSize;
      const endIndex = startIndex + event.pageSize;
      this.paginatedBooks = this.filteredBooks.slice(startIndex, endIndex);
    });
  }

  delete(id: any, i: any) {
    if(window.confirm('Do you want to go ahead?')) {
      this.crudService.deleteBook(id).subscribe(() => {
        this.Books.splice(i, 1);
        this.filteredBooks = this.Books; // Update filtered books after deletion
        this.paginatedBooks = this.filteredBooks.slice(this.paginator.pageIndex * this.paginator.pageSize, (this.paginator.pageIndex * this.paginator.pageSize) + this.paginator.pageSize);
      });
    }
  }

  applyFilter() {
    // Apply type filter if selected
    if (this.selectedType !== 'all') {
      this.filteredBooks = this.Books.filter((book: any) => {
        if (this.selectedType === 'local') {
          // Filter for local authors
          return book.author_nationality.toLowerCase() === 'local';
        } else {
          // Filter for foreign authors
          return book.author_nationality.toLowerCase() === 'foreign';
        }
      });
    } else {
      this.filteredBooks = this.Books;
    }
    
    
    // Apply search filter if search term is not empty
    if (this.searchTerm.trim() !== '') {
      this.filteredBooks = this.filteredBooks.filter((book: any) => {
        return book.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
    
    // Reset paginator to the first page when applying a filter
    this.paginator.firstPage();
    this.paginatedBooks = this.filteredBooks.slice(0, this.paginator.pageSize);
  }

  resetFilters() {
    this.selectedType = 'all';
    this.searchTerm = '';
    this.applyFilter(); // Apply filter after resetting
  }
}
