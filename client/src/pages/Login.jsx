import { Label, TextInput, Button } from "flowbite-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { FaStar } from "react-icons/fa";

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const handleChange = () => {

    }

    const handleSubmit = async () => {

    }
  return (
    <div className="flex justify-center max-w-xl mx-auto mt-28">
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <h1 className="text-3xl self-center">LOGIN</h1>
            <div className="w-full">
                <Label value='Your username' />
                <TextInput 
                    type='text'
                    placeholder="Username"
                    id='username'
                    onChange={handleChange}
                />
            </div>
            <div className="w-full">
                <Label value='Your email' />
                <TextInput 
                    type='email'
                    placeholder="email@email.com"
                    id='email'
                    onChange={handleChange}
                />
            </div>
            <div className="w-full">
                <Label value='Your password' />
                <TextInput 
                    type='password'
                    placeholder="*******"
                    id='password'
                    onChange={handleChange}
                />
            </div>
            <Button gradientDuoTone='tealToLime' outline type='submit' disabled={loading}>
            {
                loading ? (
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
