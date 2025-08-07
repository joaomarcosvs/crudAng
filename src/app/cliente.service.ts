import { Injectable } from '@angular/core';
import { Cliente } from './cadastro/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService { //os dados serão salvos no browser, mas poderia ser em um servidor

  static REPO_CLIENTES = "_CLIENTES";

  constructor() { }

  salvar(cliente: Cliente){
    const storage = this.obterStorage();
    storage.push(cliente);

    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(storage));
  }

  pesquisarClientes(nomeBusca: string): Cliente[]{

    const clientes = this.obterStorage();

    if(!nomeBusca){
      return clientes;
    }

    return clientes.filter(clientes => clientes.nome?.indexOf(nomeBusca) !== -1) //indexOf retorna o indice do nome buscado
  }

  private obterStorage(): Cliente[]{

    const repositorioClientes = localStorage.getItem(ClienteService.REPO_CLIENTES);
    if(repositorioClientes){
      const clientes: Cliente[] = JSON.parse(repositorioClientes);
      return clientes;
    }

    const clientes: Cliente[] = [];
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientes)); //transforma o json em string

    return clientes;

  }
}
