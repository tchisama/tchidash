import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { db } from '@/firebase'
import { Order } from '@/types/order'
import { doc, updateDoc } from 'firebase/firestore'
import { CircleSlash, Edit2, Save } from 'lucide-react'
import React, { useEffect } from 'react'

type Props = {
  order:Order
}

function NoteViewer({order}: Props) {
  const [note, setNote] = React.useState<Order["note"] | null>(null)
  const [edit,setEdit] = React.useState(false)
  useEffect(() => {
    setNote(order.note??{
      content:"",
      creator:"",
      creatorId:""
    })
  },[order])
  const onSave = () => {
    updateDoc(doc(db, "orders", order.id),{
      note
    })
    setEdit(false)
  }
  return (
    <div >
      {
        edit ?
      <Textarea 
        onClick={e=>e.stopPropagation()}
        readOnly={!edit}
        value={note?.content}
        className='min-h-[200px] bg-slate-50'
        onChange={
          (e) => {
            if(!note) return
            setNote(p=>({
              ...p,
              content: e.target.value
            } as Order["note"]))
        }
        }
      />
      :
      <p className='text-sm bg-slate-50 border rounded-xl flex items-center p-2'>{note?.content || <><CircleSlash className='h-4 w-4 mr-2' /> No Note</>}</p>
      }
      {
        edit ?
        <div className='mt-2 flex gap-2'>

      <Button
      className=' ml-auto'
      size={"sm"}
        onClick={
          e=>{
            onSave()
            e.stopPropagation()
          }
        }
      >
        <Save className='h-4 w-4 mr-2' /> Save</Button>
        <Button
        className=' '
        size={"sm"}
        variant={"outline"}
        onClick={
          e=>{
            e.stopPropagation()
            setEdit(false)
          }
        }
      >
        Cancel</Button>
        </div>
        :
        <Button
        onClick={e=>{
          e.stopPropagation()
          setEdit(true)
          }
          }
        className='mt-2 ml-auto'
        size={"sm"}
        variant={"outline"}
        >
          <Edit2 className='h-4 w-4 mr-2' /> Edit</Button>
      }
    </div>
  )
}

export default NoteViewer