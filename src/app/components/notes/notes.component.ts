// import { Component } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIcon } from '@angular/material/icon';
// import { MatTableModule } from '@angular/material/table';
// import { Router, RouterLink } from '@angular/router';
// export interface PeriodicElement {
//   name: string;
//   fuelId: number;
//   weight: number;
//   symbol: string;
// }

// const ELEMENT_DATA: PeriodicElement[] = [
//   {fuelId: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {fuelId: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {fuelId: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {fuelId: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {fuelId: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {fuelId: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {fuelId: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {fuelId: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {fuelId: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {fuelId: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  
// ];
// @Component({
//   selector: 'app-notes',
//   standalone: true,
//   imports: [MatTableModule,MatButtonModule,MatIcon,RouterLink],
//   templateUrl: './notes.component.html',
//   styleUrl: './notes.component.scss'
// })
// export class NotesComponent {
//   displayedColumns: string[] = [ 'name','symbol'];
//   dataSource = ELEMENT_DATA;
//   constructor(private router : Router){}
//   onRowClick(row: any): void {
//     this.router.navigate(['/notes-details',row.fuelId])
//   }

//   onDeleteClick( element: any): void {
//     console.log('Delete button clicked', element);
//   }
// }


import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../data/notes.service';
import { Note } from '../../data/notes';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'actions'];
  dataSource: Note[] = [];
  carId: string = '';
  isLoading = false;
  error = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notesService: NotesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get carId from route
    this.carId = this.route.snapshot.paramMap.get('carId') || '';
    if (!this.carId) {
      // Extract from URL if not in route params
      const currentUrl = window.location.pathname;
      const segments = currentUrl.split('/');
      const carIndex = segments.indexOf('car');
      if (carIndex !== -1 && segments.length > carIndex + 1) {
        this.carId = segments[carIndex + 1];
      }
    }

    if (this.carId) {
      this.loadNotes();
    } else {
      this.error = true;
      this.snackBar.open('Car ID not found', 'Close', { duration: 3000 });
    }
  }

  loadNotes(): void {
    this.isLoading = true;
    this.notesService.getNotes(this.carId).subscribe({
      next: (notes) => {
        this.dataSource = notes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading notes:', err);
        this.error = true;
        this.isLoading = false;
        this.snackBar.open('Error loading notes', 'Close', { duration: 3000 });
      }
    });
  }

  viewNoteDetails(note: Note): void {
    this.router.navigate(['/notes-details', this.carId, note.id]);
  }

  editNote(note: Note, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/notes-form', this.carId, note.id]);
  }

  deleteNote(note: Note, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      this.isLoading = true;
      this.notesService.deleteNote(this.carId, note.id!)
        .then(() => {
          this.snackBar.open('Note deleted successfully', 'Close', { duration: 3000 });
          // Reload notes list
          this.loadNotes();
        })
        .catch((error) => {
          console.error('Error deleting note:', error);
          this.snackBar.open('Error deleting note', 'Close', { duration: 3000 });
          this.isLoading = false;
        });
    }
  }

  addNote(): void {
    this.router.navigate(['notes-form', this.carId]);
  }
}