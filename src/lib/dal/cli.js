"use server";

import { ColumnRepository } from "@/lib/dal/columnRepository";
import { TaskRepository } from "@/lib/dal/taskRepository";
import { UserRepository } from "@/lib/dal/userRepository";
import { NewsRepository } from "@/lib/dal/newsRepository";

const columnRepo = new ColumnRepository();
const taskRepo = new TaskRepository();
const userRepo = new UserRepository();
const newsRepo = new NewsRepository();

export async function runDalCommand(command) {
  const [cmd, ...args] = command.trim().split(/\s+/);

  switch (cmd) {
    case "user:create": {
      const [login, password] = args;
      return await userRepo.createUser({ login, password });
    }
    case "user:list":
      return await userRepo.list();

    case "col:create": {
      const [title] = args;
      return await columnRepo.create({ title });
    }
    case "col:list":
      return await columnRepo.findMany();

    case "task:create": {
      const [colId, ...rest] = args;
      const title = rest.join(" ") || "New Task";
      return await taskRepo.createInColumn({ columnId: colId, title });
    }

    case "news:list":
      return await newsRepo.listTrending({ limit: 5 });

    case "news:search": {
      const q = args.join(" ");
      return await newsRepo.search({ q, page: 1, perPage: 5 });
    }

    case "help":
    default:
      return "Commands: user:create, user:list, col:create, col:list, task:create, news:list, news:search";
  }
}
