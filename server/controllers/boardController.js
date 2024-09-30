import Board from '../models/Board.js';
import Column from '../models/Column.js';
import Tasks from '../models/Tasks.js';

export const getBoard = async (req, res) => {
  try {
    const board = await Column.find({});
    res.status(200).json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createColumn = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    const { title } = req.body;
    const validTitles = [
        "to assign tickets", 
        "assigned", 
        "stand by", 
        "run", 
        "to validate", 
        "reward", 
        "release"
    ];

    if (!validTitles.includes(title) && !title.startsWith("Column ")) {
      return res.status(400).json({ message: "Invalid column title" });
    }
    const newColumn = new Column({ title });
    await newColumn.save();
    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const updatedColumn = await Column.findByIdAndUpdate(id, { title }, { new: true });
    res.status(200).json(updatedColumn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    await Column.findByIdAndDelete(id);
    res.status(200).json({ message: "Column deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
    try {
        const columns = await Column.find({}).lean();
        const columnsMap = columns.reduce((acc, column) => {
            acc[column._id] = column.title;
            return acc;
        }, {});

        const tasks = await Tasks.find({}).lean();

        const tasksByColumn = {};

        tasks.forEach(task => {
            const columnTitle = columnsMap[task.columnId];

            if (columnTitle) {
                if (!tasksByColumn[columnTitle]) {
                    tasksByColumn[columnTitle] = {
                        columnId: task.columnId,
                        tasks: []
                    };
                }

                tasksByColumn[columnTitle].tasks.push(task);
            } else {
                console.warn(`Task with ID ${task._id} has an invalid column ID: ${task.columnId}`);
            }
        });

        res.status(200).json(tasksByColumn);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: error.message });
    }
};

export const moveTask = async (req, res) => {
    try {
        const { taskId, fromColumnId, toColumnId } = req.body;

        if (!taskId || !fromColumnId || !toColumnId) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const fromColumn = await Column.findByIdAndUpdate(
            fromColumnId,
            { $pull: { tasks: taskId } },
            { new: true }
        );

        if (!fromColumn) {
            return res.status(404).json({ message: "Source column not found." });
        }

        const toColumn = await Column.findByIdAndUpdate(
            toColumnId,
            { $push: { tasks: taskId } },
            { new: true }
        );

        if (!toColumn) {
            return res.status(404).json({ message: "Target column not found." });
        }

        const updatedTask = await Tasks.findByIdAndUpdate(
            taskId,
            { stage: toColumn.title, columnId: toColumnId },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json({
            message: "Task moved successfully.",
            fromColumn,
            toColumn,
            updatedTask
        });
    } catch (error) {
        console.error("Error moving task:", error);
        res.status(500).json({ message: error.message });
    }
};

export const addTaskToColumn = async (req, res) => {
    try {
        const { columnId, title, team = [], priority = 'medium', assets = [], activities = [], subTasks = [] } = req.body;

        if (!columnId || !title) {
            return res.status(400).json({ message: "Column ID and task content are required." });
        }

        const column = await Column.findById(columnId);
        if (!column) {
            return res.status(404).json({ message: "Column not found." });
        }

        const stage = column.stage || 'to assign tickets';

        const task = new Tasks({
            title,
            columnId,
            stage,
            date: new Date(),
            priority,
            activities,
            assets,
            team,
            isTrashed: false,
            subTasks,
        });

        await task.save();

        await Column.findByIdAndUpdate(
            columnId,
            { $push: { tasks: task._id } },
            { new: true }
        );

        const responseData = {
            [stage]: {
                columnId: columnId,
                tasks: [task],
            },
        };

        res.status(201).json(responseData);
    } catch (error) {
        console.error("Error adding task:", error, { columnId, title });
        res.status(500).json({ message: error.message });
    }
};
