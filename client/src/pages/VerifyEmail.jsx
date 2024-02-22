import { TextInput, Button } from "flowbite-react"
import { useState } from "react"
import { useResendEmailMutation } from "../redux/api/userApiSlice.js"
import { toast } from "react-toastify"

export default function VerifyEmail() {
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [email, setEmail] = useState('');

    const [ResendEmail, {isLoading}] = useResendEmailMutation()

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
  return (
    <div className='flex flex-col px-2 justify-center mt-28 max-w-lg mx-auto'>
        <form className='flex flex-col'>
            <h1 className="self-center">Please enter the 4 digit code sent to your email address:</h1>
            <div className="flex flex-row justify-center gap-3 mt-4">
                <div className="w-16">
                    <TextInput 
                        type='text'
                        id='username'
                    />
                </div>
                <div className="w-16">
                    <TextInput 
                        type='text'
                        id='username'
                    />
                </div>
                <div className="w-16">
                    <TextInput 
                        type='text'
                        id='username'
                    />
                </div>
                <div className="w-16">
                    <TextInput 
                        type='text'
                        id='username'
                    />
                </div>
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
                        disabled={loading} 
                        onClick={resendEmail}
                        className="mt-2 w-40 self-center"
                    >
                    {
                        loading ? (
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
