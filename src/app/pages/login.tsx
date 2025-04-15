'use client'
import { fetchAuthSession, fetchUserAttributes, signInWithRedirect } from "aws-amplify/auth"
import { get } from "aws-amplify/api"
import { useState } from "react"
import { useEffect } from "react"
import { Authenticator } from '@aws-amplify/ui-react'
import "@aws-amplify/ui-react/styles.css"

export default function LoginPage() {
    return (
        <div className="authCard">
            <Authenticator></Authenticator>
        </div>
    )
}

