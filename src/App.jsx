import React, {useEffect, useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
//import './mystyle.css'
const API = 'http://72.60.101.202:8080/api/items'

export default function App(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({name:'', details:''})
  const [imagePreview, setImagePreview] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [editingId, setEditingId] = useState(null)

  useEffect(()=>{ fetchItems() },[])

  function fetchItems(){
    fetch(API).then(r=>r.json()).then(setItems)
  }

  function onImage(e){
    const f = e.target.files[0]
    setImageFile(f)
    setImagePreview(f ? URL.createObjectURL(f) : null)
  }
  function onVideo(e){
    const f = e.target.files[0]
    setVideoFile(f)
    setVideoPreview(f ? URL.createObjectURL(f) : null)
  }

  async function submit(e){
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('details', form.details)
    if (imageFile) fd.append('image', imageFile)
    if (videoFile) fd.append('video', videoFile)

    let url = API
    let method = 'POST'
    if (editingId){ url = API + '/' + editingId; method = 'PUT' }

    const res = await fetch(url, { method, body: fd })
    if (res.ok){
      setForm({name:'', details:''})
      setImageFile(null); setVideoFile(null); setImagePreview(null); setVideoPreview(null)
      setEditingId(null)
      fetchItems()
    } else {
      alert('Upload failed')
    }
  }

  async function remove(id){
    if (!confirm('Delete?')) return
    await fetch(API+'/'+id, { method: 'DELETE' })
    fetchItems()
  }

  function edit(item){
    setEditingId(item.id)
    setForm({name:item.name, details:item.details || ''})
    setImagePreview(item.imagePath ? `http://72.60.101.202:8080/api/items/${item.imagePath}` : null)
    setVideoPreview(item.videoPath ? `http://72.60.101.202:8080/api/items/${item.videoPath}` : null)
  }

  return (
  <div class="container-fluid m-0 p-0">

  <div class="container-fluid m-0 p-0">

    <nav class="navbar navbar-expand-lg navbar-dark purple d-flex justify-content-center align-items-center">
  <div class="container-fluid purple">
    <a class="navbar-brand" href="http://localhost:5173">joyjagatbondu</a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-center" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active outline-success" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/add">add</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>

        </li>
        <li class="nav-item">
          <a class="nav-link disabled">Disabled</a>
        </li>
        
        
      </ul>

    </div>
  </div>
</nav>

  </div>

    <form class="pic" onSubmit={submit} > 
      <div class="form-group " >
        <label>Title : </label>
        <input  class="form-control re"  placeholder="Please Enter Your Title" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        
        </div>


      <div class="form-group">
                <label>Details :</label>

        <textarea  class="form-control"  placeholder="Please Enter Your Details" value={form.details} onChange={e=>setForm({...form, details:e.target.value})}></textarea>
        </div>
      
      
      <div class="form-group">
        <label>Image: <input  type="file" accept="image/*" onChange={onImage} /></label>
        {imagePreview && <div class="form-group"><img src={imagePreview} alt="preview" style={{maxWidth:'30%', marginTop:8}}/>
        </div>}
      </div>

      <div class="form-group">
        <label>Video: <input type="file" accept="video/*" onChange={onVideo} /></label>
        {videoPreview && <div><video controls style={{maxWidth:'30%'}} src={videoPreview}></video></div>}
      </div>
      <div style={{marginTop:8}}>
        <button type="submit">{editingId ? 'Update' : 'Upload'}</button>
        {editingId && <button class="btn btn-primary" type="button" onClick={()=>{ setEditingId(null); setForm({name:'',details:''}); setImagePreview(null); setVideoPreview(null)} }>Cancel</button>}
      </div>
    </form>

    <div class="card mt-3 mb-3 flex-column-reverse">

      {items.map(it=>(
        <div  key={it.id} class="card mt-3 mb-3 ">
          <h3 class="card-title">{it.name}</h3>
          <p class="card-text mb-3">{it.details}</p>
          <img class="container text-center mt-2" src={`http://72.60.101.202:8080/api/items/files/${it.imagePath}`} alt="" style={{ maxWidth:'30%'}} />
      
          <div class="container text-center mt-2">
            <video controls controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} style={{maxWidth:'30%'}} src={`http://72.60.101.202:8080/api/items/files/${it.videoPath}`}></video></div>
         
          <div class="container text-center">
            <button class="btn btn-primary"  onClick={()=>edit(it)}>Edit</button>
            <button class="btn btn-danger" onClick={()=>remove(it.id)}>Delete</button>
          </div>

        </div>
      ))}

    </div>

  </div>)
}
