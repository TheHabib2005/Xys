import { Select, SelectItem } from '@/components/ui/select'
import { useUser } from '@/context/UserContext'
import { UserRole } from '@/interfaces/enums'
import { handleLogin } from '@/services/auth.services'
import { LoginFormData } from '@/validations-schemas/auth/auth.schema'
import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import { toast } from 'sonner'

const DemoLoginButton = () => {
 const [showLoading, setShowLoading] = useState(false)
    const { fetchUser } = useUser()
    const demoLogin = {
        admin:{
            email:"admin@blitz-analyzer.com",
        password:"admin@blitz"
        },
        user:{
            email:"devhabib2005@gmail.com",
        password:"12345678"
        },
        manager:{
            email:"admin@gmail.com",
        password:"12345678"
        }
    }
    
        const { mutateAsync: signInMutation, isPending: isLoading } = useMutation({
            mutationFn: async (data: LoginFormData) => {
                const result = await handleLogin(data)
                console.log(result)
                return result
            },
           
            onSuccess: () => {
                setShowLoading(true)
            }
        })
    
        async function onSubmit(data: LoginFormData) {
            try {
                const userData = await signInMutation(data)
                if (userData?.success) {
                    toast.success("You are Login Successfully")
                    await fetchUser()
                    if (userData.user.role === UserRole.ADMIN) {
                        router.push("/admin/dashboard")
                    } else if(userData.user.role === UserRole.MANAGER) {
                        router.push("/moderator/dashboard")
                    }else{
                        router.push("/dashboard")
    
                    }
                } else {
                    if (userData?.errors && Array.isArray(userData.errors)) {
                        form.clearErrors()
                        userData.errors.forEach((err: any) => {
                            const fieldName = err.path?.[0]
                            if (fieldName) {
                                form.setError(fieldName, {
                                    type: "server",
                                    message: err.message
                                })
                            }
                        })
                    } else {
                        toast.error(userData?.message || "Login failed")
                    }
                    setShowLoading(false)
                }
            } catch (error: any) {
                console.error("Login Error:", error)
                toast.error(error?.message || "Something went wrong")
                setShowLoading(false)
            }
        }

         <AnimatePresence>
                {showLoading && <AppLoader />}
            </AnimatePresence>

  return (
    <div>
        <Select>choose role ofr demos 


            <SelectItem>
                login as user
            </SelectItem>
            <SelectItem>
                login as manager
            </SelectItem>
            <SelectItem>
                login as admin
            </SelectItem>
        </Select>
    </div>
  )
}

export default DemoLoginButton