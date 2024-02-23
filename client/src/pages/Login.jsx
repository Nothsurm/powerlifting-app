import { Label, TextInput, Button, Spinner } from "flowbite-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaStar } from "react-icons/fa";
import { setCredentials } from "../redux/features/auth/authSlice.js";
import { useLoginMutation } from "../redux/api/userApiSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [login, {isLoading}] = useLoginMutation()

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { userInfo } = useSelector(state => state.auth)

    useEffect(() => {
        if (userInfo) {
            navigate('/dashboard')
        }
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await login({email, password}).unwrap()
            dispatch(setCredentials({...res}))
            toast.success('You have successfully signed in')
            navigate('/dashboard')
        } catch (error) {
            console.log(error);
            toast.error(error.data.message)
        }
    }
  return (
    <div className="flex justify-center px-2 max-w-xl mx-auto mt-28">
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <h1 className="text-3xl self-center">LOGIN</h1>
            <div className="w-full">
                <Label value='Your email' />
                <TextInput 
                    type='email'
                    placeholder="email@email.com"
                    id='email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="w-full">
                <Label value='Your password' />
                <TextInput 
                    type='password'
                    placeholder="*******"
                    id='password'
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <Button gradientDuoTone='tealToLime' outline type='submit' disabled={isLoading}>
            {
                isLoading ? (
                <>
                    <Spinner size='sm'/>
                    <span className="pl-3">Loading...</span>
                </>
                ) : 'Sign In'
            }
            </Button>
            <div className="flex flex-col gap-4 text-sm mt-2">
                <div className="flex flex-row gap-2">
                    <span>Don't have an account?</span>
                    <Link to='/' className="text-blue-500 hover:underline">
                        Register
                    </Link>
                </div>
                <div className="flex flex-row gap-2">
                    <span>Forgot your password?</span>
                    <Link to='/' className="text-blue-500 hover:underline">
                        Click here
                    </Link>
                </div>
            </div>
        </form>
    </div>
  )
}
