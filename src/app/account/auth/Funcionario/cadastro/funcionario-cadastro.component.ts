import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FuncionarioService } from 'src/app/core/services/funcionario.service';
import { FuncionarioInfoCadastro } from 'src/app/core/models/funcionario/funcionario-info-cadastro.model';
import { FuncionarioCompletarCadastro } from 'src/app/core/models/funcionario/funcionario-completar-cadastro.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-funcionario-cadastro',
  templateUrl: './funcionario-cadastro.component.html',
  styleUrls: ['./funcionario-cadastro.component.scss']
})
export class FuncionarioCadastroComponent implements OnInit {

  signupForm: UntypedFormGroup;
  submitted: any = false;
  showPassword!: boolean;
  showPasswordConfirm!: boolean;
  cadastroHash: string;
  infoCadastro: FuncionarioInfoCadastro = new FuncionarioInfoCadastro();

  year: number = new Date().getFullYear();

  constructor(private formBuilder: UntypedFormBuilder, 
    private route: ActivatedRoute,
    private funcionarioService: FuncionarioService,
    private router: Router,
    public store: Store) {
      this.cadastroHash = this.route.snapshot.params['hash'];
  }

  ngOnInit() {
    this.funcionarioService.obterInfoCadastro(this.cadastroHash).subscribe({
      next: (result) => this.infoCadastro = result,
      error: () => this.router.navigate(['/auth/funcionario/login'])
    });

    this.signupForm = this.formBuilder.group({
      cpf: ['', Validators.required],
      dataNascimento: ['', [Validators.required]],
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required, this.passwordMatchValidator()]],
    });
  }

  get f() { return this.signupForm.controls; }

  private passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = control.root.get('password');
      const passwordConfirm = control.value;
      return password && passwordConfirm && password.value !== passwordConfirm ? { passwordMismatch: true } : null;
    };
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if(!this.signupForm.valid){
      return;
    }

    const cpf = this.f['cpf'].value;
    const dataNascimento = this.f['dataNascimento'].value;
    const password = this.f['password'].value;

    var model = new FuncionarioCompletarCadastro(this.cadastroHash, cpf, new Date(dataNascimento), password);
    this.funcionarioService.completarCadastro(model).subscribe({
      next: (result) => {
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Cadastro concluido com sucesso, você será redirecionado à tela de Login',
        });
        this.router.navigate(['/auth/funcionario/login']);
      },
      error: (error) => {
        console.log(error); 
      }
    })
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  toggleShowPasswordConfirm() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }
}
