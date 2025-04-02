/**
 * Calculates weekly task completion data for a bar chart showing completed tasks vs assigned tasks
 * @param tasks Array of tasks from API
 * @returns Weekly task data formatted for a bar chart
 */
export const calculateWeeklyTaskCompletion = (tasks: any) => {
  // Initialize the data structure for all days of the week
  const weeklyData = [
    { name: "Mon", compeletedTask: 0, assignedTask: 0 },
    { name: "Tue", compeletedTask: 0, assignedTask: 0 },
    { name: "Wed", compeletedTask: 0, assignedTask: 0 },
    { name: "Thu", compeletedTask: 0, assignedTask: 0 },
    { name: "Fri", compeletedTask: 0, assignedTask: 0 },
    { name: "Sat", compeletedTask: 0, assignedTask: 0 },
    { name: "Sun", compeletedTask: 0, assignedTask: 0 },
  ];

  // Get current date
  const today = new Date();
  
  // Calculate the start of the current week (Monday)
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to make Monday day 0
  startOfWeek.setDate(today.getDate() - diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Filter tasks for the current week
  tasks.forEach((task: any) => {
    // Skip if no date information
    if (!task.createdAt) return;
    
    const taskDate = new Date(task.createdAt);
    
    // Check if the task was created in the current week
    if (taskDate >= startOfWeek && taskDate <= today) {
      // Get day of week (0 for Sunday, 1 for Monday, etc.)
      const taskDayOfWeek = taskDate.getDay();
      // Convert to index (0 for Monday, 6 for Sunday)
      const dayIndex = taskDayOfWeek === 0 ? 6 : taskDayOfWeek - 1;
      
      // Increment assigned tasks count for this day
      weeklyData[dayIndex].assignedTask++;
      
      // If task is completed, increment completed tasks count
      if (task.status === "completed") {
        weeklyData[dayIndex].compeletedTask++;
      }
    }
  });

  console.log(weeklyData)

  return weeklyData;
};