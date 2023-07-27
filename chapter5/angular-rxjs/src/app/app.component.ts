import { Component } from '@angular/core';
import {BookService} from "./book.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-rxjs';

  // Inject the book service
  constructor(private dataService: BookService) { }

  ngOnInit() {
    // Use the book service
    this.dataService.getData().subscribe(data => {
      console.log(data);
    });
  }
}
