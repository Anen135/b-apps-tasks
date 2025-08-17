import "./column.css";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function Column ({ tasks }) {
    return (
        <div className="column">
            <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
                {tasks.map((task) => (
                    <div key={task.id}>{task.title}</div>
                ))}
            </SortableContext>
        </div>
    );
};