
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Options } from 'ngx-slider-v2';
import { FuncionarioCreditoService } from 'src/app/core/services/funcionariocredito.service';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthenticationState } from 'src/app/store/Authentication/authentication.reducer';
import { Observable } from 'rxjs';
import { getUserClaims } from 'src/app/store/Authentication/authentication-selector';

@Component({
  selector: 'simular-emprestimo',
  templateUrl: './simular.component.html',
  styleUrls: ['./simular.component.scss']
})

export class SimularComponent implements OnInit {

  userClaims$: Observable<any>;
  nomeFuncionario: string;

  constructor(public formBuilder: UntypedFormBuilder
    , private serviceFuncionarioCredito: FuncionarioCreditoService
    , private router: Router
    , private store: Store<{ auth: AuthenticationState }>
  ) {
    this.userClaims$ = this.store.select(getUserClaims);
    this.userClaims$.subscribe(claims => {
      this.nomeFuncionario = claims.name;
    });
  }

  breadCrumbItems: Array<{}>;
  defaultVal: number = 0;
  value1: number = 4000;
  option1: Options = {
    floor: 0,
    ceil: 20000,
    translate: (value: number): string => {
      return 'R$' + value;
    },
    step: 500
  };
  submit: boolean;
  exibeParcelas: boolean;
  lists?: any;
  get form() {
    return this.emprestimoForm.controls;
  }

  valorEmprestimo: number = 1000;

  emprestimoForm: UntypedFormGroup;

  ngOnInit() {

    this.exibeParcelas = false;

    localStorage.removeItem('emprestimoCredito');

    this.emprestimoForm = this.formBuilder.group({
      valorEmprestimo: [1000]
    });

    this.breadCrumbItems = [{ label: 'Empréstimo' }, { label: 'Simular', active: true }];

    this.submit = false;

    // Adiciona um observador de mudanças com debounceTime
    this.emprestimoForm.controls['valorEmprestimo'].valueChanges
      .pipe(debounceTime(800))
      .subscribe(() => {
        this.onValorEmprestimoChange();
      });

    this.serviceFuncionarioCredito.get().subscribe(
      data => {
        this.lists = data;
        this.valorEmprestimo = this.lists[0].valorCreditoMaximo;
        this.emprestimoForm.controls['valorEmprestimo'].setValue(this.valorEmprestimo);
        const newOptions: Options = {
          floor: this.lists[0].valorCreditoMinimo,
          ceil: this.lists[0].valorCreditoMaximo,
          translate: (value: number): string => {
            return 'R$' + value;
          },
          step: 500
        };
        this.option1 = newOptions;
      },
      error => {
        console.error('Erro ao listar funcionários', error);
      }
    );


  }

  onSliderValueChange(event: any) {
    this.emprestimoForm.controls['valorEmprestimo'].setValue(event, { emitEvent: false });
    this.valorEmprestimo = event;
  }

  formatarComoReal(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  calcularValorMensal(valorEmprestimo: number, taxaAoMes: number, prazoEmMeses: number): string {
    const taxaMensal = taxaAoMes / 100;
    const valorMensal = valorEmprestimo *
      (taxaMensal * Math.pow(1 + taxaMensal, prazoEmMeses)) /
      (Math.pow(1 + taxaMensal, prazoEmMeses) - 1);

    return this.formatarComoReal(valorMensal);
  }

  onValorEmprestimoChange() {
    const novoValor = this.emprestimoForm.controls['valorEmprestimo'].value;
    this.valorEmprestimo = novoValor;
  }

  openContratar(item: any) {
    this.router.navigate(['/emprestimo/contratar']);
    item.valorEmprestimo = this.valorEmprestimo;
    localStorage.setItem('emprestimoCredito', JSON.stringify(item));
  }

  simular() {
    this.exibeParcelas = true;
  }

}
