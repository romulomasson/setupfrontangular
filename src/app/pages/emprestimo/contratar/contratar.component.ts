
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Options } from 'ngx-slider-v2';
import { Emprestimo } from 'src/app/core/models/emprestimo/emprestimo.model';
import { EmprestimoService } from 'src/app/core/services/emprestimo.service';
import { debounceTime } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthenticationState } from 'src/app/store/Authentication/authentication.reducer';
import { getUserClaims } from 'src/app/store/Authentication/authentication-selector';
import { FuncionarioService } from 'src/app/core/services/funcionario.service';
import { Funcionario } from 'src/app/core/models/funcionario/funcionario.model';

@Component({
  selector: 'contratar-emprestimo',
  templateUrl: './contratar.component.html',
  styleUrls: ['./contratar.component.scss']
})

export class ContratarComponent implements OnInit {

  constructor(public formBuilder: UntypedFormBuilder
    , private serviceEmprestimo: EmprestimoService
    , private serviceFuncionario: FuncionarioService
    , private router: Router
    , private datePipe: DatePipe
    , private store: Store<{ auth: AuthenticationState }>
  ) {
    this.userClaims$ = this.store.select(getUserClaims);
    this.userClaims$.subscribe(claims => {
      this.userid = claims.id;
    });
  }

  userClaims$: Observable<any>;
  
  isOtherSelected: boolean = true;
  isPinbank: boolean = true;
  breadCrumbItems: Array<{}>;

  submit: boolean;
  submitEmail: boolean;
  lists?: any;

  activeInformacaoBancaria: boolean;
  activeConfirmacao: boolean;

  get form() {
    return this.emprestimoForm.controls;
  }

  emprestimoCreditoSelecionado: any;

  emprestimoForm: UntypedFormGroup;

  emprestimo: Emprestimo;

  today: Date;

  userid: number;

  funcionario: any;
  ngOnInit() {
    this.activeInformacaoBancaria = true;
    this.activeConfirmacao = false;

    this.today = new Date();

    this.emprestimoForm = this.formBuilder.group({
      agencia: ['', [Validators.required]],
      agenciaDigito: ['', [Validators.required]],
      contaCorrente: ['', [Validators.required]],
      contaCorrenteDigito: ['', [Validators.required]],
      tipoChavePix: ['', [Validators.required]],
      chavePix: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      confirmaremail: ['', [Validators.required, Validators.email]]
    }, { validators: this.compararEmails });
 
    this.breadCrumbItems = [{ label: 'Empréstimo' }, { label: 'Contratar', active: true }];

    this.submit = false;

    const emprestimoCredito = localStorage.getItem('emprestimoCredito');
    if (emprestimoCredito) {
      this.emprestimoCreditoSelecionado = JSON.parse(emprestimoCredito);

      this.emprestimo = new Emprestimo();
      this.emprestimo.emprestimoDadoBancarioTipoId = 1
      this.emprestimo.codigoBanco = 341; //TODO
      this.emprestimo.funcionarioCreditoId = this.emprestimoCreditoSelecionado.id;
      this.emprestimo.valor = this.emprestimoCreditoSelecionado.valorEmprestimo;
      this.emprestimo.parcelas = this.emprestimoCreditoSelecionado.prazoEmMeses;
      this.emprestimo.taxaAoMes = this.emprestimoCreditoSelecionado.taxaAoMes;
      this.emprestimo.valorParcela = this.calcularValorMensal(this.emprestimo.valor, this.emprestimo.taxaAoMes, this.emprestimo.parcelas)

    }
    
    this.serviceFuncionario.obterPorUsuario(this.userid).subscribe((data) => {
        this.funcionario = data;
      }
    );

  }

  compararEmails(formGroup: UntypedFormGroup) {
    const email = formGroup.get('email').value;
    const confirmaremail = formGroup.get('confirmaremail').value;

    return email === confirmaremail ? null : { emailNaoCoincide: true };
  }

  formatarComoReal(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  calcularValorMensal(valorEmprestimo: number, taxaAoMes: number, prazoEmMeses: number): number {
    const taxaMensal = taxaAoMes / 100;
    const valorMensal = valorEmprestimo *
      (taxaMensal * Math.pow(1 + taxaMensal, prazoEmMeses)) /
      (Math.pow(1 + taxaMensal, prazoEmMeses) - 1);

    return valorMensal;
  }

  onRadioChange(bancoId: number, bancoNome: string, isOtherBank: boolean, isPinbank: boolean) {
    if (this.emprestimo == null) {
      this.emprestimo = new Emprestimo();
    }

    if (bancoId != 0) {
      this.emprestimo.codigoBanco = bancoId;
      this.emprestimo.banco = bancoNome;
    }

    this.isOtherSelected = !isOtherBank;
    this.isPinbank = !isPinbank;
  }

  onSelectChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;

    if (this.emprestimo == null) {
      this.emprestimo = new Emprestimo();
    }

    this.emprestimo.codigoBanco = parseInt(selectElement.value, 10);
    this.emprestimo.banco = selectElement.options[selectElement.selectedIndex].text;
  }

  contratarEmprestimo() {
    if (this.emprestimoForm.valid) {
      this.emprestimo.email = this.emprestimoForm.get('email').value;
      this.serviceEmprestimo.contratar(this.emprestimo).subscribe(
        (data) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Salvo com Sucesso',
            showConfirmButton: true,
            timer: 1500
          });

          this.router.navigate(['/emprestimo/list']);
        }
      );
    }
  }

  prosseguir() {

    this.submit = true;
    

    this.emprestimoForm.get('email').clearValidators();
    this.emprestimoForm.get('email').updateValueAndValidity();
    this.emprestimoForm.get('confirmaremail').clearValidators();
    this.emprestimoForm.get('confirmaremail').updateValueAndValidity();

    if (this.emprestimoForm.valid) {
      this.activeInformacaoBancaria = false;
      this.activeConfirmacao = true;
      this.emprestimo.agencia = this.emprestimoForm.get('agencia').value;
      this.emprestimo.digitoAgencia = this.emprestimoForm.get('agenciaDigito').value;
      this.emprestimo.contaCorrente = this.emprestimoForm.get('contaCorrente').value + this.emprestimoForm.get('contaCorrenteDigito').value;
      this.emprestimo.chavePixTipoId = this.emprestimoForm.get('tipoChavePix').value;
      this.emprestimo.chavepix = this.emprestimoForm.get('chavePix').value;

      this.emprestimoForm.get('email').setValidators([Validators.required, Validators.email]);
      this.emprestimoForm.get('email').updateValueAndValidity();
      this.emprestimoForm.get('confirmaremail').setValidators([Validators.required, Validators.email]);
      this.emprestimoForm.get('confirmaremail').updateValueAndValidity();
    }
  }

  voltarInfoBancaria() {
    this.activeInformacaoBancaria = true;
    this.activeConfirmacao = false;
  }
}
