// Define your API helper methods for calling the back-end

const api = {
  getTasks: async () => {
    const response = await axios.get("/api/tasks");
    return response.data;
  },

  createTask: async (task) => {
    const response = await axios.post("/api/tasks", task);
    return response.data;
  },

  updateTask: async (task) => {
    const response = await axios.put(`/api/tasks/${task._id}`, task);
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await axios.delete(`/api/tasks/${taskId}`);
    return response.data;
  },

  getTeamMembers: async () => {
    const response = await axios.get("/api/teamMembers");
    return response.data;
  },

  deleteTeamMember: async (teamMemberId) => {
    const response = await axios.delete(`/api/teamMembers/${teamMemberId}`);
    return response.data;
  },

  // Continue defining API methods for team members and other resources
};

// Now, use these API methods in your Vue components and methods

// Define your Vue.js components and the main Vue instance

const Task = {
  template: `
    <div class="card mb-3">
      <div class="card-body">
        <div v-if="!editing">
          <h5 class="card-title">{{ task.title }}</h5>
          <p class="card-text">Description: {{ task.description }}</p>
          <p class="card-text">Priority: {{ task.priority | capitalize }}</p>
          <p class="card-text" :class="{ 'text-danger': daysInFuture(task.dueDate) < 0 }">Days Left: {{ task.dueDate | daysInFuture }}</p>
          <p class="card-text">Assigned To: {{ task.assignedTo.name }}</p>
          <button @click="startEditing" class="btn btn-primary mr-2">Edit</button>
          <button @click="$emit('delete-task', task._id, task.assignedTo._id)" class="btn btn-danger">Delete</button>
        </div>
        <div v-else>
          <input v-model="editedTask.title" class="form-control mb-2" placeholder="Title">
          <textarea v-model="editedTask.description" class="form-control mb-2" placeholder="Description"></textarea>
          <select v-model="editedTask.priority" class="form-control mb-2">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input v-model="editedTaskDueDate" type="date" class="form-control mb-2">
          <select v-model="editedTask.assignedTo._id" class="form-control mb-2">
            <option v-for="member in teamMembers" :value="member._id" :key="member._id">{{ member.name }}</option>
          </select>
          <button @click="saveEdits" class="btn btn-primary mr-2">Save</button>
          <button @click="cancelEditing" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  `,
  props: ["task", "teamMembers"],
  data() {
    return {
      editing: false,
      editedTask: {},
    };
  },
  computed: {
    editedTaskDueDate: {
      get() {
        if (!this.editedTask.dueDate) return null;

        const date = new Date(this.editedTask.dueDate);
        const year = date.getFullYear();
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
      },
      set(value) {
        this.editedTask.dueDate = new Date(value);
      },
    },
  },
  methods: {
    startEditing() {
      console.log({ ...this.task.assignedTo });
      this.editing = true;
      this.editedTask = { ...this.task };
      console.log(this.editedTask.dueDate);
      this.editedTask.assignedTo = { ...this.task.assignedTo };
    },
    async saveEdits() {
      const updatedTask = await api.updateTask({
        ...this.editedTask,
        assignedTo: this.editedTask.assignedTo._id,
      });
      this.$emit("update-task", updatedTask, this.task.assignedTo._id);
      this.editing = false;
    },
    cancelEditing() {
      this.editing = false;
    },
    daysInFuture,
  },
};

const TeamMember = {
  template: `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">{{ teamMember.name }}</h5>
        <p class="card-text">Email: {{ teamMember.email }}</p>
        <p class="card-text">Role: {{ teamMember.role }}</p>
        <p class="card-text">Assigned Tasks: {{ teamMember.assignedTasks.length }}</p>
        <span class="d-inline-block" tabindex="0" data-toggle="tooltip" data-placement="top" :title="teamMember.assignedTasks.length > 0 ? 'This team member has tasks assigned to them' : ''">
          <button @click="$emit('delete-team-member', teamMember._id)" :disabled="teamMember.assignedTasks.length > 0" class="btn btn-danger"
        >Remove</button>
        </span>
      </div>
    </div>
  `,
  props: ["teamMember"],
  mounted() {
    let tooltipTriggerEl = this.$el.querySelector('[data-toggle="tooltip"]');
    new bootstrap.Tooltip(tooltipTriggerEl);
  },
};

