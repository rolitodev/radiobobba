import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatSelectModule, MatSidenavModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class HomeComponent {

}
