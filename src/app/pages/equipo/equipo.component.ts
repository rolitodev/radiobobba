import { Component, OnInit } from '@angular/core';
import { RadioService } from '../../services/radio.service';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.scss'
})

export class EquipoComponent implements OnInit {

  constructor(private _radio: RadioService) { }

  ngOnInit(): void {
    this._radio.changeStatusShowRadio(true);
  }

}
