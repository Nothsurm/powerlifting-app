import { Button, Modal, TextInput } from "flowbite-react"
import { useSelector, useDispatch } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from "../firebase.js"
import { toast } from 'react-toastify'
import { CircularProgressbar } from 'react-circular-progressbar';
import { logout, setCredentials } from "../redux/features/auth/authSlice.js"
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useNavigate } from "react-router-dom"
import { useDeleteUserMutation, useLogoutMutation } from "../redux/api/userApiSlice.js"

export default function DashProfile() {
    const {userInfo} = useSelector((state) => state.auth)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null)
    const [imageFileUploading, setImageFileUploading] = useState(false)
    const [formData, setFormData] = useState({})
    const [showModal, setShowModal] = useState(false)

    const [deleteUser] = useDeleteUserMutation()
    const [logoutApiCall] = useLogoutMutation()

    const filePickerRef = useRef()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }

    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async () => {
        //service firebase.storage {
        //match /b/{bucket}/o {
        //match /{allPaths=**} {
        //allow read;
        //allow write: if
        //request.resource.size < 2 * 1024 * 1024 &&
        //request.resource.contentType.matches('image/.*')
        setImageFileUploading(true)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                toast.error('Could not upload image (File must be less than 2MB)')
                setImageFileUploadProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
                setImageFileUploading(false)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    toast.success('Image upload successfull')
                    setImageFileUrl(downloadURL)
                    setFormData({ ...formData, profilePicture: downloadURL })
                    setImageFileUploading(false)
                })
            }
        )
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (imageFileUploading) {
            toast.error('Please wait for image to upload')
            return;
        }
        try {
            const res = await fetch(`/api/users/update/${userInfo._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json()
            dispatch(setCredentials(data))
            toast.success('Profile successfully updated')
        } catch (error) {
            toast.error(error.message)
            console.log(error);
        }
    }

    const handleDeleteUser = async (id) => {
        setShowModal(false)
        try {
            await deleteUser(id)
            dispatch(logout())
            toast.success('You have successfully deleted your account')
            navigate('/signin')
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleSignOut = async () => {
        try {
            await logoutApiCall().unwrap()
            dispatch(logout())
            navigate('/signin')
            toast.success('Successfully logged out')
        } catch (error) {
            toast.error(error)
        }
    }

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full" onClick={() => filePickerRef.current.click()}>
                {imageFileUploadProgress && (
                    <CircularProgressbar 
                        value={imageFileUploadProgress || 0} 
                        text={`${imageFileUploadProgress}%`}
                        strokeWidth={5}
                        styles={{
                            root: {
                                width: '100%',
                                height: '100%',
                                position: 'absolute',
                                top: 0,
                                left: 0
                            },
                            path: {
                                stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                            }
                        }}
                    />
                )}
                <img 
                    src={imageFileUrl || userInfo.profilePicture} 
                    alt="user" 
                    className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
                />
            </div>
            <TextInput 
                type='text' 
                id='username' 
                placeholder="username" 
                defaultValue={userInfo.username}
                onChange={handleChange}
            />
            <TextInput 
                type='email' 
                id='email' 
                placeholder="email" 
                defaultValue={userInfo.email}
                onChange={handleChange}
            />
            <TextInput 
                type='password' 
                id='password' 
                placeholder="password" 
                onChange={handleChange}
            />
            <Button type='submit' gradientDuoTone='purpleToBlue' outline>
                Update
            </Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span onClick={() => setShowModal(true)} className="cursor-pointer">Delete Account</span>
            <span onClick={handleSignOut} className="cursor-pointer">Sign Out</span>
        </div>
        <Modal 
            show={showModal} 
            onClose={() => setShowModal(false)} 
            popup
            size='md'
        >
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
                    <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">Are you sure you want to delete your account?</h3>
                    <div className="flex justify-center gap-4">
                        <Button color='failure' onClick={() => handleDeleteUser(userInfo._id)}>Yes, I'm sure</Button>
                        <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
