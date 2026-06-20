declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    info: {
      PDFFormatVersion?: string;
      IsAcroFormPresent?: boolean;
      IsXFAPresent?: boolean;
      Title?: string;
      Author?: string;
      Subject?: string;
      Keywords?: string;
      Creator?: string;
      Producer?: string;
      CreationDate?: string;
      ModDate?: string;
      [key: string]: unknown;
    };
    metadata?: {
      _metadata?: Record<string, unknown>;
      getAll?: () => Record<string, unknown>;
    };
    version?: string;
    numpages?: number;
    numrender?: number;
    fingerprint?: string;
  }

  interface PDFOptions {
    pagerender?: (pageData: unknown) => string;
    max?: number;
    version?: string;
  }

  function pdfParse(dataBuffer: Buffer, options?: PDFOptions): Promise<PDFData>;

  export = pdfParse;
}