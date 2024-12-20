import { Component } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  messages: string[] = [
    'Votre santé, notre mission. Prenez rendez-vous facilement en ligne.',
    'Découvrez un centre médical d\'excellence pour des soins personnalisés.',
    'Bienvenue sur cette plateforme, où votre santé est notre priorité.'
  ];

}
