import { Component, OnInit } from '@angular/core';
import { RadioService } from '../../services/radio.service';

@Component({
  selector: 'app-alianzas',
  standalone: true,
  imports: [],
  templateUrl: './alianzas.component.html',
  styleUrl: './alianzas.component.scss'
})

export class AlianzasComponent implements OnInit {

  constructor(private _radio: RadioService) { }

  ngOnInit(): void {
    this._radio.changeStatusShowRadio(true);
  }

}
