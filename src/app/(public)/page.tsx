import Logo from '@/components/global/Logo'
import EmailVerificationUI from '@/components/modules/auth/EmailVerification'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div>
<Logo/>
<EmailVerificationUI/>
    </div>
  )
}

export default page 