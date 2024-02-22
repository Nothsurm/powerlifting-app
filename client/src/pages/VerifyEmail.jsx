import { TextInput, Button, Spinner } from "flowbite-react"
import { useState } from "react"
import { useResendEmailMutation } from "../redux/api/userApiSlice.js"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"

export default function VerifyEmail() {
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [email, setEmail] = useState('');
    const {userId} = useParams()

    const navigate = useNavigate()

    const [ResendEmail, {isLoading}] = useResendEmailMutation()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }

    const toggleDropdown = () => {
        setOpenModal(!openModal)
    }

    const resendEmail = async () => {
        try {
            await ResendEmail({email}).unwrap()
            toast.success('Email successfully resent')
        } catch (error) {
            toast.error(error.data.message)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData || formData.length < 4) {
            toast.error('Your code is not valid')
            return;
        }
        try {
            const res = await fetch('/api/users/verify-email/'+userId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json()
            if (data.success === false) {
                setLoading(false)
                toast.error(data.message)
                return;
            } else {
                setLoading(false)
                toast.success('You have been successfully verified')
                navigate('/sign-in')
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.data.message)
        }
    }
  return (
    <div className='flex flex-col px-2 justify-center mt-28 max-w-lg mx-auto'>
        <form onSubmit={handleSubmit} className='flex flex-col'>
        <h1 className="self-center">Please enter the 4 digit code sent to your email address:</h1>
            <div className="flex flex-row justify-center mt-6">
                <TextInput
                    className="flex justify-center text-4xl bg-gray-800 w-32 p-2"
                    type="text"
                    onChange={handleChange}
                    disabled={isLoading}
                    id='otp'
                />
            </div>
            <Button 
                gradientDuoTone='pinkToOrange' 
                outline 
                type='submit' 
                disabled={loading} 
                className="mt-8"
            >
            {
                loading ? (
                <>
                    <Spinner size='sm'/>
                    <span className="pl-3">Loading...</span>
                </>
                ) : 'Verify'
            }
            </Button>
            <Button 
                gradientDuoTone='tealToLime' 
                outline 
                disabled={loading} 
                onClick={toggleDropdown}
                className="mt-8"
            >
            {
                loading ? (
                <>
                    <Spinner size='sm'/>
                    <span className="pl-3">Loading...</span>
                </>
                ) : 'Resend Email'
            }
            </Button>
        </form>
        {
            openModal && (
                <form className="w-full flex flex-col justify-center mt-4">
                    <TextInput 
                        type='email'
                        placeholder="email@email.com"
                        id='email'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button 
                        gradientDuoTone='tealToLime' 
                        outline 
                        disabled={isLoading} 
                        onClick={resendEmail}
                        className="mt-2 w-40 self-center"
                    >
                    {
                        isLoading ? (
                        <>
                            <Spinner size='sm'/>
                            <span className="pl-3">Loading...</span>
                        </>
                        ) : 'Send 4 digit code'
                    }
                    </Button>
                </form>
            )
        }
    </div>
  )
}
