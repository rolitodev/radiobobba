import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RadioService } from '../../services/radio.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, MatSidenavModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomeComponent implements OnInit {

  constructor(private _radio: RadioService) { }

  ngOnInit(): void {
    this._radio.changeStatusShowRadio(true);
  }

}
