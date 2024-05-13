import { EntityBase } from "../entityBase";

export class Emprestimo extends EntityBase {
      constructor() {
            super();
            this.id = 0;
      }
      funcionarioCreditoId: number = 0;
      valor?: number | null = null;
      codigoBanco: number = 0;
      banco: string = ''; 
      agencia: number = 0;
      digitoAgencia: number = 0;
      contaCorrente: number = 0;
      chavePixTipoId: number = 0;
      chavepix: string = '';   
      parcelas: number =0;   
      valorParcela?: number | null = null;
      taxaAoMes: number | null = null;
      emprestimoDadoBancarioTipoId: number = 0
      email: string = '';   
}