const Dashboard = {
  template: `
    <div>
      <h2 class="mt-4 mb-4">Dashboard</h2>
      <div class="row">
        <div class="col-md-6">
          <h3>Tasks ({{tasks.length}})</h3>
          <button @click="showAddTaskModal" class="btn btn-primary mb-3">Add Task</button>
          <task
            v-for="task in tasks"
            :key="task._id"
            :task="task"
            :teamMembers="teamMembers"
            @update-task="updateTask"
            @delete-task="deleteTask"
          ></task>
        </div>
        <div class="col-md-6">
          <h3>Team Members ({{teamMembers.length}})</h3>
          <button @click="showAddTeamMemberModal" class="btn btn-primary mb-3">Add Team Member</button>
          <team-member
            v-for="teamMember in teamMembers"
            :key="teamMember._id"
            :teamMember="teamMember"
            @delete-team-member="deleteTeamMember"
          ></team-member>
        </div>
      </div>

      <!-- Add Task Modal -->
      <div class="modal" tabindex="-1" :class="{ 'd-block': addTaskModalVisible }">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Task</h5>
              <button @click="hideAddTaskModal" type="button" class="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addTask">
                <!-- Form content for adding tasks -->
<div class="form-group">
  <label for="taskTitle">Title</label>
  <input v-model="newTask.title" type="text" class="form-control" id="taskTitle" placeholder="Enter task title" required>
</div>
<div class="form-group">
  <label for="taskDescription">Description</label>
  <textarea v-model="newTask.description" class="form-control" id="taskDescription" rows="3" placeholder="Enter task description" required></textarea>
</div>
<div class="form-group">
  <label for="taskPriority">Priority</label>
  <select v-model="newTask.priority" class="form-control" id="taskPriority" required>
    <option value="">Select priority</option>
    <option value="low">Low</option>
    <option value="medium">Medium</option>
    <option value="high">High</option>
  </select>
</div>
<div class="form-group">
  <label for="taskDueDate">Due Date</label>
  <input v-model="newTask.dueDate" type="date" class="form-control" id="taskDueDate" required>
</div>
<div class="form-group">
  <label for="taskAssignedTo">Assigned To</label>
  <select v-model="newTask.assignedTo" class="form-control" id="taskAssignedTo" placeholder="Select team member" required>
    <option v-for="member in teamMembers" :value="member._id" :key="member._id">{{ member.name }}</option>
    </select>
    
    </div>
    <button type="submit" class="btn btn-primary">Add Task</button>

              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Team Member Modal -->
      <div class="modal" tabindex="-1" :class="{ 'd-block': addTeamMemberModalVisible }">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add Team Member</h5>
              <button @click="hideAddTeamMemberModal" type="button" class="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addTeamMember">
              <!-- Form content for adding team members -->
              <div class="form-group">
                <label for="teamMemberName">Name</label>
                <input v-model="newTeamMember.name" type="text" class="form-control" id="teamMemberName" placeholder="Enter team member name" required>
              </div>
              <div class="form-group">
                <label for="teamMemberEmail">Email</label>
                <input v-model="newTeamMember.email" type="email" class="form-control" id="teamMemberEmail" placeholder="Enter team member email" required>
              </div>
              <div class="form-group">
                <label for="teamMemberRole">Role</label>
                <input v-model="newTeamMember.role" type="text" class="form-control" id="teamMemberRole" placeholder="Enter team member role" required>
              </div>
              <button type="submit" class="btn btn-primary">Add Team Member</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  components: {
    Task,
    TeamMember,
  },
  data() {
    return {
      tasks: [],
      teamMembers: [],
      addTaskModalVisible: false,
      addTeamMemberModalVisible: false,
      newTask: {
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        assignedTo: "",
      },
      newTeamMember: {
        name: "",
        email: "",
        role: "",
      },
    };
  },
  async created() {
    this.tasks = await api.getTasks();
    this.teamMembers = await api.getTeamMembers();
  },
  methods: {
    showAddTaskModal() {
      this.addTaskModalVisible = true;
    },
    hideAddTaskModal() {
      this.addTaskModalVisible = false;
    },
    async addTask() {
      const task = await api.createTask(this.newTask);
      this.tasks.push(task);
      const teamMember = this.teamMembers.find(
        (member) => member._id === this.newTask.assignedTo
      );
      if (teamMember) {
        teamMember.assignedTasks.push(task);
      }

      this.newTask = {
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        assignedTo: "",
      };
      this.hideAddTaskModal();
    },
    showAddTeamMemberModal() {
      this.addTeamMemberModalVisible = true;
    },
    hideAddTeamMemberModal() {
      this.addTeamMemberModalVisible = false;
    },
    async addTeamMember() {
      const teamMember = await axios.post(
        "/api/teamMembers",
        this.newTeamMember
      );
      this.teamMembers.push(teamMember.data);
      this.newTeamMember = {
        name: "",
        email: "",
        role: "",
      };
      this.hideAddTeamMemberModal();
    },
    async updateTask(updatedTask, oldAssignedTo) {
      const index = this.tasks.findIndex(
        (task) => task._id === updatedTask._id
      );
      this.tasks.splice(index, 1, updatedTask);
      // Update the assignedTasks field of the team members if the assignee has changed
      if (oldAssignedTo !== updatedTask.assignedTo._id) {
        const oldTeamMember = this.teamMembers.find(
          (member) => member._id === oldAssignedTo
        );
        const newTeamMember = this.teamMembers.find(
          (member) => member._id === updatedTask.assignedTo._id
        );

        if (oldTeamMember) {
          oldTeamMember.assignedTasks = oldTeamMember.assignedTasks.filter(
            (task) => task._id !== updatedTask._id
          );
        }
        if (newTeamMember) {
          newTeamMember.assignedTasks.push(updatedTask);
        }
        this.$forceUpdate();
      }
    },
    async deleteTask(taskId, assignedTo) {
      await api.deleteTask(taskId);

      // Update the team member's assignedTasks
      const teamMember = this.teamMembers.find(
        (member) => member._id === assignedTo
      );
      teamMember.assignedTasks = teamMember.assignedTasks.filter(
        (task) => task._id !== taskId
      );

      // Remove the task from the tasks array
      this.tasks = this.tasks.filter((task) => task._id !== taskId);
    },

    async deleteTeamMember(teamMemberId) {
      this.teamMembers = this.teamMembers.filter(
        (teamMember) => teamMember._id !== teamMemberId
      );
      api.deleteTeamMember(teamMemberId);
    },
  },
};

// Define filters
function daysInFuture(dateString) {
  const currentDate = new Date();
  const inputDate = new Date(dateString);
  const timeDiff = inputDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}
Vue.filter("daysInFuture", daysInFuture);

Vue.filter("capitalize", function (value) {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

const app = new Vue({
  el: "#app",
  components: {
    Task,
    TeamMember,
    Dashboard,
  },
});
