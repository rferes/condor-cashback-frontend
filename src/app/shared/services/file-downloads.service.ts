import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileDownloadService {
  constructor(private http: HttpClient) {}

  fileDownload(apiUrl: string, fileName: string, data: any) {
    return this.http
      .post(apiUrl, data, { responseType: 'blob' })
      .subscribe((blob) => {
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = fileName;
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      });
  }
}
