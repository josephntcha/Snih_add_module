import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare const Kkiapay: any;

@Injectable({
  providedIn: 'root'
})
export class KkiapayService {

  private baseUrl = 'http://localhost:8080/api'; // Ajustez selon votre configuration
  private paymentSuccessSubject = new Subject<any>();

  constructor(private http: HttpClient) {
    // Écoutez les événements de paiement
    window.addEventListener('kkiapay-payment-success', (event: any) => {
      this.paymentSuccessSubject.next(event.detail);
    });
  }

  initializePayment(amount: number, callback: string): void {
    const options = {
      amount: amount,
      key: '021734b06f6511ef86df8fbf72b655ad', // Clé publique KkiaPay
      sandbox: true, // A Mettre à false en production
      callback: callback,
      data: {
        webhook_url: `${this.baseUrl}/webhook/payment` // URL de webhook côté Spring
      }
    };

    new Kkiapay(options).openPaymentWidget();
  }

  onPaymentSuccess(): Observable<any> {
    return this.paymentSuccessSubject.asObservable();
  }

  // Méthode pour vérifier le statut du paiement côté serveur
  verifyTransaction(transactionId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/payments/verify/${transactionId}`);
  }
}
