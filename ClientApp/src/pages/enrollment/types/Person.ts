interface Person  
{
    name:string;
    yob:number;
    scheduleFrom:string;
    vaccinePreferences:number[];
};

export interface EnrollmentRequest {
    persons: Person[]
}

export interface EnrollmentResponse {
  id: number;
  name: string;
  yob: number;
  scheduleFrom: string;
  scheduledBy: number;
  unit: string;
  status: string;
  inviteCount: number;
  lastUpdatedAt: string;
  lastUpdatedBy: number;
  vaccinesPreference: number[];
}