export interface Task {
  id: string;
  title: string;
  difficulty_level: 'easy' | 'medium' | 'moderate' | 'hard';
  description: string;
  prerequisites: string;
  outcomes: string;
  deadLine?: Date;
  completed?: Boolean;
  status?: 'assigned' | 'submitted' | 'reassigned' | 'completed' | 'inprogress'; // percentage of how much task is compeleted.
  userId?: String;
  approved?: Boolean;
  reassigned?: Number;
  createdAt?: Date;
  updatedAt?: Date;
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
  email: string;
  status: 'pending' | 'approved' | 'banned';
  createdAt: Date;
  lastActive: Date;
  banned: boolean;
  approved: boolean;
};