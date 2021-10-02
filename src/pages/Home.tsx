import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Header } from '../components/Header';
import { Task, TasksList } from '../components/TasksList';
import { TodoInput } from '../components/TodoInput';

export type EditTasksArgs = {
  id: number;
  taskNewTitle: string;
}

export function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  function handleAddTask(newTaskTitle: string) {
    const taskWithSameTitle = tasks.find(task => task.title.toLocaleLowerCase() === newTaskTitle.toLocaleLowerCase());

    if (taskWithSameTitle) {
      return Alert.alert('Task já cadastrada.', 'Você não pode cadastrar uma task com o mesmo nome.')
    }

    const newTask = {
      id: new Date().getTime(),
      title: newTaskTitle,
      done: false
    }
    setTasks(oldTasks => [...oldTasks, newTask])
  }

  function handleValidation(id: number, taskNewTitle: string, action: string) {
    const updateTasks = tasks.map(task => ({ ...task }));

    const foundItem = updateTasks.find(item => item.id === id);

    if (!foundItem)
      return;

    if (action == 'done')
      foundItem.done = !foundItem.done;

    if (action == 'edit') {
      foundItem.title = taskNewTitle;
    }
    setTasks(updateTasks);
  }

  function handleToggleTaskDone(id: number) {
    handleValidation(id, '', 'done');
  }

  function handleRemoveTask(id: number) {
    Alert.alert('Remover item', 'Tem certeza que você deseja remover esse item?', [
      {
        style: 'cancel',
        text: 'Não'
      },
      {
        style: 'destructive',
        text: 'Sim',
        onPress: () => {
          const updateTasks = tasks.filter(task => task.id !== id);
          setTasks(updateTasks);
        }
      }
    ])
  }

  function handleEditTask({ id, taskNewTitle }: EditTasksArgs) {
      handleValidation(id, taskNewTitle, 'edit');
  }

  return (
    <View style={styles.container}>
      <Header tasksCounter={tasks.length} />

      <TodoInput addTask={handleAddTask} />

      <TasksList
        tasks={tasks}
        toggleTaskDone={handleToggleTaskDone}
        removeTask={handleRemoveTask}
        editTask={handleEditTask}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBEB'
  }
})