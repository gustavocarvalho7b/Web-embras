import { Component, OnInit } from '@angular/core';
import { UserService, User } from './user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.sass'],
  providers: [MessageService]
})
export class AppComponent implements OnInit {
  title = 'pse-angular';
  visible: boolean = false;
  newUser: any = { nome: '', email: '' };
  users: User[] = [];

  constructor(private userService: UserService, private messageService: MessageService) { }


  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  showDialog() {
    this.visible = true;
  }

  cancel() {
    this.visible = false;
    this.newUser = { nome: '', email: '' };
  }

  save() {
    if (this.newUser.nome && this.newUser.email) {
      this.userService.addUser(this.newUser).subscribe(
        (response) => {
          console.log('New user added:', response);
          this.visible = false;
          this.newUser = { nome: '', email: '' };
          this.loadUsers();
        },
        (error) => {
          console.error('Error adding new user:', error);
        }
      );
    } else {
      console.error('All fields are required');
    }
  }

  deleteUser(id: number | undefined): void {
    if (id !== undefined) {
      this.userService.deleteUser(id).subscribe(
        () => {
          console.log('User deleted successfully.');
          this.messageService.add({ severity: 'success', summary: 'Successo', detail: 'User deleted successfully.' });
          this.loadUsers();
        },
        (error) => {
          console.error('Error deleting user:', error);
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao apagar o usuário!.' });
        }
      );
    } else {
      console.error('Invalid user id.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid user id.' });
    }
  }
}