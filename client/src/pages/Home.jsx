import { Label, TextInput, Button } from "flowbite-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { FaStar } from "react-icons/fa";

export default function Home() {
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const handleSubmit = async (e) => {

    }

    const handleChange = () => {

    }
  return (
    <div>
        {/* Left side of the page */}
        <div className="flex flex-col md:flex-row px-2 mx-auto gap-2 max-w-6xl py-4 sm:py-40">
            <div className="flex-1 bg-teal-200 px-2 sm:px-6 rounded-lg py-2 dark:text-slate-700">
                <h1 className='text-3xl font-semibold uppercase underline sm:mt-4 mt-0'>Achieve your Powerlifting Goals</h1>
                <h3 className="mt-4 flex flex-row items-center gap-2"><FaStar />Track your progress </h3>
                <h3 className="mt-4 flex flex-row items-center gap-2"><FaStar />Setup new workouts</h3>
                <h3 className="mt-4 flex flex-row items-center gap-2"><FaStar />Smash those PR's!</h3>
                <p className="mt-6 text-lg">This Powerlifting App will make your workouts easier to maintain</p>
                <p className="mt-10 font-serif font-semibold">REGISTER NOW!</p>
                <div className="flex flex-row items-center mt-6 gap-2">
                    <div className="w-16 h-14">
                    <img 
                        src="https://images.unsplash.com/photo-1474176857210-7287d38d27c6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="profile image" 
                        className="rounded-full w-full h-full object-cover border-2"
                    />
                    </div>
                    <p className="font-serif font-semibold">"This App has everything I need, wish I found out about it sooner"<span className="text-slate-600 font-light">- Alex C.</span></p> 
                </div>
            </div>
            {/* Right side of the page */}
            <div className="flex-1 mt-10 sm:mt-0">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                    <Label value='Your Username' />
                    <TextInput 
                        type='text'
                        placeholder="Username"
                        id='username'
                        onChange={handleChange}
                    />
                    </div>
                    <div>
                    <Label value='Your Email' />
                    <TextInput 
                        type='email'
                        placeholder="email@email.com"
                        id='email'
                        onChange={handleChange}
                    />
                    </div>
                    <div>
                    <Label value='Your Password' />
                    <TextInput 
                        type='password'
                        placeholder="******"
                        id='password'
                        onChange={handleChange}
                    />
                    </div>
                    <div>
                    <Label value='Confirm Password' />
                    <TextInput 
                        type='password'
                        placeholder="******"
                        id='confirmPassword'
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
                        ) : 'Sign Up'
                    }
                    </Button>
                </form>
                <div className="flex gap-2 text-sm mt-5">
                    <span>Have an account?</span>
                    <Link to='/sign-in' className="text-blue-500 hover:underline">
                    Sign In
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}
