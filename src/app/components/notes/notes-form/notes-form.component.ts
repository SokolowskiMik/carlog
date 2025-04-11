// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';
// import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-notes-form',
//   standalone: true,
//   imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,CommonModule,MatButtonModule,MatDatepickerModule,MatNativeDateModule],
//   templateUrl: './notes-form.component.html',
//   styleUrl: './notes-form.component.scss'
// })
// export class NotesFormComponent {
//   noteForm!: FormGroup;
//   noteId!: number | null;
//   selectedImages: File[] = [];

//   constructor(private fb: FormBuilder, private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.noteId = this.route.snapshot.paramMap.get('noteId') ? +this.route.snapshot.paramMap.get('noteId')! : null;

//     this.noteForm = this.fb.group({
//       title: ['', Validators.required], 
//       description: ['', [Validators.required, Validators.minLength(10)]],
//       images: [this.selectedImages, Validators.required]
//     });
//   }

//   // onSubmit() {
//   //   if (this.noteForm.valid) {
//   //     console.log('Fuel Form Submitted:', this.noteForm.value);
//   //   }
//   // }

//   onFilesSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input?.files) {
//       this.selectedImages = Array.from(input.files);
//       this.noteForm.patchValue({
//         images: this.selectedImages
//       });
//     }
//   }
//   onSubmit(): void {
//     if (this.noteForm.valid) {
//       // Handle form submission logic
//       console.log(this.noteForm.value);
//     }
//   }
// }


import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotesService } from '../../../data/notes.service';
import { Note } from '../../../data/notes';
import { CameraService } from '../../../data/camera.service';

@Component({
  selector: 'app-notes-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './notes-form.component.html',
  styleUrl: './notes-form.component.scss'
})
export class NotesFormComponent implements OnInit {
  @ViewChild('cameraVideo') cameraVideo!: ElementRef<HTMLVideoElement>;

