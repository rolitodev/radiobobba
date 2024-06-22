import { Component, OnInit } from '@angular/core';
import { RadioService } from '../../services/radio.service';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-equipo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.scss'
})

export class EquipoComponent implements OnInit {

  public team: any = [];

  public isLoading: boolean = false;

  constructor(private _radio: RadioService) { }

  ngOnInit(): void {

    this._radio.changeStatusShowRadio(true);

    this.isLoading = true;

    this._radio.getTeamActive().pipe(
      switchMap((items: any[]) => this.fetchImagesForItems(items))
    ).subscribe({
      next: (data: any[]) => {
        this.team = data;
        this.isLoading = false;
      },
      error: (error: any) => {
        throw error;
      }
    });

  }

  fetchImagesForItems(items: any[]): Observable<any[]> {
    const observables = items.map(item => {
      return this._radio.getHabboInfo(item.name).pipe(
        switchMap((habboData: any) => {
          item.habboImage = `https://www.habbo.com/habbo-imaging/avatarimage?figure=${habboData.figureString}&gender=M&direction=2&head_direction=2&action=,wav,crr=3&gesture=sml&size=l`;
          return [item]; // Retorna el item actualizado como un array observable
        })
      );
    });
    return forkJoin(observables);
  }

  setRoles(id: number): string {
    switch (id) {
      case 1: {
        return 'DJ';
      }
      case 8: {
        return 'Dueño';
      }
      case 9: {
        return 'Programador';
      }
      default: {
        return 'Usuario';
      }
    }
  }

}
