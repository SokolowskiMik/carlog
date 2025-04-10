import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  private videoElement?: HTMLVideoElement;
  private stream?: MediaStream;

  constructor() { }

  async startCamera(videoElement: HTMLVideoElement): Promise<void> {
    this.videoElement = videoElement;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      this.videoElement.srcObject = this.stream;
      await this.videoElement.play();
    } catch (err) {
      console.error('Error starting camera:', err);
      throw err;
    }
  }

  takePhoto(): string | null {
    if (!this.videoElement) return null;

    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return null;

    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }

  stopCamera(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }
  }

  takePhotoBlob(): Blob | null {
    if (!this.videoElement) return null;
  
    const canvas = document.createElement('canvas');
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
  
    ctx.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);
  
    const dataURL = canvas.toDataURL('image/png');
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([arrayBuffer], { type: mimeString });
  }
}
