import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

import { switchMap, tap } from 'rxjs/operators';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css']
})
export class SelectorPageComponent implements OnInit {
  
  miFormulario: FormGroup = this.fb.group({
    region:   ['', Validators.required],
    pais:     ['', Validators.required],
    frontera: ['', Validators.required],
    // frontera: [{value:'', disabled: true}, Validators.required],
  });

  //llenar selectores
  regiones: string[]  = [];
  paises: PaisSmall[] = [];
  fronteras: PaisSmall[] = [];

  cargando!: boolean;

  constructor(private fb:FormBuilder, private ps:PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.ps.regiones;

    //Cambio de region
    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap((_)=>{
            this.miFormulario.get('pais')?.reset('')
            this.cargando = true;
          }),
          switchMap(region=>this.ps.getPaisesPorRegion(region))
        )
        .subscribe( paises =>{
          this.paises = paises;
          this.cargando = false;
        })

    //Cambio de pais
    this.miFormulario.get('pais')?.valueChanges
        .pipe(
          tap((_)=>{
            this.miFormulario.get('frontera')?.reset('')
            this.cargando = true;
          }),
          switchMap(codigo => this.ps.getPaisPorCodigo(codigo)),
          switchMap(pais => this.ps.getPaisesPorCodigos(pais?.borders))
        )
        .subscribe(paises => {
          this.fronteras = paises;
          this.cargando = false;
        });
  }

  guardar(){}

}
