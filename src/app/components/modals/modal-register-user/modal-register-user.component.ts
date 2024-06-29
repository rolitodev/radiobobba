import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RadioService } from '../../../services/radio.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-modal-register-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatTooltipModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './modal-register-user.component.html',
  styleUrl: './modal-register-user.component.scss'
})

export class ModalRegisterUserComponent implements OnInit {

  public isLoading: boolean = false;

  public formRegisterUser!: FormGroup;

  public ranks: any = [
    { value: 0, name: 'Usuario' },
    { value: 1, name: 'DJ' }
  ];

  constructor(
    public _radio: RadioService, public _fb: FormBuilder, public _toast: HotToastService,
    public dialogRef: MatDialogRef<ModalRegisterUserComponent>
  ) { }

  ngOnInit(): void {

    this.formRegisterUser = this._fb.group({
      name: [null, Validators.required],
      password: [null, Validators.required],
      rank: [null, Validators.required],
      active: [true],
      description: [null]
    });

  }

  onSubmit(): void {

    this.isLoading = true;

    this._radio.insertUser(this.formRegisterUser.value).subscribe({
      next: async (response: any) => {
        this._toast.success('Usuario registrado correctamente 🎉');
        this.isLoading = false;
        this.formRegisterUser.reset();
        this.isLoading = false;
        this.closeDialog();
      }, error: (err: any) => {
        this._toast.error('Ha ocurrido un error 😢. Intentalo nuevamente.');
        this.isLoading = false;
        throw err;
      },
    });

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}