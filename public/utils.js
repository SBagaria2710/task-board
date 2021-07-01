const getId = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const getEmptyTask = () => ({
  id: `task${getId()}`,
  title: '',
  description: '',
});

const getEmptyGroup = () => ({
id: `group${getId()}`,
name: '',
colorHex: '',
tasks: [],
});

export {
  getEmptyTask,
  getEmptyGroup
}