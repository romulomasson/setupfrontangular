import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Funcionario } from 'src/app/core/models/funcionario/funcionario.model';
import { FuncionarioService } from 'src/app/core/services/funcionario.service';
import Swal from 'sweetalert2';
import { IdService } from '../id.service';

@Component({
  selector: 'edit-funcionario',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})

export class EditComponent implements OnInit {

  constructor(private router: Router
    , public formBuilder: UntypedFormBuilder
    , private funcionarioService: FuncionarioService
    , private idService: IdService) {
  }

  breadCrumbItems: Array<{}>;
  submit: boolean;
  id: number;
  usuarioId: number;
  get form() {
    return this.funcionarioForm.controls;
  }

  funcionarioForm: UntypedFormGroup;

  ngOnInit() {
    this.funcionarioForm = this.formBuilder.group({
      nomefuncionario: ['', [Validators.required]],
      dataAdmissao: ['', [Validators.required]],
      salarioLiquido: ['', [Validators.required]],
      salarioBruto: ['', [Validators.required]],
      quantidadeDependentes: [null],
      numeroPIS: [''],
      cpf: ['', [Validators.required]],
      rg: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      cargo: [''],
      codigoOcupacao: [null],
      sexo: ['', [Validators.required]],
      formacaoAcedemica: [''],
      email: ['', [Validators.required, Validators.email]],
      dataUltimaFerias: [null]
    });

    this.id = this.idService.getId();

    if (this.id != null) {
      this.funcionarioService.getById(this.id).subscribe(
        (data) => {

          this.usuarioId = data.usuarioId;
          this.funcionarioForm = this.formBuilder.group({
            nomefuncionario: [data.nome, [Validators.required]],
            dataAdmissao: [this.formatarData(data.dataAdmissao), [Validators.required]],
            salarioLiquido: [data.salarioLiquido, [Validators.required]],
            salarioBruto: [data.salarioBruto, [Validators.required]],
            quantidadeDependentes: [data.quantidadeDependentes],
            numeroPIS: [data.numeroPIS],
            cpf: [data.cpf, [Validators.required]],
            rg: [data.rg, [Validators.required]],
            dataNascimento: [this.formatarData(data.dataNascimento), [Validators.required]],
            cargo: [data.cargo],
            codigoOcupacao: [data.codigoOcupacao],
            sexo: [data.sexo, [Validators.required]],
            formacaoAcedemica: [data.formacaoAcedemica],
            email: [data.email, [Validators.required]],
            dataUltimaFerias: [this.formatarData(data.dataUltimaFerias)],
          });
        },
        (error) => {
          // Erro
          console.error('Erro:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo deu errado!',
          });
        }
      );
    }

    this.breadCrumbItems = [{ label: 'Funcionários' }, { label: 'Novo Funcionário', active: true }];

    this.submit = false;
  }

  private formatarData(data: string): string {
    if (data != null) {
      return data.split('T')[0];
    }
    return data;
  }

  cancelar() {
    this.router.navigate(['/funcionario/list']);
  }

  salvar() {

    this.submit = true;

    if (this.funcionarioForm.valid) {
      var funcionario = new Funcionario();
      funcionario.nome = this.funcionarioForm.get('nomefuncionario').value;
      funcionario.dataAdmissao = this.funcionarioForm.get('dataAdmissao').value;
      funcionario.salarioLiquido = this.funcionarioForm.get('salarioLiquido').value;
      funcionario.salarioBruto = this.funcionarioForm.get('salarioBruto').value;
      funcionario.quantidadeDependentes = this.funcionarioForm.get('quantidadeDependentes').value === "" ? null : this.funcionarioForm.get('quantidadeDependentes').value;
      funcionario.numeroPIS = this.funcionarioForm.get('numeroPIS').value;
      funcionario.cpf = this.funcionarioForm.get('cpf').value;
      funcionario.rg = this.funcionarioForm.get('rg').value;
      funcionario.dataNascimento = this.funcionarioForm.get('dataNascimento').value;
      funcionario.cargo = this.funcionarioForm.get('cargo').value;
      funcionario.codigoOcupacao = this.funcionarioForm.get('codigoOcupacao').value;
      funcionario.sexo = this.funcionarioForm.get('sexo').value;
      funcionario.formacaoAcedemica = this.funcionarioForm.get('formacaoAcedemica').value;
      funcionario.email = this.funcionarioForm.get('email').value;
      funcionario.dataUltimaFerias = this.funcionarioForm.get('dataUltimaFerias').value;

      if (this.id != null) {
        funcionario.id = this.id;
        funcionario.usuarioId = this.usuarioId;
      }

      this.funcionarioService.save(funcionario).subscribe(
        (data) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Salvo com Sucesso',
            showConfirmButton: true,
            timer: 1500
          });
          console.log('Sucesso:', data);

          this.router.navigate(['/funcionario/list']);
        },
        (error) => {
          console.error('Erro:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Algo deu errado!',
          });
        }
      );
    }
  }

}
