import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-validation-errors-dialog',
  templateUrl: './validation-errors-dialog.component.html',
  styleUrls: ['./validation-errors-dialog.component.scss'],
})
export class ValidationErrorsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: { errors: string[] },
    private readonly dialogRef: MatDialogRef<ValidationErrorsDialogComponent>,
  ) {}
}
