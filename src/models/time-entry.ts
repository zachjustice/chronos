import { Activity } from "./activity";

export interface TimeEntry {
  id?: number;
  comment?: string;
  started?: string;
  ended?: string;
  activity?: Activity;
}
