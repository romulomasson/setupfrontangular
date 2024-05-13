export class FuncionarioResponse {
     id: number;
     nome: string;
     dataAdmissao: Date;
     dataUltimaFerias: Date | null;
     salarioLiquido: number;
     salarioBruto: number;
     quantidadeDependentes: number;
     numeroPIS: string;
     cpf: string;
     rg: string;
     dataNascimento: Date;
     cargo: string;
     codigoOcupacao: number | null;
     sexo: string;
     formacaoAcedemica: string;
     multaFGTS: number | null;
     valorRecisao: number | null;
     scoreFuncionario: number | null;
     usuarioId: number;
     ativo: boolean;
     dataCadastro: Date;
     dataAlteracao: Date | null;
     usuarioCadastro: number;
     usuarioAlteracao: number | null;
     email: string | null;
     empresaId: number;
   }