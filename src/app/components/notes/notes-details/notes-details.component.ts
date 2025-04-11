// import { Component } from '@angular/core';
// import {MatButtonModule} from '@angular/material/button';
// import {MatCardModule} from '@angular/material/card';
// import { RouterLink } from '@angular/router';

// interface Note {
//   noteId : number,
//   title: string;
//   images: string[];
//   description: string;
// }

// @Component({
//   selector: 'app-notes-details',
//   standalone: true,
//   imports: [MatButtonModule,MatCardModule,RouterLink],
//   templateUrl: './notes-details.component.html',
//   styleUrl: './notes-details.component.scss'
// })
// export class NotesDetailsComponent {
//   note: Note = {
//     noteId:1,
//     title: "Image Collection",
//     images: [
//       "https://material.angular.io/assets/img/examples/shiba2.jpg",
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s",
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9SRRmhH4X5N2e4QalcoxVbzYsD44C-sQv-w&s"
//     ],
//     description: "A collection of images showcasing different visuals."
//   };
  
//   currentIndex = 0;

//   nextImage() {
//     this.currentIndex = (this.currentIndex + 1) % this.note.images.length;
//   }

//   prevImage() {
//     this.currentIndex = (this.currentIndex - 1 + this.note.images.length) % this.note.images.length;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotesService } from '../../../data/notes.service';
import { Note } from '../../../data/notes';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-note-details',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    CommonModule
  ],
  templateUrl: './notes-details.component.html',
  styleUrl: './notes-details.component.scss'
})
export class NotesDetailsComponent implements OnInit {
  note: Note | null = null;
  carId: string = '';
  noteId: string = '';
  currentImageIndex = 0;

  constructor(
    private notesService: NotesService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('carId') || '';
    this.noteId = this.route.snapshot.paramMap.get('noteId') || '';

    if (this.carId && this.noteId) {
      this.loadNoteDetails();
    } else {
      this.snackBar.open('Note ID or Car ID not found', 'Close', { duration: 3000 });
    }
  }

  loadNoteDetails(): void {
    this.notesService.getNote(this.carId, this.noteId).subscribe({
      next: (note) => {
        this.note = note;
      },
      error: (err) => {
        console.error('Error loading note details:', err);
        this.snackBar.open('Error loading note details', 'Close', { duration: 3000 });
      }
    });
  }

  nextImage(): void {
    if (this.note?.images && this.note.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.note.images.length;
    }
  }

  prevImage(): void {
    if (this.note?.images && this.note.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.note.images.length) % this.note.images.length;
    }
  }

  editNote(): void {
    this.router.navigate(['/notes-form', this.noteId]);
  }

  deleteNote(): void {
    this.openDialog().then(confirmed => {
      if (confirmed) {
        this.notesService.deleteNote(this.carId, this.noteId)
          .then(() => {
            this.snackBar.open('Note deleted successfully', 'Close', { duration: 3000 });
            this.router.navigate(['/notes', this.carId]);
          })
          .catch((error) => {
            console.error('Error deleting note:', error);
            this.snackBar.open('Error deleting note', 'Close', { duration: 3000 });
          });
      }
    });
  }

  goBackToNotes(): void {
    this.router.navigate(['/notes', this.carId]);
  }

    openDialog(): Promise<boolean> {
      const dialogRef = this.dialog.open(DialogComponent, {});
  
      return dialogRef.afterClosed().toPromise().then(result => {
        console.log('The dialog was closed', result);
        return result;
      });
    }
  
}