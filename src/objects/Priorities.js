export const priorityChange = (priority) => {
  return {
    number: priority,
    toString: () => {
      if (priority === 1) {
        return "high";
      } else if (priority === 2) {
        return "medium";
      } else if (priority === 3) {
        return "low";
      }
      return "none";
    },
  };
};
