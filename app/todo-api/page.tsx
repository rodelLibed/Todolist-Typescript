"use client"
import axios, { Axios, AxiosResponse } from "axios"
import Link from "next/link"
import { useState, useEffect } from "react"

type Todo = {
  id: number
  title: string
  views: number
}


const TodoApi = () => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [inputValue, setInputValue] = useState("")
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editedTitle, setEditedTitle] = useState("")

    useEffect(()=> {
       const fetchData = async () => {
         await axios.get('http://localhost:8000/posts')
         .then((response: AxiosResponse<Todo[]>)=>{
           setTodos(response.data)
         })
       }
       fetchData()
    }, [])

    let generateId = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1


    
   const handlePostData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
     try {
       let response = await axios.post("http://localhost:8000/posts", { id: generateId, title: inputValue })
       setTodos([...todos, response.data])
       setInputValue("")
     } catch(error){
       console.log(error)
     }
  }

  const handleDeleteData = async (id:number) => {
   
    try {
      await axios.delete(`http://localhost:8000/posts/${id}`)
      setTodos(todos.filter((data)=> data.id !== id))
    }catch(error){
       console.log(error)
    }
   
  }

  const handleEditData = (id:number) => {
     setEditingId(id)
     const todoEdit = todos.find((todo)=> todo.id === id)
     if(todoEdit){
       setEditedTitle(todoEdit.title)
     }
  }

  const handleSaveEdit = async () => {
      try {
         await axios.put(`http://localhost:8000/posts/${editingId}`, {id: generateId, title : editedTitle})
         setTodos(todos.map((todo)=>{
          return todo.id === editingId ? {...todo, title: editedTitle} : todo
        }))
         setEditingId(null)
      }catch(error){
        console.log(error)
      }
  }

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
     setInputValue(e.target.value)
    
  }

  const handleEditChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value)
   
 }

 
  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="header h-10 bg-black w-full flex items-center justify-center">
          <Link href="/" className="text-white">Back</Link>
       </div>
      <form onSubmit={handlePostData}  className="space-x-5 mt-10">
       <h1 className="text-black text-2xl font-medium text-center">TodoList with Filtering</h1>
       <input onChange={handleChange} value={inputValue} type="text" className="border border-black" />
       <button type="submit" disabled={inputValue.length === 0} className="text-black font-medium bg-green-500 py-1 px-2 rounded-full">ADD INFO</button>
     </form>

     <div className="mt-10">
         <ul className="flex flex-col gap-2">
            {todos.map((data)=> {
                return (
                  <div className="flex gap-2">
                    {editingId === data.id ?
                        (<>
                        <input
                          onChange={handleEditChange}
                          value={editedTitle}
                          type="text"
                          className="border border-black"
                        />
                        <button
                         onClick={handleSaveEdit}
                          className="text-black font-medium bg-green-500 py-[1px] px-2 rounded-full"
                        >
                          SAVE
                        </button>
                      </>) :
                      (<>
                       <li key={data.id}>{data.title}</li>
                      <button onClick={()=>handleDeleteData(data.id)} className="text-black font-medium bg-red-500 py-[1px] px-2 rounded-full">DELETE</button>
                      <button onClick={()=>handleEditData(data.id)} className="text-black font-medium bg-green-500 py-[1px] px-2 rounded-full">EDIT</button>
                      </>)
                    }
                     
                      
                   
                  </div>
                )
            })}
         </ul>
     </div>

    </div>
  )
}

export default TodoApi 


