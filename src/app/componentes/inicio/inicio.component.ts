import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx'; // Importar la librería XLSX

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
    excelData: any[] = []; // Almacena los datos del Excel
    selectedItems: any[] = []; // Almacena los elementos seleccionados
  
    constructor(private router:Router){}
    
  
    onFileChange(event: any) {
      const target: DataTransfer = <DataTransfer>(event.target);
      if (target.files.length !== 1) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor selecciona un único archivo',
        });
        return;
      }
  
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.excelData = XLSX.utils.sheet_to_json(ws);
        console.log('Datos leídos del Excel:', this.excelData);
        Swal.fire({
          title: "Archivo Cargado",
          text: `${this.excelData.length} registros encontrados.`,
          icon: "success"
        });
      };
      reader.readAsBinaryString(target.files[0]);
    }
  
    toggleSelection(item: any, event: Event) {
      const isChecked = (event.target as HTMLInputElement).checked; // Hacemos casting explícito
      if (isChecked) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems = this.selectedItems.filter(i => i !== item);
      }
      console.log('Elementos seleccionados:', this.selectedItems);
    }
  
    generateScript() {
      if (this.selectedItems.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Sin selección',
          text: 'Por favor selecciona al menos un elemento.',
        });
        return;
      }
  
      // Generar script basado en los datos seleccionados
      const script = this.selectedItems.map(item => `PLCS VALUES (${Object.values(item).map(val => `'${val}'`).join(', ')});`).join('\n');
      console.log('Script generado:\n', script);
  
       // Crear un archivo Blob con el contenido
      const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });

      // Crear un enlace de descarga
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'script.txt'; // Nombre del archivo
      link.click();

      Swal.fire({
        title: "Script Generado",
        text: "El script ha sido generado. Revisa la consola.",
        icon: "success"
      });
    }
}
