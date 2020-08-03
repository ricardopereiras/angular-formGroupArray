import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'exemplo-formArray';
  Formulario: FormGroup;
  Enderecos: FormArray;
  mostraLoader: boolean = false;



  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.Formulario = this.fb.group({
      Enderecos: this.fb.array([this.criaItem()])
    });
  }

  criaItem() {
    return this.fb.group({
      cep: new FormControl(''),
      logradouro: new FormControl(''),
      complemento: new FormControl(''),
      bairro: new FormControl(''),
      cidade: new FormControl(''),
      uf: new FormControl(''),
      ibge: new FormControl('')
    });
  }


  adicionaFormulario() {
    this.Enderecos = this.Formulario.get('Enderecos') as FormArray;
    this.Enderecos.push(this.criaItem());
  }

  onSubmit() {

  }

  buscaCEP(cep, index) {

    this.mostraLoader = true;

    this.buscaViaCEP(cep).toPromise()
      .then((result) => {
        let data: any = result;
        setTimeout(() => {
          this.Formulario.controls.Enderecos['controls'][index].patchValue({
            bairro: data.bairro,
            complemento: data.complemento,
            ibge: data.ibge,
            cidade: data.localidade,
            logradouro: data.logradouro,
            uf: data.uf
          });
          setTimeout(() => { this.mostraLoader = false; }, 200);
        }, 500);
      }).catch((err) => {
        alert(err.message);
        this.mostraLoader = false;
      });
  }

  buscaViaCEP(cep) {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`)
  }

}
