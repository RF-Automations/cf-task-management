export interface Task {
  id: string;
  assignedBy?: string;
  userId?: String;
  approved?: Boolean;
  title: string;
  description: string;
  difficulty_level: 'easy' | 'medium' | 'moderate' | 'hard';
  reassigned?: Number;
  prerequisites: string;
  outcomes: string;
  deadLine?: Date;
  status?: 'assigned' | 'submitted' | 'reassigned' | 'completed' | 'inprogress'; // percentage of how much task is compeleted.
  completed?: Boolean;
  createdAt?: Date;
  updatedAt?: Date;


  user?: any
}


export const DifficultyLevel = {
  easy: 'easy',
  medium: 'medium',
  moderate: 'moderate',
  hard: 'hard',
}

export const TaskStatus = {
  assigned: 'assigned',
  submitted: 'submitted',
  reassigned: 'reassigned',
  completed: 'completed',
  'inprogress': 'inprogress'
}


export interface TaskCount {
  inProgress: number;
  completed: number;
  submitted: number;
  reassigned: number;
  assigned: number;
}

export interface User{
  id: string;
  name: string;
  role: string;
  email: string;
  createdAt: Date;
  lastActiveAt: Date;
  banned: boolean;
  approved: boolean;
};