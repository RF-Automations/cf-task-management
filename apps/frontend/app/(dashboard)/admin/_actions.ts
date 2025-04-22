import { BASE_BACKEND_URL } from "@/lib/constant";
import axios from "axios";


export async function updateTaskStatus(taskId: string, status: string, token: string ) {

    console.log(status)
    try {
        const res = await axios.patch(`${BASE_BACKEND_URL}/admin/task-status-update`, {
            taskId,
            status
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        if (res.data?.data?.id){
            return {
                message: res?.data?.message,
                data: status,
                error: null
            }
        }
        return {
            message: "Unable to update status",
            data: null,
            error: "Unable to update status"
        }
    } catch (error: any) {
        return {
            message: "Server problem",
            data: null,
            error: typeof error.message === "string" ? error.message : "server error"
        }
    }

}

export async function assignTask(taskId: string, dead_line: Date, token: string ) {
    try {
        const res = await axios.patch(`${BASE_BACKEND_URL}/admin/assign-task`, {
            taskId,
            dead_line
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        if (res.data?.data?.id){
            return {
                message: res?.data?.message,
                data: res?.data?.data?.status,
                error: null
            }
        }
        return {
            message: "Unable to assign",
            data: null,
            error: "Unable to assign task"
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

export async function approveTask(taskId: string, token: string ) {
    try {
        const res = await axios.patch(`${BASE_BACKEND_URL}/admin/approve-task`, {
            taskId,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        if (res.data?.data?.id){
            return {
                message: res?.data?.message,
                data: res?.data?.data?.status,
                error: null
            }
        }
        return {
            message: "Unable to approve",
            data: null,
            error: "Unable to approv task"
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


export async function getUsers(token: string) {
    try {
        const res = await axios.get(`${BASE_BACKEND_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    
        if (res.data?.data?.length > 0){
            return {
                message: res?.data?.message,
                data: res?.data?.data,
                error: null
            }
        }
        return {
            message: "Unable fetch users",
            data: null,
            error: "Unable to fetch users"
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