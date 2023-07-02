# Easy Task Manager

Easy Task Manager is a responsive task management system designed to improve productivity by organizing and managing tasks. It enables users to set deadlines, prioritize tasks, assign tasks to team members, and track the workload of each team member.

## Technologies Used

- Front-End: VueJS
- Back-End: Node.js and Express.js
- Database: MongoDB with Mongoose
- Styling: Bootstrap, Custom CSS

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of [Node.js and NPM](https://nodejs.org/en/download/)
- You have installed [MongoDB](https://www.mongodb.com/try/download/community)

## Installation

1. Install MongoDB from the [official website](https://www.mongodb.com/try/download/community), and create a database titled `easytaskmanager`.

2. Clone the repository to your local machine. This will create a new directory.

   ```
   git clone https://github.com/owen-m1/DLBCSPJWD01_Project.git
   ```

3. Navigate to the new directory:

   ```
   cd DLBCSPJWD01_Project
   ```

4. Install the project dependencies:

   ```
   npm install
   ```

## Running the Application

1. Start the application:

   ```
   npm start
   ```

   This command starts the server. If successful, you should see a message stating that the server is running and listening on port 3000.

2. Open a web browser and go to `http://localhost:3000`.

Congratulations! You should now see the Easy Task Manager application running in your browser.

## How to Use

Navigate through the application to add, delete, and update tasks. Assign tasks to team members and track each team member's workload. The application should provide a user-friendly experience and enhance productivity.

## Test Cases

**Test Case 1: Adding a team member**

1. Click the 'Add Team Member' button located in the 'Team Members' panel.
2. Fill in the team member details as follows:
   - Name: 'John Doe'
   - Email: 'JohnDoe@hotmail.com'
   - Role: 'Developer'
3. Click 'Add Team Member' to save the team member.

**Expected Result:** A new team member with the entered details should be added to the 'Team Members' panel. The Team Members count should be changed to '1'.

**Test Case 2: Adding a new task**

1. Click the 'Add Task' button located in the 'Tasks' panel.
2. Fill in the task details as follows:
   - Task Name: 'Meeting with the team'
   - Task Description: 'Discuss the project timeline and deliverables'
   - Due Date: Set a date for two days from now
   - Priority: Set to 'High'
   - Assigned to: Select 'John Doe'
3. Click 'Add Task' to save the task.

**Expected Result:** A new task with the entered details should be added to the 'Tasks' panel, and the 'Assigned Tasks' count for 'John Doe' should change to '1'. The 'Remove' button on the 'John Doe' card should be disabled. The Tasks count should be changed to '1'.

**Test Case 3: Editing a task**

1. Click the 'Edit' button on the task 'Meeting with the team'.
2. Change the task name to 'Project discussion with the team'.
3. Click 'Save Task'.

**Expected Result:** The task name should update in the 'Tasks' panel and in the 'Assigned Tasks' list of 'John Doe'.

**Test Case 4: Refreshing the page**

1. Refresh the page.

**Expected Result:** The page should refresh and all the data should persist.

**Test Case 5: Deleting a task**

1. Click the 'Delete' button on the task 'Project discussion with the team'.

**Expected Result:** The task should be removed from the 'Tasks' panel the 'Assigned Tasks' count of 'John Doe' should be changed back to '0'. The 'Remove' button on the 'John Doe' card should be enabled. The Tasks count should be changed to '0'.

**Test Case 6: Removing a team member**

1. Make sure 'John Doe' has no tasks assigned to him. If he does, delete the tasks by pressing the 'Delete' button on the task card.
2. Click the 'Remove' button on the team member 'John Doe'.

**Expected Result:** The team member 'John Doe' should be removed from the 'Team Members' panel. The Team Members count should be changed to '0'.
