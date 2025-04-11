import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { DialogComponent } from '../dialog/dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expiring-insurence-dialog',
  imports: [    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule],
  templateUrl: './expiring-insurence-dialog.component.html',
  styleUrl: './expiring-insurence-dialog.component.scss'
})
export class ExpiringInsurenceDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ExpiringInsurenceDialogComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: {names: string[]}) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
