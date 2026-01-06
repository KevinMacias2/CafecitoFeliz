import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale } from '../models/pos.models';

@Injectable({
    providedIn: 'root'
})
export class SaleService {
    private apiUrl = 'http://localhost:3000/api/sales';

    constructor(private http: HttpClient) { }

    createSale(sale: Sale): Observable<Sale> {
        return this.http.post<Sale>(this.apiUrl, sale);
    }

    getSaleById(id: string): Observable<Sale> {
        return this.http.get<Sale>(`${this.apiUrl}/${id}`);
    }
}
