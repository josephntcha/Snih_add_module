import { Component, Input, OnInit } from '@angular/core';
import { Constant } from '../../../models/model';

@Component({
  selector: 'app-medical-constants',
  templateUrl: './medical-constants.component.html',
  styleUrl: './medical-constants.component.css'
})
export class MedicalConstantsComponent implements OnInit {
  @Input() constants: Constant[] = [];
  groupedConstants: { date: string; constants: Constant[] }[] = [];

  ngOnInit() {
    this.groupConstants();
  }

  private groupConstants() {
    // Créer un Map pour grouper les constantes
    const groups = new Map<string, Constant[]>();
    
    this.constants.forEach(constant => {
      // Normaliser la date en arrondissant à la minute
      const date = new Date(constant.date);
      date.setSeconds(0);
      date.setMilliseconds(0);
      const dateKey = date.toISOString();
      
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)?.push(constant);
    });

    // Convertir le Map en tableau pour l'affichage
    this.groupedConstants = Array.from(groups.entries()).map(([date, constants]) => ({
      date,
      constants
    }));
  }

}
