const getId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const getEmptyTask = () => ({
  id: `task${getId()}`,
  isNew: true,
  title: '',
  description: '',
});

const getEmptyGroup = (name = '', canDelete = true) => ({
id: `group${getId()}`,
name,
canDelete,
colorHex: '',
tasks: [],
});

const reorder = (group, startIndex, endIndex) => {
  if (!group.length) return;
  const { tasks } = group[0];
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return { ...group[0], tasks: result };
};

const move = (source, destination, droppableSource, droppableDestination) => {
  if (!(source?.length && destination?.length)) return;
  const { tasks: sourceTasks } = source[0];
  const { tasks: destinationTasks } = destination[0];
  const sourceClone = Array.from(sourceTasks);
  const destClone = Array.from(destinationTasks);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result['source'] = { ...source[0], tasks: sourceClone };
  result['destination'] = { ...destination[0], tasks: destClone };
  return result;
};

const updateTaskValue = (state, groupId, taskId, key = '', value = '') => {
  return state.map(group => {
    if (group.id === groupId) {
      const { tasks } = group;
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, isNew: false, [key]: value };
        } else {
          return task;
        }
      });
      return { ...group, tasks: updatedTasks }
    } else {
      return group;
    }
  });
}

const getTaskObj = (state, groupId, taskId) => {
  try {
    const groupCtx = state.find(group => group.id === groupId);
    const taskCtx = groupCtx.tasks.find(task => task.id === taskId);
    return taskCtx;
  } catch {
    return undefined;
  }
}

export {
  getEmptyTask,
  getEmptyGroup,
  reorder,
  move,
  updateTaskValue,
  getTaskObj,
}