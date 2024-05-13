import { Component, OnInit, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Funcionario } from 'src/app/core/models/funcionario/funcionario.model';
import { FuncionarioService } from 'src/app/core/services/funcionario.service';
import Swal from 'sweetalert2';
import { IdService } from '../id.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { Observable } from 'rxjs';

@Component({
  selector: 'upload-funcionario',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})

export class UploadComponent implements OnInit {

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
    this.breadCrumbItems = [{ label: 'Funcionários' }, { label: 'Upload', active: true }];

    this.submit = false;
  }

  // Função para formatar a data
  private formatarData(data: string): string {
    if (data != null) {
      return data.split('T')[0];
    }
    return data;
  }

  // file upload
  public dropzoneConfig: DropzoneConfigInterface = {
    clickable: true,
    addRemoveLinks: true,
    previewsContainer: false,
    acceptedFiles: '.csv'
  };


  downloadTemplate() {
    this.funcionarioService.downloadTemplate().subscribe(
      (data) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'layout.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  }
  uploadedFiles: any[] = [];

  // File Upload
  onUploadSuccess(event: any) {
    const uploadedFile = event[0];

    this.funcionarioService.importarFuncionarios(uploadedFile).subscribe(
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

  // File Remove
  removeFile(event: any) {
    this.uploadedFiles.splice(this.uploadedFiles.indexOf(event), 1);
  }

  cancelar() {
    this.router.navigate(['/funcionario/list']);
  }

  salvar() {

    this.submit = true;

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
        // Sucesso (status 200)
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

}
