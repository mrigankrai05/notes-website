import dbConnect from "@/lib/connection"
import Note from "@/models/Note"
import { NextResponse } from "next/server"

export async function DELETE(request, { params }) {
    try {
        const { id } = await params
        await dbConnect()
        const result = await Note.findByIdAndDelete(id)

        if (!result) {
            return NextResponse.json(
                { success: false, error: "Note not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: true,
            data: result
        })
    }
    catch (error) {
        return NextResponse.json({
            status: "FAILED",
        })
    }
}

export async function PUT(request, { params }) {
    try {
        const { id } = await params
        await dbConnect()
        const body = await request.json()
        const result = await Note.findByIdAndUpdate(id, {
            ...body, updatedAt: new Date()
        },
            { new: true, runValidators: true })

        if (!result) {
            return NextResponse.json(
                { success: false, error: "Note not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            status: true,
            data: result
        })
    }
    catch (error) {
        return NextResponse.json({
            status: "FAILED",
        })
    }
}