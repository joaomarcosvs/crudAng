import { v4 as uuid } from 'uuid';

export class Cliente {
  id?: string;
  nome?: string;
  cpf?: string;
  dataNascimento?: string;
  email?: string;

  static newCliente(){
    const cliente = new Cliente();
    cliente.id = uuid();  // chama um id aleatorio pra o cliente
    return cliente;
  }
}
