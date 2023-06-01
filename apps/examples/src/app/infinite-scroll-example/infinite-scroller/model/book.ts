export interface Book {
  key: string;
  first_sentence?: string[];
  title: string;
  subtitle?: string;
  author_name: string[];
  first_publish_year: number;
}

export interface BookApiResponse {
  numFound: number;
  docs: Book[];
}
