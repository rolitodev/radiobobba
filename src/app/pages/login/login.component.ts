import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  public showPassword: boolean = true;

  changeStatus(status: boolean): void {
    this.showPassword = status;
  }

}
