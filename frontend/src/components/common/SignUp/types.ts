export type SignUpRole = "Student" | "Admin";

export interface DepartmentOption {
  id: string;
  label: string;
}

export const STUDENT_DEPARTMENTS: DepartmentOption[] = [
  { id: "CSE", label: "Computer Science & Engineering (CSE)" },
  { id: "ECE", label: "Electronics & Communication (ECE)" },
  { id: "ME", label: "Mechanical Engineering (ME)" },
  { id: "EE", label: "Electrical Engineering (EE)" },
  { id: "Civil", label: "Civil Engineering (CE)" },
  { id: "IT", label: "Information Technology (IT)" },
];

export const ADMIN_DEPARTMENTS: DepartmentOption[] = [
  { id: "Academic Administration", label: "Academic Administration" },
  { id: "Examination Cell", label: "Examination Cell" },
  { id: "Student Affairs", label: "Student Affairs" },
  { id: "Dean / HOD Office", label: "Dean / HOD Office" },
  { id: "General Administration", label: "General Administration" },
];

export const STUDENT_SEMESTERS: string[] = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
];

