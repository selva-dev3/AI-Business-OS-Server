declare module 'pdfkit' {
  interface PDFDocumentOptions {
    margin?: number;
  }
  class PDFDocument {
    constructor(options?: PDFDocumentOptions);
    on(event: string, callback: (...args: any[]) => void): this;
    font(size: number | string): this;
    fontSize(size: number): this;
    font(buffer: Buffer, name?: string): this;
    text(text: string, options?: { align?: string; width?: number }): this;
    text(text: string, x?: number, y?: number, options?: { align?: string; width?: number }): this;
    moveDown(lines?: number): this;
    end(): void;
    y: number;
    _id: any;
  }
  export default PDFDocument;
}
