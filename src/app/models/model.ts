export interface Analysis {
    id: number;
    name: string;
  }
  
export interface Analysis_Result {
  id: number;
  analysis: Analysis;
  result: string;
}

export interface TypeConstant {
  id: number;
  name: string;
  unit: string;
  constant: any;
}

export interface Constant {
  id: number;
  valeur: string;
  date: Date;
  typeConstant: TypeConstant;
}

export interface InfoMedicalRecord {
  id: number;
  diagnostique: string;
  date: string;
  analyses_resultats: Analysis_Result[];
  traitement: string;
  medicalRecord?: any;
  constants: Constant[];
}

export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  sex: string;
  phone: string;
  roles: Role[];
  email: string;
  hospital: Hospital;
  speciality: Speciality;
  userType: string;
  active: boolean;
  permissions: Permission[];
}

export interface Hospital {
  id: number;
  name: string;
  location: string;
}

export interface Speciality {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Room {
  id: number;
  room: string;
}

export interface Building {
  id: number;
  name: string;
  roomDTO: Room[]
}

export interface MedicalRecord {
  id: number;
  code_dossier: string;
  date_creation: Date
  speciality: Speciality;
}

export interface Module {
  id: number;
  name: string;
  code: string;
  description: string;
  route: string;
  icon: string;
  displayOrder: string;
  parentId: number;
  subModules: Module[];
}

export interface Permission {
  id: number;
  codeName: string
  name: string;
  description: string;
}

export interface PublicHoliday {
  id: number;
  name: string;
  date: Date;
}