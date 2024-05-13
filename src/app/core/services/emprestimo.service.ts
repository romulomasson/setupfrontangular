import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable, forkJoin, of } from 'rxjs';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { Emprestimo } from '../models/emprestimo/emprestimo.model';

@Injectable()
export class EmprestimoService extends BaseService {
    constructor() {
        super('/api/emprestimo/')
    } 

    contratar(emprestimo: Emprestimo): Observable<any> {
        this.setVariables();        
        const url = `${this._config.baseUrl}${this._api}contratar`;
        return this._http.post(url, emprestimo);
    }

    obterPorFuncionario(funcionarioId: number): Observable<any> {
        this.setVariables();
        return this._http.get<any>(`${this._config.baseUrl}${this._api}porfuncionario/${funcionarioId}`).pipe(map(e => e));
    }
}
