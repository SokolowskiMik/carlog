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
  isLoading = false;
  error = false;

  constructor(
    private notesService: NotesService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carId = this.route.snapshot.paramMap.get('carId') || '';
    this.noteId = this.route.snapshot.paramMap.get('noteId') || '';

    if (!this.carId || !this.noteId) {
      // Extract from URL if not in route params
      const currentUrl = window.location.pathname;
      const segments = currentUrl.split('/');
      
      const carIndex = segments.indexOf('car');
      if (carIndex !== -1 && segments.length > carIndex + 1) {
        this.carId = segments[carIndex + 1];
      }
      
      const noteIndex = segments.lastIndexOf(segments[segments.length - 1]);
      if (noteIndex !== -1) {
        this.noteId = segments[noteIndex];
      }
    }

    if (this.carId && this.noteId) {
      this.loadNoteDetails();
    } else {
      this.error = true;
      this.snackBar.open('Note ID or Car ID not found', 'Close', { duration: 3000 });
    }
  }

  loadNoteDetails(): void {
    this.isLoading = true;
    this.notesService.getNote(this.carId, this.noteId).subscribe({
      next: (note) => {
        this.note = note;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading note details:', err);
        this.error = true;
        this.isLoading = false;
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
    this.router.navigate(['/car', this.carId, 'notes-form', this.noteId]);
  }

  deleteNote(): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.isLoading = true;
      this.notesService.deleteNote(this.carId, this.noteId)
        .then(() => {
          this.snackBar.open('Note deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/car', this.carId, 'notes']);
        })
        .catch((error) => {
          console.error('Error deleting note:', error);
          this.snackBar.open('Error deleting note', 'Close', { duration: 3000 });
          this.isLoading = false;
        });
    }
  }

  goBackToNotes(): void {
    this.router.navigate(['/car', this.carId, 'notes']);
  }
}