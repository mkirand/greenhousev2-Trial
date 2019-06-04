import { Component, EventEmitter, Output } from '@angular/core';
import { ReadFile } from 'ngx-file-helpers';
import { BoolInput } from '../../decorators/BoolInput'

@Component({
  selector: 'file-dropzone',
  templateUrl: './file-dropzone.html',
  styleUrls: ['./file-dropzone.scss', '../../theme/variables.scss']
})
export class FileDropzoneComponent {
  @Output() drop: EventEmitter<File> = new EventEmitter()
  @BoolInput() hidePhrase: boolean
  file: ReadFile
  reading: boolean = false
  
  addFile(file: ReadFile) {
    this.file = file
    this.drop.emit(file.content)
  }
}
