import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'; import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RadioService } from '../../../services/radio.service';
import { HotToastService } from '@ngxpert/hot-toast';

import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-modal-create-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatTooltipModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './modal-create-rooms.component.html',
  styleUrl: './modal-create-rooms.component.scss'
})

export class ModalCreateRoomsComponent {

  public formRegisterRoom!: FormGroup;

  public isLoading: boolean = false;

  constructor(
    public _fb: FormBuilder, public _radio: RadioService, public toast: HotToastService,
    public dialogRef: MatDialogRef<ModalCreateRoomsComponent>) { }

  ngOnInit(): void {

    this.formRegisterRoom = this._fb.group({
      idRoom: [null, [Validators.required]],
      active: [false]
    });

  }

  onSubmit(): void {

    if (this.formRegisterRoom.getRawValue().idRoom) {

      this.isLoading = true;

      this._radio.getInfoRoomHabbo(this.formRegisterRoom.getRawValue().idRoom).subscribe({
        next: async (data) => {

          if (data.id) {
            this.toast.success(`La sala ${data.name} de ${data.ownerName} se cargó correctamente. 🚀`);
            this._radio.insertRoom(this.formRegisterRoom.getRawValue().active, Number(this.formRegisterRoom.getRawValue().idRoom)).subscribe({
              next: async () => {
                this.toast.success(`La sala ${data.name} de ${data.ownerName} se ha registrado correctamente. 🚀`);
                this.isLoading = false;
                this.closeDialog();
              }, error: (error) => {
                this.toast.error(error + ' 😢' || "Ha ocurrido un error. 😢");
                this.isLoading = false;
              }
            });
          }

        },
        error: (error) => {
          this.toast.error(error + ' 😢' || "Ha ocurrido un error. 😢");
          this.isLoading = false;
        }
      });

    }

  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
