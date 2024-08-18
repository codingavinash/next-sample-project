import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'
import { getData } from '@/helpers/getData'

connect();

export async function GET(request :NextRequest) {
    const userId = await getData(request)

    const user = await User.findById({_id: userId}).select("-password")
    
    if(!user){
        return NextResponse.json({
            message : "User not Found",
            success: false
        })
    }

    return NextResponse.json({
        message: "User found Successfully",
        date : user
    })
}