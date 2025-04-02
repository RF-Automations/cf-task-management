import { SignIn } from "@clerk/nextjs";


export default function page(){

    return (
        <div className="h-screen w-full flex justify-center items-center bg-gradient-to-b from-background to-secondary">
            <SignIn />
        </div>
    )
}