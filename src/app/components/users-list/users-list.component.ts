import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ModalService } from '../../services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { calculateAge } from '../../utils/calculateAge';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  paginationControls = {
    currentPage: 1,
    nextPage: 0,
    prevPage: 0,
    lastPage: 0,
    firstPage: 0,
    goToPage: this.goToPage.bind(this),
  };
  users: User[] = [];
  userToDelete: User = {};

  constructor(
    private userService: UserService,
    private modalService: ModalService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {}

  private getUsers(page: number): void {
    this.userService.getByPage(page, 5).subscribe({
      next: (res) => {
        this.users = [...res.data];
        this.paginationControls.currentPage = Math.min(page, res.last);
        this.paginationControls.firstPage = res.first;
        this.paginationControls.lastPage = res.last;
        this.paginationControls.nextPage = res.next || 0;
        this.paginationControls.prevPage = res.prev || 0;
        this.users.forEach(
          (user) => (user.age = calculateAge(new Date(user.birthDate!)))
        );
      },
      error: (err) => {
        this.toastr.error('Error occurred while fetching users');
      },
    });
  }

  ngOnInit(): void {
    let openedPage = this.activatedRoute.snapshot.queryParams['page'] || 1;
    this.goToPage(openedPage);
  }

  goToPage(page: number): void {
    this.getUsers(page);
  }

  getAge(age: number): string {
    return age < 1 ? '< 1' : age.toString();
  }

  editUser(user: User): void {}

  onDeleteConfirm() {
    if (this.userToDelete.id) {
      this.userService.delete(this.userToDelete.id).subscribe({
        next: (res) => {
          this.getUsers(this.paginationControls.currentPage);
          this.userToDelete = {};
          this.modalService.close();
          this.toastr.success('User deleted successfully');
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Error occurred while deleting user');
        },
      });
    }
  }

  onDeleteCancel() {
    this.userToDelete = {};
    this.modalService.close();
  }

  deleteUser(user: User): void {
    this.userToDelete = user;
    this.modalService.open('delete-user-modal');
  }
}
