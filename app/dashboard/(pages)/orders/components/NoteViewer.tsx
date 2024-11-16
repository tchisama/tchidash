import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { db } from '@/firebase'
import { Order } from '@/types/order'
import { doc, updateDoc } from 'firebase/firestore'
import { Edit2, Save } from 'lucide-react'
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
        className='min-h-[200px] '
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
      <p className='text-sm'>{note?.content || "no note here"}</p>
      }
      {
        edit ?
      <Button
      className='mt-2'
      size={"sm"}
        onClick={
          e=>{
            onSave()
            e.stopPropagation()
          }
        }
      >
        <Save className='h-4 w-4 mr-2' /> Save</Button>
        :
        <Button
        onClick={e=>{
          e.stopPropagation()
          setEdit(true)
          }
          }
        className='mt-2'
        size={"sm"}
        variant={"outline"}
        >
          <Edit2 className='h-4 w-4 mr-2' /> Edit</Button>
      }
    </div>
  )
}

export default NoteViewer