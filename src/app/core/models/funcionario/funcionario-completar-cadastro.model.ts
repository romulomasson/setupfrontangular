

export class FuncionarioCompletarCadastro{
      
      constructor(codigoHash: string, cpf: string, dataNascimento: Date, novaSenha: string){
            this.codigoHash = codigoHash;
            this.cpf = cpf;
            this.dataNascimento = dataNascimento;
            this.novaSenha = novaSenha;
      }

      codigoHash: string;
      cpf: string;
      dataNascimento: Date;
      novaSenha: string;
}
