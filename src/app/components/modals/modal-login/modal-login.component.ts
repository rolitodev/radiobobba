import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './modal-login.component.html',
  styleUrl: './modal-login.component.scss'
})

export class ModalLoginComponent implements OnInit {

  public formLogin!: FormGroup;

  public isLoading: boolean = false;

  constructor(public _fb: FormBuilder, private _auth: AuthService, public toast: HotToastService, public _route: Router) { }

  ngOnInit(): void {
    this.formLogin = this._fb.group({
      name: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  onSubmit(): void {

    const name = this.formLogin.value.name ? this.formLogin.value.name.toString().trim() : null;
    const password = this.formLogin.value.password ? this.formLogin.value.password.toString().trim() : null;

    if (name && password) {

      this.isLoading = true;

      this._auth.getLogin({ name, password }).subscribe({
        next: async (response: any) => {
          this._auth.changeStatusAuth(true);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isLoading = false;
          this.toast.success("Has iniciado sesión correctamente. 🚀");
          this._route.navigate(['/dj']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toast.error(error.error.message + ' 😢' || "Ha ocurrido un error. 😢");
          throw error;
        }
      });

    }

  }

  // register(): void {
  //   this._auth.register({ name: 'Hecky', password: 'Millos24', email: 'hectorgarzon2420@gmail.com' }).subscribe(
  //     (data: any) => {
  //       console.log('data', data);
  //     },
  //     (error: any) => {
  //       console.log('error', error);
  //     }
  //   );
  // }

}
