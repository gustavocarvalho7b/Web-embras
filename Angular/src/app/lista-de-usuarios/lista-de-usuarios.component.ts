import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-lista-de-usuarios',
  templateUrl: './lista-de-usuarios.component.html',
  styleUrls: ['./lista-de-usuarios.component.sass']
})
export class ListaDeUsuariosComponent implements OnInit {

  users: User[] = [];
  loading = true;
  visible: boolean = false;
  newUser: User = { nome: '', email: '' };

  constructor(private userService: UserService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
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
          console.log('Novo usuário adicionado:', response);
          this.visible = false;
          this.newUser = { nome: '', email: '' };
          this.loadUsers();
        },
        (error) => {
          console.error('Erro ao adicionar novo usuário:', error);
        }
      );
    } else {
      console.error('Todos os campos são obrigatórios');
    }
  }
  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        this.loadUsers();
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'O usuário foi excluído!.' });
      },
      (error) => {
        console.error('Error ao deletar Usuário:', error);
      }
    );
  }
}