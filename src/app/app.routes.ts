import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path:'',component:InicioComponent}
];
@NgModule({
        imports:[RouterModule.forRoot(routes)],
        exports:[RouterModule]
})
export class AppRoutes{}