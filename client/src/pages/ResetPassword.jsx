import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { Button, TextInput } from 'flowbite-react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const {token} = useParams()

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        setLoading(false)
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords must match')
        }
        
        try {
            setLoading(true)
            const res = await fetch(`/api/users/resetPassword/`+token, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({password})
            });
            const data = await res.json()
            if (data.success === false) {
                toast.error(data.message)
                setLoading(false)
                return;
            } else {
                toast.success('Password successfully reset')
                setLoading(false)
                navigate('/signin')
            }
        } catch (error) {
            setLoading(false)
            toast.error(error.message)
        }
    }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Reset Password</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <TextInput 
          type="password" 
          placeholder='password' 
          id='password' 
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextInput 
          type="password" 
          placeholder='confirm password' 
          id='confirmPassword' 
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button 
            gradientDuoTone='tealToLime' outline
            disabled={loading} 
            type='submit'
        >
            {loading ? 'Changing Password...' : 'Change'}
        </Button>
      </form>
    </div>
  )
}
