// import { StatusBar } from 'expo-status-bar';
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,StatusBar, ScrollView, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { FontAwesome5 } from '@expo/vector-icons';
// import {db} from './firebase-config'
import {collection ,getDocs , addDoc , doc , updateDoc} from '@firebase/firestore'
import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite'
import { Entypo } from '@expo/vector-icons';



export default function App() {


  const taskss=[


    {
      id:1,
      task:"Create a todo app"
    },
    {
      id:1,
      task:"Create a todo app"
    },   
    {
      id:1,
      task:"Create a todo app"
    },
    {
      id:1,
      task:"Create a todo app"
    }
  ]

  const [tasks,setTasks] = useState([])
  const [newTask,setNewTask] = useState("")
  const [toUpdate,setToUpdate] = useState(false)
  const [currentTaskId,setCurrentTaskId] = useState("")
  const [completedTasks,setCompletedTasks] = useState(0)
  const [filteredData,setFilteredData] = useState([])
  // const taskCollection = collection(db,'tasks')


  const db = SQLite.openDatabase('UserDatabase')


  useEffect(()=>{
      // getTaskList()
// deleteAll()
      db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, completed INT)'
        )
      })
      getTaskList()
  },[])

  useEffect(()=>{
    const completed = tasks.filter((task)=>task.completed == 1)
    const unCompleted = tasks.filter((task)=>task.completed != 1).reverse()
    setCompletedTasks(completed.length)
    setFilteredData([...unCompleted,...completed])
    
  },[tasks])

  


  const getTaskList = ()=>{
    db.transaction((tx)=>{
      tx.executeSql('SELECT * FROM tasks',null,
                      (txObj,result)=>{
                        setTasks(result.rows._array);
                        
                      },
                      (txObj,error)=>console.log(error)
                  )  
    })
  }


  const createTask = ()=>{

    
    db.transaction((tx)=>{
      tx.executeSql('INSERT INTO tasks (name,completed) values (?,?)',
            [newTask,Number(-1)])
    })
    setNewTask("")

    getTaskList()
  }

  const completeTask = (id,value)=>{

    db.transaction((tx)=>{
      tx.executeSql(`UPDATE tasks SET completed=? WHERE id= ?`,[Number(value),id])
    })
    getTaskList()


  }



  const handleUpdate = (id,value)=>{
    setToUpdate(true)
    setNewTask(value)
    setCurrentTaskId(id)
    setTasks(tasks.filter((task)=>task.id !== id))
  }

  const updateTask = ()=>{
    db.transaction((tx)=>{
      tx.executeSql(`UPDATE tasks SET name=? where id=?`,[newTask,currentTaskId])
    })

    setToUpdate(false)
    setNewTask("")
    getTaskList()

  }

  const deleteTask = (id) =>{

    db.transaction((tx)=>{
      tx.executeSql('DELETE FROM tasks where id= ?',[id])
    })

    getTaskList()
  }

  const deleteAll = ()=>{
    db.transaction((tx)=>{
      tx.executeSql('DELETE from tasks',null)
    })
    getTaskList()
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>XERO<Text style={styles.innerText}>TODO</Text></Text>
      <View style={styles.progressContainer}>
        <View >
          <Text style={styles.todoText}>Todo Done</Text>
          <Text style={styles.keepText}>Keep it up.</Text>
        </View>
        <View style={styles.fractionContainer}>
          {tasks.length>0 ?
          <Text style={styles.progressText}>{completedTasks}/{tasks.length}</Text>
        :
        <FontAwesome5 name="check" size={32} color="black" />
        }
        </View>
      </View>
      
      <View style={styles.addTaskContainer}>
        <TextInput style={styles.taskInput} 
        placeholder='Add Task...' 
        value={newTask}
        placeholderTextColor='gray'
        onChangeText={setNewTask}
        />
        <TouchableOpacity style={styles.addTaskButton} onPress={toUpdate ?updateTask : createTask}>
          <FontAwesome6 name="add"  size={24} color="black" />
          </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskContainer}>
        {
          filteredData.map((task)=>{
            return <View style={styles.task} key={task.id} >
              <TouchableOpacity style={styles.section1} 
              onPress={()=>completeTask(task.id,-1*task.completed)}>
            <Checkbox style={styles.checkbox} 
            color={'#FF5631'} 
            value={task.completed == 1} />
            <View>
            <Text style={styles.taskText}>{task.name}
            </Text>
            {task.completed ==1 && <View style={styles.line}></View>}
            </View>
            </TouchableOpacity>
            <View style={styles.section2}>
            {task.completed!=1 && <TouchableOpacity onPress={()=>{handleUpdate(task.id,task.name)}}>
            <FontAwesome5 name="edit" size={20} color="gray" />
              </TouchableOpacity>}
            <TouchableOpacity onPress={()=>deleteTask(task.id)}>
            <MaterialCommunityIcons name="delete-outline" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
          })
        }
      
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:StatusBar.currentHeight,
    backgroundColor:'black',
    padding:15,
  },
  header:{
   color:'white',
   fontSize:25,
   fontWeight:'600'
  },
  innerText:{
 color:'#FF5631'
  },
  progressContainer:{
   color:'white',
   borderColor:'gray',
   borderWidth:1,
   borderRadius:10,
   marginTop:20,
   marginBottom:25,
   padding:30,
   display:'flex',
   flexDirection:'row',
   justifyContent:'space-between',
   alignItems:'center'
  },
  todoText:{
  color:"white",
  fontSize:20,
  fontWeight:'500'
  },
  keepText:{
   color:'white',
   fontWeight:'100'
  },
  fractionContainer:{
    backgroundColor:'#FF5631',
    borderRadius:100,
    padding:30,
  },
  progressText:{
   color:'black',
   fontSize:25,
   fontWeight:'800'
  },
  taskContainer:{
  maxHeight:'90%',
  paddingBottom:20,
  },
  checkbox:{
   width:15,
   height:15,
   borderRadius:100,
  },
  task:{
    display:'flex',
    flex:4,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#1E1E1E',
    borderRadius:5,
    marginBottom:20,
    padding:10,
    borderWidth:1,
    borderColor:'gray'
  },
  section1:{
   display:'flex',
   position:'relative',
   flex:3,
   flexDirection:'row',
   gap:10,
   alignItems:'center',
   width:'100%'
  },
  section2:{
    display:'flex',
    flexDirection:'row',
    gap:10,
    alignItems:'center'
   },
  taskText:{
    fontSize:17,
    fontWeight:'400',
    color:'white',
  },
  line:{
   position:'absolute',
   backgroundColor:'red',
   width:'100%',
   top:'50%',
   borderWidth:0.8,
   borderColor:'white'
  },
  addTaskContainer:{
    paddingBottom:20,
    // backgroundColor:'gray',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',

  },
  taskInput:{
    backgroundColor:'#1E1E1E',
    color:'white',
    paddingVertical:10,
    paddingHorizontal:15,
    borderRadius:50,
    fontSize:17,
    width:'85%'
  },
  addTaskButton:{
    backgroundColor:'#FF5631',
    padding:10,
    borderRadius:100,
  },

});
