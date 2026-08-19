import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../Api/client";
import { DragDropContext } from "@hello-pangea/dnd";

import List from "../components/List";
import CreateListModal from "../components/CreateListModal";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskDetailsModal from "../components/TaskDetailsModal";
import EditBoardModal from "../components/EditBoardModal";
import { BoardProvider } from "./BoardContext";

export default function Board() {
  const { id } = useParams();
  const nav = useNavigate();

  const [lists, setLists] = useState([]);

  const [listTitle, setListTitle] = useState("");
  const [showListModal, setShowListModal] = useState(false);

  const [TitleToEdit, setTitleToEdit] = useState("");
  const [showRenameListModal, setShowRenameListModal] = useState(false);
  const [renameListId, setRenameListId] = useState(null);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [activeListId, setActiveListId] = useState(null);

  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [showSubtasksModal, setShowSubtasksModal] = useState(false);

  useEffect(() => {
    async function loadBoard() {
      const listsFromServer = await api(`/lists/${id}`);

      const listsWithTasks = await Promise.all(
        listsFromServer.map(async (list) => {
          const tasks = await api(`/tasks/${list.id}`);
          return { ...list, tasks };
        })
      );

      setLists(listsWithTasks);
    }

    loadBoard();
  }, [id]);

  async function handleCreateList() {
    const position = lists.length;
    const newList = await api(`/lists/${id}`, {
      method: "POST",
      body: JSON.stringify({ title: listTitle, position })
    });

    setLists([...lists, newList]);
    setShowListModal(false);
    setListTitle("");
  }

  function openTaskModal(listId) {
    setActiveListId(listId);
    setShowTaskModal(true);
  }

  async function handleCreateTask() {
    const newTask = await api(`/tasks/${activeListId}`, {
      method: "POST",
      body: JSON.stringify({ title: taskTitle })
    });

    const updatedLists = lists.map((list) =>
      list.id === activeListId
        ? { ...list, tasks: [...(list.tasks || []), newTask] }
        : list
    );

    setLists(updatedLists);
    setShowTaskModal(false);
    setTaskTitle("");
  }

  async function handleToggleCompleted(task, value) {
    const updated = await api(`/tasks/${task.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        priority: task.priority,
        due_date: task.due_date,
        completed: value,
        list_id: task.list_id
      })
    });

    const newLists = lists.map((list) => ({
      ...list,
      tasks: list.tasks.map((t) => (t.id === updated.id ? updated : t))
    }));

    setLists(newLists);
  }

  async function handleDeleteList(listId) {
    if (!window.confirm("Delete this list")) return;

    await api(`/lists/${listId}`, { method: "DELETE" });

    const updated = lists.filter((list) => list.id !== listId);
    setLists(updated);
    console.log("list to delete", listId);
  }

  async function handleRenameList() {
    const updatedList = await api(`/lists/${renameListId}`, {
      method: "PATCH",
      body: JSON.stringify({ title: TitleToEdit })
    });

    const updatedLists = lists.map((list) =>
      list.id === renameListId ? { ...list, ...updatedList } : list
    );

    setLists(updatedLists);
    setShowRenameListModal(false);
    setTitleToEdit("");
  }

  async function handleDeleteTask(taskId, listId) {
    await api(`/tasks/${taskId}`, {
      method: "DELETE"
    });

    const updatedLists = lists.map((list) =>
      list.id === listId
        ? { ...list, tasks: list.tasks.filter((task) => task.id !== taskId) }
        : list
    );

    setLists(updatedLists);
  }

  async function handleUpdateTask() {
    const updated = await api(`/tasks/${selectedTask.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority,
        due_date: selectedTask.due_date,
        completed: selectedTask.completed
      })
    });

    const newLists = lists.map((list) => {
      if (list.id !== selectedTask.list_id) return list;

      return {
        ...list,
        tasks: list.tasks.map((t) => (t.id === updated.id ? updated : t))
      };
    });

    setLists(newLists);
    setShowTaskDetailsModal(false);
    setSelectedTask(null);
  }

  function handleDragEnd(result) {
    const { source, destination } = result;

    if (!destination) return;

    const sourceListId = parseInt(source.droppableId);
    const destListId = parseInt(destination.droppableId);

    const sourceList = lists.find((list) => list.id === sourceListId);
    const destList = lists.find((list) => list.id === destListId);

    const sourceTasks = Array.from(sourceList.tasks || []);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceListId === destListId) {
      sourceTasks.splice(destination.index, 0, movedTask);

      const reindexed = sourceTasks.map((task, index) => ({
        ...task,
        position: index
      }));

      const updatedLists = lists.map((list) =>
        list.id === sourceListId ? { ...list, tasks: reindexed } : list
      );

      setLists(updatedLists);
    } else {
      const destTasks = Array.from(destList.tasks || []);
      destTasks.splice(destination.index, 0, movedTask);

      const reindexedSource = sourceTasks.map((task, index) => ({
        ...task,
        position: index
      }));

      const reindexedDest = destTasks.map((task, index) => ({
        ...task,
        position: index
      }));

      const updatedLists = lists.map((list) => {
        if (list.id === sourceListId)
          return { ...list, tasks: reindexedSource };
        if (list.id === destListId)
          return { ...list, tasks: reindexedDest };
        return list;
      });

      setLists(updatedLists);
    }
  }

  return (
    <BoardProvider
      value={{
        setSelectedTask,
        setShowTaskDetailsModal,
        handleToggleCompleted,
        handleDeleteTask
      }}
    >
      <div className="board-page" style={{ padding: "20px" }}>
        <button
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #2a2a2a, #3d3d3d)",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "20px",
            color: "white",
            fontWeight: "500"
          }}
          onClick={() => nav("/boards")}
        >
          Back to boards
        </button>

        <h1>Board #{id}</h1>

        <button
          onClick={() => setShowListModal(true)}
          style={{
            padding: "10px 20px",
            background: "#2196f3",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          + New List
        </button>

        {showListModal && (
          <CreateListModal
            listTitle={listTitle}
            setListTitle={setListTitle}
            onCreate={handleCreateList}
            onClose={() => {
              setShowListModal(false);
              setListTitle("");
            }}
          />
        )}

        {showTaskModal && (
          <CreateTaskModal
            taskTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            onCreate={handleCreateTask}
            onClose={() => {
              setShowTaskModal(false);
              setTaskTitle("");
            }}
          />
        )}

        {showTaskDetailsModal && selectedTask && (
          <TaskDetailsModal
            task={selectedTask}
            setTask={setSelectedTask}
            onSave={handleUpdateTask}
            onClose={() => {
              setShowTaskDetailsModal(false);
              setSelectedTask(null);
            }}
            showSubtasksModal={showSubtasksModal}
            setShowSubtasksModal={setShowSubtasksModal}
          />
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            {lists.map((list) => (
              <List
                key={list.id}
                list={list}
                onRename={(id) => {
                  setRenameListId(id);
                  setShowRenameListModal(true);
                }}
                onDelete={handleDeleteList}
                onAddTask={openTaskModal}
                showRenameListModal={showRenameListModal}
                renameListId={renameListId}   
                TitleToEdit={TitleToEdit}
                setTitleToEdit={setTitleToEdit}
                handleRenameList={handleRenameList}
              />
            ))}
          </div>
        </DragDropContext>
      </div>
    </BoardProvider>
  );
}
