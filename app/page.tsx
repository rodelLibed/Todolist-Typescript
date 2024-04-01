"use client"
import React, { useState } from "react";
import Link from "next/link";


type TodoList = {
   id:number
   fname: string,
   lname: string
   isEditing?: boolean
}

type EditData = {
 
   names: TodoList
   onEdit: (data:TodoList) => void
   
}

const data : TodoList[] = [
  { id: 1, fname: "John", lname: "Doe", isEditing: false }
]

export default function Home() {

  const [todoList, setTodoList] = useState(data)
  const [inputValue, setInputValue] = useState({
    fname: "", 
    lname: ""
  })
  const [filter, setFilterValue] = useState("")
  

  let nextId = todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1


    const handleOnChange1 = (e:React.ChangeEvent<HTMLInputElement>) => {
       setInputValue({
         ...inputValue,
         fname: e.target.value
       })
    }
    const handleOnChange2 = (e:React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(
        {
          ...inputValue,
          lname: e.target.value
        }
      )
   }

    const handleAddData = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setTodoList([...todoList, {id: nextId, fname: inputValue.fname, lname: inputValue.lname}])
      setInputValue({...inputValue, fname: "", lname: ""})
    
    }

    const handleDeleteData = (id:number) => {
       setTodoList(todoList.filter((names)=> names.id !== id))
    }

    const handleEditData = (id:number) => {
       setTodoList(todoList.map((names)=> {
         return names.id === id ? {...names, isEditing: !names.isEditing} : names
       }))
    }

    const handleSaveData = (data:TodoList) => {
      setTodoList(todoList.map((todo)=> {
         return todo.id === data.id ? {...todo, ...data, isEditing: false} : todo
      }))
    console.log(todoList); 
    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toLowerCase();
      setFilterValue(value); 
    };
    
   
    const filteredTodoList = todoList.filter((todo) =>
      todo.fname.toLowerCase().includes(filter) || todo.lname.toLowerCase().includes(filter)
    );
    
  

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
       <div className="header h-10 bg-black w-full flex items-center justify-center">
          <Link href="/todo-api" className="text-white">Todo-Api</Link>
       </div>
      
     
    <form onSubmit={handleAddData} className="space-x-5 mt-10">
    <h1 className="text-black text-2xl font-medium text-center">TodoList with Filtering</h1>
       <input onChange={handleOnChange1} value={inputValue.fname} type="text" className="border border-black" />
       <input onChange={handleOnChange2} value={inputValue.lname} type="text" className="border border-black" />
       <button className="text-black font-medium bg-green-500 py-1 px-2 rounded-full">ADD INFO</button>
     </form>

     
      {/* Filter input field */}
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Filter todo list..."
        className="border border-black mt-5"
      />
      
     
      <div className="mt-10">
        {filteredTodoList.map((names)=> {
          return (
            <div key={names.id}> 
            {names.isEditing ? <Edit names={names} onEdit={handleSaveData} /> : <>
              <p >{names.fname} {names.lname}</p>
              <button onClick={()=>handleDeleteData(names.id)} className="text-black font-medium bg-red-500 py-1 px-2 rounded-full">DELETE</button>
              <button onClick={()=>handleEditData(names.id)} className="text-black font-medium bg-green-500 py-1 px-2 rounded-full">EDIT</button></>}
            </div>
          )
        })}
         
       </div>
    
    </main>
  );
}



export const Edit = ({names,  onEdit}:EditData) =>{
  const [currentValue, setCurrentValue] = useState({
    id: names.id,
    fname: names.fname,
    lname: names.lname
  })

  const handleFnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue({ ...currentValue, fname: e.target.value });
  };

  const handleLnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue({ ...currentValue, lname: e.target.value });
  };

    return (
      <>
         <input onChange={handleFnameChange} value={currentValue.fname} type="text" className="border border-black" />
         <input onChange={handleLnameChange}  value={currentValue.lname} type="text" className="border border-black" />
         <button onClick={()=>onEdit(currentValue)}  className="text-black font-medium bg-green-500 py-1 px-2 rounded-full">SAVE</button>
      </>
    
    )
}