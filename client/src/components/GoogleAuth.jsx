import { Button } from 'flowbite-react'
import { AiFillGoogleCircle } from 'react-icons/ai'
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../firebase.js'
import { useGoogleMutation } from '../redux/api/userApiSlice.js'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../redux/features/auth/authSlice.js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function GoogleAuth() {
    const auth = getAuth(app)

    const [google, {isLoading}] = useGoogleMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogle = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account' })
        try {
            const resultsFromGoogle = await signInWithPopup(auth, provider)
            const res = await google({
                name: resultsFromGoogle.user.displayName,
                email: resultsFromGoogle.user.email,
                googlePhotoUrl: resultsFromGoogle.user.photoURL
            }).unwrap()
            if (res.ok) {
                dispatch(setCredentials({...res}))
                toast.success('You have successfully registered and signed in')
                navigate('/dashboard')
            }
        } catch (error) {
            toast.error('Unable to sign in/register with your Google account')
            console.log(error);
        }
    }
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogle}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
        Continue with Google
    </Button>
  )
}
