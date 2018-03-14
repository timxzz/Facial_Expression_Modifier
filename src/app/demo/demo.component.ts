import { Component, OnInit, Inject } from '@angular/core';
import { EmojiFACES } from '../placeholders-images';
import { Face } from "../face";
import { FileService } from '../file.service'

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  errors: Array<string> =[];
  maxSize: number = 5;
  loading: boolean = false;
  selectedImage: any;
  faces: Face[] = EmojiFACES;

  test: any;

  constructor(private fileService: FileService) { }

  ngOnInit() { }

  // Function refer to: https://nehalist.io/uploading-files-in-angular2/
  onFileChange(event): void {
    this.errors = []; // Clear error
    if(event.target.files && event.target.files.length > 0
        && this.isValidFiles(event.target.files)) {
      this.selectedImage = event.target.files[0];
    }
  }

  onSubmit(): void {
    const inImage = this.prepareUpload();
    this.loading = true;

    this.fileService.getFaces(inImage)
        .subscribe(rxFaces => {this.faces = rxFaces, console.log(rxFaces)});
    // In a real-world app you'd have a http request / service call here like
    // this.http.post(this.apiURL, formModel).subscribe(res => {console.log(res);
    //   this.test = res['image']});
    // setTimeout(() => {
    //   // FormData cannot be inspected (see "Key difference"), hence no need to log it here
    //   console.log('done!');
    //   this.getFaces();
    //   this.loading = false;
    // }, 1000);
  }

  // getFaces(): void {
  //   this.faces = this.fileService.getFaces();
  // }

  private prepareUpload(): any {
    let input = new FormData();
    input.append('image', this.selectedImage);
    console.log(this.selectedImage);
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
