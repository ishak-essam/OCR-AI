import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TesseractOcrModule } from './tesseract-ocr/tesseract-ocr.module';

import { AppComponent } from './app.component';
import { OcrComponent } from './ocr/ocr.component';
import {FormsModule} from "@angular/forms";
import {HighlightPipe} from "./highlight";
import { ReaderComponent } from './pdf/reader/reader.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    OcrComponent,
    ReaderComponent,

  ],
  imports: [
    BrowserModule,
    TesseractOcrModule,
    FormsModule,
    HttpClientModule,
    HighlightPipe
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
