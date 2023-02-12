interface Course {
  id?: string;
  code: string;
  title?: string;
  description?: string;
  courseUnits: number;
  semestedId?: string;
  createdAt?: Date;
}

interface Semester {
  id?: string;
  semUnits: number;
  curriculumId?: string;
  courses: Course[];
  createdAt?: Date;
}

interface Curriculum {
  id?: string;
  curricUnits: number;
  userId?: string;
  sems: Semester[];
}
