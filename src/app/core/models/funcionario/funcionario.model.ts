import { EntityBase } from "../entityBase";

	export class Funcionario extends EntityBase {
		constructor(){
			super();
			this.id = 0;              
		}       
          nome: string = '';
          dataAdmissao: Date = new Date();         
          dataUltimaFerias?: Date | null = null;
          salarioLiquido?: number | null = null;
          salarioBruto?: number | null = null;
          quantidadeDependentes?: number | null = null;
          numeroPIS: string = '';
          cpf: string = '';
          rg: string = '';
          dataNascimento?: Date | null = null;
          cargo: string = '';
          codigoOcupacao?: number | null = null;
          sexo: string = '';
          formacaoAcedemica: string = '';
          multaFGTS?: number | null = null;
          valorRecisao?: number | null = null;
          scoreFuncionario?: number | null = null;
          usuarioId: number = 0;
          ativo: boolean = false;
          dataCadastro: Date = new Date();
          dataAlteracao?: Date | null = null;
          usuarioCadastro?: number | null = null;
          usuarioAlteracao?: number | null = null;
          email: string = '';
          empresaId: number = 0;
    }
