import { Component, OnInit, inject } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { BrasilapiService } from '../brasilapi.service';
import { Estado, Municipio } from '../brasilapi.models';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  imports: [FlexLayoutModule,
            FormsModule,
            MatCardModule,
            MatFormFieldModule,
            MatInputModule,
            MatIconModule,
            MatButtonModule,
            MatSelectModule,
            NgxMaskDirective,
            CommonModule
  ], providers: [
    provideNgxMask()
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit { //controla a camada de visualização

  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(
    private service: ClienteService,
    private brasilApiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router
  ){  }

  ngOnInit(): void {

    this.route.queryParamMap.subscribe((query: any) => {
      const params = query['params']
      const id = params['id']
      if(id){
        let clienteEncontrado = this.service.buscarClientePorId(id);
        if(clienteEncontrado){
          this.atualizando = true;
          this.cliente = clienteEncontrado;
          if(this.cliente.uf){
            const event = {value: this.cliente.uf}
            this.carregarMunicipios(event as MatSelectChange);
          }
        }
      }
    })

    this.carregarUFs();

  }

  carregarUFs(){
    this.brasilApiService.listarUFs().subscribe({
      next: listaEstados => this.estados = listaEstados,
      error: erro => console.log("Ocorreu um erro: ", erro)
    });
  }

  carregarMunicipios(event: MatSelectChange){
    const ufSelecionada = event.value;
    this.brasilApiService.listarMunicipios(ufSelecionada).subscribe({
      next: listaMunicipios => this.municipios = listaMunicipios,
      error: erro => console.log('Ocorreu um erro: ', erro)
    })
  }

  salvar(){ //manda o service salvar, porque é ele quem define onde será salvo
    if(!this.atualizando){
      this.service.salvar(this.cliente);
      this.cliente = Cliente.newCliente();
      this.mostrarMensagem("Cliente salvo com sucesso!");
    }else{
      this.service.atualizar(this.cliente);
      this.router.navigate(['/consulta']);
      this.mostrarMensagem("Cliente atualizado com sucesso!");
    }
  }

  mostrarMensagem(mensagem: string){
    this.snack.open(mensagem, 'Ok')
  }
}
