import { Component, OnInit } from '@angular/core';
import { RadioService } from '../../services/radio.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './salas.component.html',
  styleUrl: './salas.component.scss'
})

export class SalasComponent implements OnInit {

  public rooms: any = [];

  public isLoading: boolean = false;

  constructor(private _radio: RadioService) { }

  ngOnInit(): void {

    this._radio.changeStatusShowRadio(true);
    this.isLoading = true;
    this._radio.getRooms().subscribe({
      next: async (data: any) => {
        this.rooms = data;
        this.isLoading = false;
      }, error: (error: any) => {
        this.isLoading = false;
        throw error;
      }
    });

  }

}
