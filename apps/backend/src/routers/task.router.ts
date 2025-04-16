import { prismaClient } from "db/client";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .json({ data: null, message: null, error: "User not found" })
      .status(401);
  }

  console.log('get task userId', userId)

  try {
    const tasks = await prismaClient.task.findMany({
      where: {
        userId: userId as string
      },
    });

    console.log('get task tasks', tasks)

    return res
      .status(200)
      .json({
        data: tasks,
        message: "Task reterived",
        error: null,
      })
  } catch (error: any) {
    console.log('get task error', error)
    return res.status(500).json({ error: error?.message || "some error occured" })
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .json({ data: null, message: null, error: "Task not found" })
      .status(401);
  }

  try {
    const task = await prismaClient.task.findUnique({
      where: {
        id: id,
      },
    });

    return res
      .json({
        data: task,
        message: "Task reterived",
        error: null,
      })
      .status(200);
  } catch (error: any) {
    return res
      .json({ error: error?.message || "some error occured" })
      .status(500);
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  if (!id) {
    return res
      .json({ data: null, message: null, error: "Task not found" })
      .status(401);
  }

  try {
    const updatedTask = await prismaClient.task.update({
      where: {
        id: id,
      },
      data: task,
    });

    return res
      .json({
        data: updatedTask,
        message: "Task Updated",
        error: null,
      })
      .status(200);
  } catch (error: any) {
    return res
      .json({ error: error?.message || "some error occured" })
      .status(500);
  }
});

router.post("/generate", async (req, res) => {

});

router.post("/assign", async (req, res) => {
  const { task, userId } = req.body;
  const {
    title,
    description,
    difficulty_level,
    outcomes,
    status,
    prerequisites
  } = task;

  try {
    const assignedTask = await prismaClient.task.create({
      data: {
        userId,
        title,
        description,
        difficulty_level,
        outcomes,
        status,
        prerequisites,
        assignedBy: userId
      }
    });

    if (assignedTask.id) {
      return res
        .json({
          data: assignedTask,
          message: "Task Submitted",
          error: null,
        })
        .status(200);
    }
  } catch (error: any) {
    console.log(error);
    return res
      .json({ error: error?.message || "some error occured" })
      .status(error.status || 500);
  }
});


router.post("/submit", async (req, res) => {
    const { userId, taskId, githubLink, sourceLinks } = req.body;

    if (!userId && !taskId && !githubLink && !sourceLinks){
      return res.json({
        message: 'All fields are required',
        error: 'All fields are required',
        data: null
      })
    }

    try {
      const task = await prismaClient.task.findFirst({
        where: {
          userId,
          id: taskId
        },
        select: {
          approved: true,
          reassigned: true
        }
      })

      if (!task) {
        return res.json({ message: "Task does not exists. First create the task", error: "task not exists", data: null}).status(401)
      }

      if (!task?.approved){
        return res.json({ message: "Task cannot be submitted before approval", data: null, error: "Task cannot be submit before approval."}).status(401)
      }

      const submitTask = await prismaClient.submission.create({
        data: {
          github: githubLink,
          taskId,
          userId,
          source_link: sourceLinks
        }
      })

      const taskSubmitted = await prismaClient.task.update({
        where: {
          userId,
          id: taskId
        },
        data: {
          status: 'submitted',
        }
      })

      if (!submitTask && !taskSubmitted){
        return res.json({
          error: "Not able to submit task",
          message: 'Not able to submit task',
          data: null
        }).status(409)
      }
  
      if (submitTask.id && taskSubmitted.status === 'submitted'){
        console.log(submitTask)
        return res.json({
          data: submitTask,
          message: "Task submited successfully",
          error: null
        }).status(200)
      }
    } catch (error) {
      console.log(error)
      return res.json( { error: "Server issue", data: null, message: "Server side issue"}).status(500)
    }
})
export default router;
