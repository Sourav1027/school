import { v4 as uuidv4 } from 'uuid';

export interface StudentData {
  id: string;
  name: string;
  section: string;
  class: string;
  division: string;
}

export interface StudentFilters {
  section?: string;
  class?: string;
  division?: string;
}

export class StudentService {
  static processStudentData(rawData: any[]): StudentData[] {
    return rawData.map(student => ({
      id: uuidv4(),
      name: student.Name || 'Unknown',
      section: student.Section || 'N/A',
      class: student.Class || 'N/A',
      division: student.Division || 'N/A'
    }));
  }

  static filterStudents(
    students: StudentData[], 
    filters: StudentFilters
  ): StudentData[] {
    return students.filter(student => 
      (!filters.section || student.section === filters.section) &&
      (!filters.class || student.class === filters.class) &&
      (!filters.division || student.division === filters.division)
    );
  }

  static generateDummyStudents(count: number = 50): StudentData[] {
    const sections = ['A', 'B', 'C'];
    const classes = ['1', '2', '3', '4', '5'];
    const divisions = ['Science', 'Commerce', 'Arts'];

    return Array.from({ length: count }, () => ({
      id: uuidv4(),
      name: `Student ${Math.floor(Math.random() * 1000)}`,
      section: sections[Math.floor(Math.random() * sections.length)],
      class: classes[Math.floor(Math.random() * classes.length)],
      division: divisions[Math.floor(Math.random() * divisions.length)]
    }));
  }
}