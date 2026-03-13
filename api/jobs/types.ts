import { TaskFn } from "node-cron";

export type JobFunction = {
    rate: string;
    fn: TaskFn | string;
}