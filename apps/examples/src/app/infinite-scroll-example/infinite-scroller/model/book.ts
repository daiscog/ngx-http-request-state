export interface Book {
  titleweb: string;
  subtitle: string;
  formatname: string;
  isbn: string;
  onsaledate: string;
  pages: string;
  flapcopy: string;
  authorweb: string;
}

export interface BookApiResponse {
  title: Book[];
}
