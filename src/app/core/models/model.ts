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
  constant: any;
}

export interface Constant {
  id: number;
  valeur: string;
  date: string;
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
  