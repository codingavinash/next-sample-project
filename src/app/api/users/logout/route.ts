import {connect} from '@/dbConfig/dbConfig'
import {NextRequest, NextResponse} from 'next/server'

connect();

export async function GET(request:NextRequest) {
    try{
        return NextResponse.json({
            message : "Logout Successfully",
            success: true
        }).cookies.set("token", "", {
            httpOnly: true,
            expires : new Date(0)
        },)

        
    }catch(error:any){
        return NextResponse.json({error : error.message}, {status: 500})
    }
}