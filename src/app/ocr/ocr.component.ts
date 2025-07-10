import { Component, OnInit } from '@angular/core';
import * as Tesseract from 'tesseract.js';
import {GeminiService} from "../services/gemini.service";
import * as pdfjsLib from 'pdfjs-dist';
@Component({
  selector: 'app-ocr',
  templateUrl: './ocr.component.html',
  styleUrls: ['./ocr.component.scss'],
})
export class OcrComponent  implements OnInit {
  extractedText: string = '';
  loading: boolean = false;
  searchText = '';
  searchResult = '';
  onFileSelected(event: any): void {
    const file = event.target.files[0];
     // let pdfText =  readPdfText({url: file});
    // console.info(pdfText);
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const imageData = reader.result as string;
        this.performOCR(imageData);
      };

      reader.readAsDataURL(file); // Convert image to Base64 format
    }
  }

  performOCR(imageData: string): void {
    this.loading = true;

    Tesseract.recognize(
      imageData
    )
      .then(({ data: { text } }) => {
        this.extractedText = this.removeAngleBrackets(text); // Extracted text
        this.loading = false;
      })
      .catch((err) => {
        console.error('OCR Error:', err);
        this.loading = false;
      });
  }

  search() {
    if (this.extractedText.toUpperCase().includes(this.searchText.toUpperCase())) {
      this.searchResult = 'Text "' + this.searchText + '"' + 'exists. Occurences :' + this.countNumberOfOccurences();
    } else {
      this.searchResult = "Not exist"
    }
  }
  extractedText2: string = '';

  async onFileSelected2(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = async () => {
      if (reader.result) {
        // 🔥 Set worker source first!
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const typedarray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

        let text = '';
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join('\n');
          text += pageText + '\n';
        }

        this.extractedText2 = text;
        this.summarize()
      }
    };
  }


  countNumberOfOccurences() {
    const regex = new RegExp(this.searchText.toUpperCase(), "g");
    return (this.extractedText.toUpperCase().match(regex) || []).length;
  }

  removeAngleBrackets(text: string): string {
    return text.replace(/[<>]/g, ' ');
  }
  responseText = '';

  constructor(private geminiService: GeminiService) {}

  ngOnInit() {

  }
template:any
summarize(){
  this.geminiService.generateContent(this.extractedText2).subscribe(
    (res: any) => {
      console.log(res);
      this.template=res.candidates[0].content.parts[0].text;
    },
    (err) => {
      console.error(err);
    }
  );
}
}
