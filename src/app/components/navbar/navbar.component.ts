import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Title } from "@angular/platform-browser";
import { MatDialog } from '@angular/material/dialog';
import { ModalLoginComponent } from '../modals/modal-login/modal-login.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {

  public menu: any = [
    { name: 'Equipo', link: '/equipo' },
    { name: 'Salas', link: '/salas' },
    { name: 'Panel DJ', link: '' }
  ];

  public isMobileMenuOpen: boolean = false;
  public isUserMenuOpen: boolean = false;

  public profileInfo: any = {
    image: 'https://www.habbo.com/habbo-imaging/avatarimage?figure=hr-3163-61-.hd-190-10-.ch-3030-110-.lg-5594-110-.sh-3524-110-1408-.ha-5004-61-61.he-3660-64-76-.fa-3993-110-.cc-886-110-&gender=M&direction=2&head_direction=2&action=&gesture=sml&headonly=1'
  }

  constructor(private _title: Title, public router: Router, public _auth: AuthService,
    public dialog: MatDialog
  ) { }

  ngOninit(): void {
    this.toggleUserMenu();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  callAction(item: string) {
    this._title.setTitle('Radio Bobba: Iniciar Sesión Panel DJ');

    if (item.toString().toLocaleLowerCase() === 'panel dj') {
      if (localStorage.getItem('user')) {
        this.router.navigate(['/dj']);
        return;
      }
      this.dialog.open(ModalLoginComponent).afterClosed().subscribe(() => {
        this._title.setTitle('Radio Bobba: Música en Vivo y Diversión en Habbo Hotel');
      });
    }

  }

  closeSession(): void {
    localStorage.removeItem('user');
    this._auth.changeStatusAuth(false);
    this.router.navigate(['/inicio']);
  }

}