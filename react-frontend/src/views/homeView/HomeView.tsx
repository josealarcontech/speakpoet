import { apiCall } from "../../utils/fetch"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { setToast } from "../../features/toast/toastSlice"
import { useAppDispatch } from "../../hooks"
import { folder, tag } from "../../utils/types"
import { Grid, Card, Select, TextField, Button, Typography, Divider, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem } from "@mui/material"
import { CreateNewFolder, Home, Folder, Create, Delete } from "@mui/icons-material"
function HomeView () {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [folders, setFolders] = useState([])
  const [tags, setTags] = useState([])
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const emptyTag: tag = {
    category: '',
    name: ''
  }
  const [cleanFolder, setCleanFolder] = useState<folder>({
    name: 'New Folder',
    genre: emptyTag,
    type: emptyTag
  })
  const [editedFolder, setEditedFolder] = useState<folder>({
    name: 'New Folder',
    genre: {
      name: '',
      category: ''
    },
    type: {
      name: '',
      category: ''
    }
  })

  const [toDeleteFolder, setToDeleteFolder] = useState(cleanFolder)
  const [genreTags, setGenreTags] = useState([])
  const [typeTags, setTypeTags] = useState([])
  const [editing, setEditing] = useState(true) //false = adding, true = editing
  const [genreUncategorizedTag, setGenreUncategorizedTag] = useState<tag>(emptyTag)
  const [typeUncategorizedTag, setTypeUncategorizedTag] = useState<tag>(emptyTag)
  const [editedFolderNameErrorText, setEditedFolderNameErrorText] = useState('')
  const [editedFolderNameError, setEditedFolderNameError] = useState(false)
  const getInfo = async() => {
    await getTags()
    await getFolders()
  }

  const getTags = async() => {
    const resp = await apiCall('/tags', 'GET', true)
    setTags(resp)
    setGenreTags(resp.filter((tag: tag) => tag.category === 'genre'))
    setTypeTags(resp.filter((tag: tag) => tag.category === 'type'))
    setGenreUncategorizedTag(genreTags.find((tag:tag) => tag.name === 'Uncategorized') || emptyTag)
    setTypeUncategorizedTag(typeTags.find((tag:tag) => tag.name === 'Uncategorized') || emptyTag)
    setCleanFolder({...cleanFolder, genre: genreUncategorizedTag, type: typeUncategorizedTag})
  }

  const getFolders = async() => {
    try {
      const resp = await apiCall('/folders', 'GET', true)
      setFolders(resp)
    } catch (error) {
      console.error(error)
      dispatch(setToast({toastInfo: {toastColor: 'error', toastMessage: 'Error getting folders, please try again'}}))
    } 
  }

  const openEdit = (folder: folder) => {
    setEditing(true)
    setEditedFolder(folder)
    setShowDialog(true)
  }

  const saveFolder = async() => {
    try {
      if(editing) {
        await editFolder()
      } else {
        await addFolder()
      }
      const message = editing ? 'Successfully changed folder' : 'Successfully added folder'
      dispatch(setToast({toastInfo: {toastColor: 'success', toastMessage: message}}))
    } catch (error) {
      console.error(error)
      dispatch(setToast({toastInfo: {toastColor: 'error', toastMessage: 'Error saving folder, please try again'}}))
    }
  }

  const addFolder = async() => {
    await apiCall('/folders', 'POST', true, editedFolder)
    await getFolders()
    cancel()
  }

  const editFolder = async() => {
    await apiCall('/folders', 'PUT', true, editedFolder)
    await getFolders()
    cancel()
  }

  const cancel = () => {
    setShowDialog(false)
    setEditedFolder(cleanFolder)
  }

  const addFolderDialog = () => {
    setEditing(false)
    setEditedFolder(cleanFolder)
    setShowDialog(true)
  }

  const openFolder = (folder: folder) => {
    navigate(`/folder/${folder.uid}`)
  }

  const closeDeleteDialog = () => {
    setShowDeleteDialog(false)
    setToDeleteFolder(cleanFolder)
  }

  const deleteFolder = async() => {
    await apiCall(`/folders/${toDeleteFolder.uid}`, 'DELETE', true)
    closeDeleteDialog()
    dispatch(setToast({toastInfo: {toastColor: 'success', toastMessage: 'Successfully deleted folder'}}))
    await getInfo()
  }

  const openDelete = (folder: folder) => {
    setToDeleteFolder(folder)
    setShowDeleteDialog(true)
  }

  const validateEditedFolderName = () => {
    console.log(editedFolder.name)
    console.log(!(!!editedFolder.name))
    if(!(!!editedFolder.name)) {
      setEditedFolderNameErrorText('Folder name is required')
      setEditedFolderNameError(true)
      return false
    }
    setEditedFolderNameErrorText('')
    setEditedFolderNameError(false)
    return true
  }

  useEffect(() => {
    const fetchData = async () => { await getInfo() }
    fetchData().catch(console.error)
  }, [])

  return (
    <div>
      <div style={{display: 'flex', paddingTop: '15px'}}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px 0px 0px 70px'}}>
          <Home sx={{fontSize: '30px'}} color="primary"/>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px 18px'}}>
        <Typography sx={{fontWeight: '1000', fontSize: '23pt'}}>Folders</Typography>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <CreateNewFolder sx={{fontSize: '30px'}} color="success"/>
        </div>
      </div>

      <Grid container style={{padding: '15px 80px'}} spacing={2}>
        {folders.map((folder:folder) => 
          <Grid key={folder.uid} item xs={3}>
            <Card variant="outlined" sx={{height: '100px'}}>
              <Grid container sx={{paddingTop: '10px'}}>
                <Grid item display='flex' justifyContent="center" alignItems='center' xs={2}>
                  <Folder fontSize="large" color="primary"/>
                </Grid>
                <Grid item container xs={8}>
                  <Grid item xs={12}>
                    <Typography sx={{fontWeight: '800', fontSize: '13pt'}}>{folder.name}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider></Divider>
                  </Grid>
                  <Grid item container xs={12} columns={13}>
                    <Grid item xs={6} display='flex' justifyContent="center" alignItems='center'>
                      <Typography sx={{fontWeight: '800', fontSize: '13pt'}}>{folder.type?.name}</Typography>
                    </Grid>
                    <Grid item xs={1} display='flex' justifyContent="center" sx={{marginBottom: '15px'}}>
                      <Divider orientation="vertical" variant="middle"></Divider>
                    </Grid>
                    <Grid item xs={6} display='flex' justifyContent="center" alignItems='center'>
                      <Typography sx={{fontWeight: '800', fontSize: '13pt'}}>{folder.genre?.name}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item container xs={2} rowSpacing={0}>
                  <Grid item display='flex' justifyContent="center" alignItems='center' xs={12}>
                    <IconButton color="warning" onClick={()=>openEdit(folder)}>
                      <Create/>
                    </IconButton>
                  </Grid>
                  <Grid item display='flex' justifyContent="center" alignItems='center' xs={12}>
                    <IconButton color="error" onClick={()=>openDelete(folder)}>
                      <Delete/>
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid>
      <Dialog open={showDialog} onClose={()=>setShowDialog(false)}>
        <DialogTitle>{editing ? 'Edit Folder' : 'Add Folder'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth error={editedFolderNameError} helperText={editedFolderNameErrorText || `${editedFolder.name.length}/30`} label="Folder name" variant="outlined" value={editedFolder.name} onChange={(e) => {
                setEditedFolder({...editedFolder, name: e.target.value});
                validateEditedFolderName();
                }}
                inputProps={{ maxLength: 30}}>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <Select fullWidth value={editedFolder}>
                {genreTags.map((genre:tag) => (
                  <MenuItem value={genre.uid} key={genre.uid}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {/* <Grid item xs={6}>
              <Select fullWidth value={editedFolder.type}>
                {typeTags.map((type:tag) => (
                  <MenuItem value={type.uid} key={type.uid}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel} color="primary">Cancel</Button>
          <Button onClick={saveFolder} color="success">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
export default HomeView