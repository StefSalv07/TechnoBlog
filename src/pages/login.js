import Login from '@/components/Login'
import NavBar from '@/components/NavBar'
import { useSession } from 'next-auth/react'

export default function LoginPage() {
    return (
        <>
            <NavBar />
            <Login />
        </>
    )
}