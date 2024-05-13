
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Options } from 'ngx-slider-v2';
import { FuncionarioCreditoService } from 'src/app/core/services/funcionariocredito.service';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EmprestimoService } from 'src/app/core/services/emprestimo.service';

@Component({
  selector: 'list-emprestimo',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ListComponent implements OnInit {

  constructor(public formBuilder: UntypedFormBuilder
    , private serviceFuncionarioCredito: FuncionarioCreditoService
    , private router: Router
    , private service: EmprestimoService
  ) {
  }

  breadCrumbItems: Array<{}>;  

  emprestimoForm: UntypedFormGroup;

  meusemprestimos: any

  ngOnInit() {

    this.breadCrumbItems = [{ label: 'Empréstimo' }, { label: 'Simular', active: true }];

    this.load();

  }

  load() {
		
    this.service.get().subscribe(
			data => {
				this.meusemprestimos = data;				
			}
		);
  }

  getStatusDescricao(statusId: number): string {
    switch (statusId) {
      case 1: return 'Pendente';
      case 2: return 'Em Aprovação';
      case 3: return 'Aguardando Assinatura';
      case 4: return 'Aprovado';
      case 5: return 'Reprovado';
      default: return 'Desconhecido';
    }
  }
  
  formatarComoReal(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }


}
