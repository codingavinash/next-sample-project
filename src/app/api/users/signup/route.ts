import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from '@/helpers/mailer';

connect();

export async function POST(request : NextRequest) {
    try {
        const reqBody = await request.json()
        const {username, email,password} = reqBody

        console.log(reqBody)

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({erros: "Users already exsits"}, {status: 400})
        }
        
        const salt =await bcryptjs.genSalt(10);
        const hassedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username: username,
            email : email,
            password : hassedPassword,
        })

        const savedUser = await newUser.save()
        console.log(savedUser)

        //send veriftymail
        await sendEmail({email, emailType: "VERIFY",userId: savedUser._id})

        return NextResponse.json({
            message :'User registered Succesfully',
            success : true,
            savedUser
        })
    } catch (error:any) {
        return NextResponse.json({ error : error.message }, {status: 500})
    }
}
