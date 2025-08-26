"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div className="mx-2 my-2">
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }
  return (
    <div className="mx-2 my-2">
      Not signed in <br />
      <button className="btn bg-red-400 px-2 py-2" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}