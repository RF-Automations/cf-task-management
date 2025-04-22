import { BASE_BACKEND_URL } from "@/lib/constant"
import axios from "axios"

export async function getTask(id: string, token: string) {
    try {
        const res = await axios.get(`${BASE_BACKEND_URL}/tasks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        if (res.data?.data?.id){
            return {
                message: res?.data?.message,
                data: res?.data?.data,
                error: null
            }
        }
        return {
            message: "Unable to fetch task",
            data: null,
            error: "Unable to fetch task"
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: "Server problem",
            data: null,
            error: typeof error.message === "string" ? error.message : "server error"
        }
    }
}