import { createSession } from "@/lib/session";
import { deleteSession } from "@/lib/tokenManager";

export async function signup(state: any, formData: any) {
  await createSession(formData.username);
  redirect('/')
}

export async function logout(){
    await deleteSession()
    redirect('/login')
}