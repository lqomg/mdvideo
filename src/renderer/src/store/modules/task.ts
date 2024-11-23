import { TaskStates } from '@api/contanst';
import { ITaskState } from '@api/store';
import { defineStore } from 'pinia';

export const useTaskStore = defineStore('task', {
  state(): { tasks: ITaskState[] } {
    return {
      tasks: []
    };
  },
  getters: {
    getTaskStateCount(state) {
      const completeValue = state.tasks.filter(
        (task) => task.states === TaskStates.Complete
      ).length;
      const waitingValue = state.tasks.filter((task) => task.states === TaskStates.Waiting).length;
      const errorValue = state.tasks.filter((task) => task.states === TaskStates.Error).length;
      return {
        completeValue,
        waitingValue,
        errorValue
      };
    }
  }
});
