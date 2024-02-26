import { Label, TextInput, Button, Spinner } from "flowbite-react"
import { Link } from "react-router-dom"
import { useForgotPasswordMutation } from "../redux/api/userApiSlice"
import { toast } from "react-toastify"
import { useState } from "react"

export default function ForgotPassword() {
    const [email, setEmail] = useState('')

    const [forgotPassword, {isLoading}] = useForgotPasswordMutation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await forgotPassword({email}).unwrap()
            toast.success(res.message)
        } catch (error) {
            toast.error(error.data.message)
            console.log(error);
        }
    }
  return (
    <div className="flex justify-center px-2 max-w-xl mx-auto mt-28">
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <h1 className="text-3xl self-center">FORGOT PASSWORD</h1>
            <div className="w-full">
                <Label value='Your email' />
                <TextInput 
                    type='email'
                    placeholder="email@email.com"
                    id='email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <Button gradientDuoTone='tealToLime' outline type='submit' disabled={isLoading}>
            {
                isLoading ? (
                <>
                    <Spinner size='sm'/>
                    <span className="pl-3">Sending...</span>
                </>
                ) : 'Send Email'
            }
            </Button>
            <div className="flex flex-col gap-4 text-sm mt-2">
                <div className="flex flex-row gap-2">
                    <span>Remember your password?</span>
                    <Link to='/signin' className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </form>
    </div>
  )
}
