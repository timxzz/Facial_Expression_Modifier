import { Component, OnInit, Inject } from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations'


import { EmojiFACES } from '../placeholders-images';
import { Face } from "../face";
import { FileService } from '../file.service'

import 'rxjs/add/operator/finally';

@Component({
  selector: 'app-demo',
  animations: [
    trigger(
      'errorAnimation',
      [
        state('*', style({ 'overflow-y': 'hidden' })),
        state('void', style({ 'overflow-y': 'hidden' })),
        transition(
          '* => void', [
            style({ height: '*', opacity: 1}),
            animate('500ms', style({ height: 0, opacity: 0 }))
          ]
        ),
        transition(
          'void => *', [
            style({ height: 0, opacity: 0 }),
            animate('500ms', style({ height: '*', opacity: 1 })),
          ]
        )]
    )
  ],
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  errors: Array<string> =[];
  maxSize: number = 5;
  loading: boolean = false;
  selectedImage: any;
  faces: Array<Face> = EmojiFACES;
  fileChanged: boolean = false;
  hoverOnUpload: boolean = false;

  constructor(private fileService: FileService) { }

  ngOnInit() { }

  mouseEventOnUpload(e): void {
    if(e.type==='mouseover') this.hoverOnUpload = true;
    else if(e.type==='mouseout') this.hoverOnUpload = false;
  }

  // Function refer to: https://nehalist.io/uploading-files-in-angular2/
  onFileChange(event): void {
    this.errors = []; // Clear error
    if(event.target.files && event.target.files.length > 0
        && this.isValidFiles(event.target.files)) {

      this.selectedImage = event.target.files[0];
      this.fileChanged = true;

      // For preview
      var reader = new FileReader();
      reader.onload = (event:any) => {
        this.faces[0].image = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onSubmit(): void {
    if(!this.selectedImage){
      this.errors.push("Upload image by clicking the guy with glasses");
      console.log("Haven't selected image to upload.");
      return;
    }

    const inImage = this.prepareUpload();
    this.loading = true;

    this.fileService.getFaces(inImage)
        .finally(() => { this.loading = false; })
        .subscribe(
          (data) => {
            this.faces = data;
            this.selectedImage = null;
            this.fileChanged = false;
          },

          (err) => {
            console.log(err);
            if(err.status == 0) {
              this.errors.push("Backend server off-line");
            } else {
              this.errors.push(err.error.message);
            }
          }
        );
  }

  private prepareUpload(): any {
    let input = new FormData();
    input.append('image', this.selectedImage);
    return input;
  }

  private isValidFiles(files){
    // Check Number of files
    if (files.length > 1) {
      this.errors.push("Error: At a time you can upload only 1 image");
      return;
    }
    this.isValidFileSize(files[0]);
    return this.errors.length === 0;
  }

  private isValidFileSize(file) {
    let fileSizeInMB = file.size / (1024 * 1000);
    let size = Math.round(fileSizeInMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.maxSize)
      this.errors.push("Error (File Size): " + file.name + ": exceed image size limit of "
                        + this.maxSize + "MB ( " + size + "MB )");
  }
}