  noteForm!: FormGroup;
  noteId: string | null = null;
  carId: string = '';
  selectedImageFiles: File[] = [];
  selectedAudioFile: File | null = null;
  isRecording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audioUrl: string | null = null;
  imagePreviewUrls: string[] = [];
  existingImageUrls: string[] = [];
  isCameraOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService,
    private snackBar: MatSnackBar,
    private cameraService: CameraService,
  ) {}

  ngOnInit(): void {
    // Extract carId from URL for notes-form/carId pattern
    const currentUrl = window.location.pathname;
    console.log('Current URL:', currentUrl);
    
    if (currentUrl.includes('notes-form/')) {
      // Get the part after "notes-form/"
      this.carId = localStorage.getItem("carId")!;
      console.log('Extracted carId from URL:', this.carId);
    }
  
    // Only set noteId from route params, NOT from URL
    this.noteId = this.route.snapshot.paramMap.get('noteId');
    console.log('noteId from params:', this.noteId);
  
    // IMPORTANT: Make sure noteId is not the same as carId (which would happen in "create new" mode)
    if (this.noteId === this.carId) {
      this.noteId = null;
      console.log('Reset noteId because it matched carId');
    }
  
    // Create form
    this.noteForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
    });
  
    if (this.noteId) {
      console.log('Loading existing note data');
      this.loadNoteData();
    } else {
      console.log('Creating new note form');
    }
  }

  loadNoteData(): void {
    if (!this.noteId || !this.carId) return;
  
    this.notesService.getNote(this.carId, this.noteId).subscribe({
      next: (note) => {
        // Check if note exists before accessing its properties
        if (note) {
          this.noteForm.patchValue({
            title: note.title,
            description: note.description
          });
  
          if (note.images && note.images.length > 0) {
            this.existingImageUrls = note.images;
          }
  
          if (note.audioUrl) {
            this.audioUrl = note.audioUrl;
          }
        } else {
          console.log('Note not found, creating a new one');
          // If you're trying to edit a non-existent note, you might want to 
          // redirect or show a message
          this.snackBar.open('Note not found, creating a new one', 'Close', { duration: 3000 });
        }
  
      },
      error: (err) => {
        console.error('Error loading note:', err);
        this.snackBar.open('Error loading note details', 'Close', { duration: 3000 });
      }
    });
  }

  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    // Reset arrays
    this.selectedImageFiles = [];
    this.imagePreviewUrls = [];

    // Process each file
    Array.from(input.files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        this.snackBar.open('Please select only image files', 'Close', { duration: 3000 });
        return;
      }

      this.selectedImageFiles.push(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  startRecording(): void {
    // Reset existing recording
    this.audioChunks = [];
    this.audioUrl = null;
    this.selectedAudioFile = null;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.isRecording = true;
        this.mediaRecorder = new MediaRecorder(stream);
        
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data);
          }
        };

        this.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          this.audioUrl = URL.createObjectURL(audioBlob);
          
          // Convert Blob to File for upload
          this.selectedAudioFile = new File([audioBlob], `recording_${Date.now()}.wav`, { 
            type: 'audio/wav' 
          });
        };

        this.mediaRecorder.start();
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        this.snackBar.open('Could not access microphone. Please check permissions.', 'Close', { duration: 3000 });
      });
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      
      // Stop all audio tracks
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  }

  onAudioFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (!file.type.startsWith('audio/')) {
      this.snackBar.open('Please select an audio file', 'Close', { duration: 3000 });
      return;
    }

    // Reset recording if we're uploading a file instead
    this.audioChunks = [];
    this.audioUrl = URL.createObjectURL(file);
    this.selectedAudioFile = file;
  }

  removeAudio(): void {
    this.audioUrl = null;
    this.selectedAudioFile = null;
    this.audioChunks = [];
  }

  removeImage(index: number): void {
    // Remove from preview
    this.imagePreviewUrls.splice(index, 1);
    // Remove from selected files
    this.selectedImageFiles.splice(index, 1);
  }

  removeExistingImage(index: number): void {
    this.existingImageUrls.splice(index, 1);
  }

  async openCamera() {
    this.isCameraOpen = true;
  
    setTimeout(async () => {
      if (!this.cameraVideo?.nativeElement) {
        console.warn('cameraVideo not available yet');
        return;
      }
  
      try {
        await this.cameraService.startCamera(this.cameraVideo.nativeElement);
      } catch (err) {
        this.snackBar.open('Camera access failed', 'Close', { duration: 3000 });
        this.isCameraOpen = false;
      }
    }, 100);
  }
  
  closeCamera() {
    this.cameraService.stopCamera();
    this.isCameraOpen = false;
  }
  
  captureFromCamera() {
    const blob = this.cameraService.takePhotoBlob();
    if (!blob) {
      this.snackBar.open('Failed to take photo', 'Close', { duration: 3000 });
      return;
    }
  
    // Convert blob to File for upload
    const file = new File([blob], `captured_${Date.now()}.png`, { type: 'image/png' });
    this.selectedImageFiles.push(file);
  
    // Create preview
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrls.push(e.target.result);
    };
    reader.readAsDataURL(file);
  
    this.closeCamera();
  }

  async onSubmit(): Promise<void> {
    if (this.noteForm.invalid) {
      this.snackBar.open('Please fix the errors in the form', 'Close', { duration: 3000 });
      return;
    }

    try {
      const noteData = this.noteForm.value;
      
      // Upload images if any
      const imageUrls: string[] = [...this.existingImageUrls]; // Start with existing images
      
      if (this.selectedImageFiles.length > 0) {
        for (const file of this.selectedImageFiles) {
          const path = `notes/${this.carId}/${Date.now()}_${file.name}`;
          const imageUrl = await this.notesService.uploadFile(file, path);
          imageUrls.push(imageUrl);
        }
      }
      
      // Upload audio if any
      let audioUrl = null;
      if (this.selectedAudioFile) {
        const path = `notes/${this.carId}/${Date.now()}_audio.wav`;
        audioUrl = await this.notesService.uploadFile(this.selectedAudioFile, path);
      } else if (this.audioUrl && this.audioUrl.startsWith('http')) {
        // Keep existing audio URL if it's a remote URL
        audioUrl = this.audioUrl;
      }
      
      // Prepare note data
      const note: Note = {
        title: noteData.title,
        description: noteData.description,
        images: imageUrls,
        audioUrl: audioUrl
      };
      
      if (this.noteId) {
        // Update existing note
        await this.notesService.updateNote(this.carId, this.noteId, note);
        this.snackBar.open('Note updated successfully', 'Close', { duration: 3000 });
      } else {
        // Add new note
        await this.notesService.addNote(this.carId, note);
        this.snackBar.open('Note added successfully', 'Close', { duration: 3000 });
      }
      
      // Navigate back to notes list
      this.router.navigate(['/notes', this.carId]);
      
    } catch (error) {
      console.error('Error saving note:', error);
      this.snackBar.open('Error saving note', 'Close', { duration: 3000 });
    } 
  }
}