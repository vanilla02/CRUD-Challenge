import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CrudService } from './../../service/crud.service';
import { FormGroup, FormBuilder } from "@angular/forms";
import { formatDate } from '@angular/common';

 
@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
 
export class AddBookComponent implements OnInit {
 
  bookForm: FormGroup;
   
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private crudService: CrudService
  ) { 
    this.bookForm = this.formBuilder.group({
      title: [''],
      price: [''],
      description: [''],
      book_type: ['']
    })
  }
 
  ngOnInit() { }
 
  onSubmit(): any {
    this.crudService.AddBook(this.bookForm.value)
    .subscribe(() => {
        console.log('Data added successfully!')
        this.ngZone.run(() => this.router.navigateByUrl('/books-list'))
      }, (err) => {
        console.log(err);
    });

    if (this.bookForm.valid) {
      // Extract start and end dates from the form
      const startDate = this.bookForm.get('startDate')?.value;
      const endDate = this.bookForm.get('endDate')?.value;
  
      if (startDate && endDate) { // Check if both start and end dates are not null
        // Format the dates as required (e.g., MM/DD/YYYY)
        const formattedStartDate = formatDate(startDate, 'yyyy-MM-dd', 'en-US');
        const formattedEndDate = formatDate(endDate, 'yyyy-MM-dd', 'en-US');
  
        // Set the formatted dates back to the form controls
        this.bookForm.patchValue({
          startDate: formattedStartDate,
          endDate: formattedEndDate
        });
  
        // Add the book with the updated form data
        this.crudService.AddBook(this.bookForm.value)
          .subscribe(() => {
            console.log('Data added successfully!')
            this.ngZone.run(() => this.router.navigateByUrl('/books-list'))
          }, (err) => {
            console.log(err);
        });
      }
    }
  }

  // Function to format date as MM/DD/YYYY
  formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${month}/${day}/${year}`;
  }
  }