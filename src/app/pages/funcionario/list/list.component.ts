import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { FuncionarioService } from 'src/app/core/services/funcionario.service';
import { FuncionarioFilter } from 'src/app/core/models/funcionario/funcionario-filter.model';
import { Router } from '@angular/router';
import { IdService } from '../id.service';

@Component({
  selector: 'list-funcionario',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})


export class ListComponent implements OnInit {
  searchTerm: any;
  modalRef?: BsModalRef;
  page: any = 1;
  
  breadCrumbItems: Array<{}>;
  jobListForm!: UntypedFormGroup;
  submitted: boolean = false;
  endItem: any;
  term: any
  
  content?: any;
  lists?: any;
  listsOriginal?: any;
  total: Observable<number>;
  currentPage: any;
  joblist: any;
  searchResults: any;
  constructor(private modalService: BsModalService
    , private formBuilder: UntypedFormBuilder
    , public store: Store
    , private service: FuncionarioService
    , private router: Router
    , private idService: IdService) {
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Funcionários' }, { label: 'Listagem', active: true }];

    this.load();
    
  }
  load() {
    let funcionarioFilter = new FuncionarioFilter();
		
    this.service.getFuncionarios(funcionarioFilter).subscribe(
			data => {
				this.lists = data;				
			},
			error => {
				console.error('Erro ao listar funcionários', error);
			}
		);
  }

  novoFuncionario(): void {
    this.idService.setId(null);
    this.router.navigate(['/funcionario/edit']);
  }

  uploadFuncionario(): void {
    this.router.navigate(['/funcionario/upload']);
  }
  
  delete(event: any, idFuncionario: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Deseja realmente excluir?',
        text: 'Essa ação não pode ser desfeita!',
        icon: 'warning',
        confirmButtonText: 'Sim, Deletar!',
        cancelButtonText: 'Não, Cancelar!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {         

          this.service.delete(idFuncionario).subscribe(r=> {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Registro deletado com Sucesso!',
              showConfirmButton: true,
              timer: 1500
            });
            event.target.closest('tr')?.remove();
          });
          
          
        } else if (         
          result.dismiss === Swal.DismissReason.cancel
        ) {
         
        }
      });
  }
 
  editDataGet(id: any, content: any) {
    this.idService.setId(id);
    this.router.navigate(['/funcionario/edit']);
  }
  
  // pagination
  pageChanged(event: any) {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.endItem = event.page * event.itemsPerPage;
    this.lists = this.joblist.slice(startItem, this.endItem)
  }

  searchfuncionario() {
    if (this.term) {
      if (this.listsOriginal == null) {
          this.listsOriginal = this.lists;
      }
      this.lists = this.lists.filter((data: any) => {
        return data.nome.toLowerCase().includes(this.term.toLowerCase())
      })
    } else {
      this.lists = this.listsOriginal
    }

  }
 
}
