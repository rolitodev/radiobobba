import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaModule } from "ng-recaptcha";
import { RadioService } from '../../../services/radio.service';
import { FirestoreService } from '../../../services/firestore.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-form-petition',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RecaptchaModule],
  templateUrl: './modal-form-petition.component.html',
  styleUrl: './modal-form-petition.component.scss'
})

export class ModalFormPetitionComponent implements OnInit {

  public formPetitions!: FormGroup;
  public captchaData: any = null;

  public isLoading: boolean = false;
  public formStatus: boolean = false;

  public petitions$!: Observable<any[]>;

  constructor(
    private _fb: FormBuilder, public _radio: RadioService, public _firestore: FirestoreService,
    public toast: HotToastService, private firestoreService: FirestoreService
  ) {

    this.formPetitions = this._fb.group({
      habbo: [null, [Validators.required]],
      message: [null, [Validators.required]],
      ip: [null],
      country: [null],
      date: [null]
    });

  }

  ngOnInit(): void {
    this.firestoreService.getCollection('peticiones_status').subscribe((res) => {
      this.formStatus = res[0].status;
    });
  }

  resolved(captchaResponse: any) {
    this.captchaData = captchaResponse;
    if (this.captchaData) {
      this.onSubmit();
    }
  }

  onSubmit(): void {

    if (this.formPetitions.valid && this.captchaData) {

      this.isLoading = true;

      this._radio.getIp().subscribe({
        next: async (response: any) => {
          this.formPetitions.controls['ip'].setValue(response.ip);
          this.formPetitions.controls['country'].setValue(response.country);
        }, error: (error: any) => {
          this.formPetitions.controls['ip'].setValue('N/A');
          this.formPetitions.controls['country'].setValue('N/A');
          this.insertInFirestore();
          throw error;
        }, complete: () => {
          this.insertInFirestore();
        }
      });

    }

  }

  insertInFirestore(): void {

    this.formPetitions.controls['date'].setValue(new Date().toISOString());

    this._firestore.addDocument('peticiones', this.formPetitions.getRawValue()).then(() => {
      this.formPetitions.reset();
      this.isLoading = false;
      this.toast.success("Nuestros DJ's revisarán tu petición en breve. 😎");
    }).catch(() => {
      this.isLoading = false;
      this.toast.error('¡Ups! Algo salió mal. Intenta de nuevo. 😨');
    });
  }

}
