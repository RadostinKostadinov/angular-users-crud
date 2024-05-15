import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

type paginationControls = {
  currentPage: number;
  nextPage: number;
  prevPage: number;
  lastPage: number;
  firstPage: number;
  goToPage: (pageNumber: number) => void;
};

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() paginationControls: paginationControls = {
    currentPage: 1,
    nextPage: 2,
    prevPage: 0,
    lastPage: 5,
    firstPage: 1,
    goToPage: (pageNumber: number) => {},
  };

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  jumpToPage(pageNumber: number) {
    this.paginationControls.goToPage(pageNumber);
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: pageNumber },
      queryParamsHandling: 'merge', // remove to replace all query params by provided
    });
  }
}
