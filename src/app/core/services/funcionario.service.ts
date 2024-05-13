import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable, forkJoin, of } from 'rxjs';
import { BaseService } from './base.service';
import { map } from 'rxjs/operators';
import { FuncionarioFilter } from '../models/funcionario/funcionario-filter.model';
import { FuncionarioResponse } from '../models/funcionario/funcionario-response.model';
import { Funcionario } from '../models/funcionario/funcionario.model';
import { FuncionarioInfoCadastro } from '../models/funcionario/funcionario-info-cadastro.model';
import { FuncionarioCompletarCadastro } from '../models/funcionario/funcionario-completar-cadastro.model';

@Injectable()
export class FuncionarioService extends BaseService {
    constructor() {
        super('/api/funcionario/')
    }

    getFuncionarios(model: FuncionarioFilter): Observable<Array<FuncionarioResponse>> {
        this.setVariables();
        return this._http.get<Array<any>>(`${this._config.baseUrl}${this._api}?${model}`).pipe(map(e => e));
    }

    downloadTemplate(): Observable<Blob> {
        this.setVariables();
        const url = `${this._config.baseUrl}${this._api}downloadTemplate`;
        return this._http.get(url, { responseType: 'blob' });
    }

    importarFuncionarios(file: File): Observable<any> {
        this.setVariables();

        const formData: FormData = new FormData();
        formData.append('file', file, file.name);      
        const url = `${this._config.baseUrl}${this._api}importarFuncionarios`;
        return this._http.post(url, formData, { responseType: 'text' });
    }

	obterInfoCadastro(hash: string): Observable<FuncionarioInfoCadastro> {
        this.setVariables();
        return this._http.get<any>(`${this._config.baseUrl}${this._api}info/${hash}`).pipe(map(e => e));
    }

	completarCadastro(model: FuncionarioCompletarCadastro): Observable<any> {
        this.setVariables();
        return this._http.put<any>(`${this._config.baseUrl}${this._api}completarCadastro`, model).pipe(map(e => e));
    }

    obterPorUsuario(usuarioid: number): Observable<FuncionarioResponse> {
        this.setVariables();
        return this._http.get<any>(`${this._config.baseUrl}${this._api}porusuario/${usuarioid}`).pipe(map(e => e));
    }
}
