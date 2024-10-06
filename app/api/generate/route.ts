// app/api/process-resume/route.ts

import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
    try {
        // Parse incoming request data
        const { resumePath, jobRole, jobLevel } = await request.json();

        // Define the path to your Python script
        const scriptPath = path.join(__dirname, 'your_script.py'); // Adjust this path as needed

        // Spawn a child process to run the Python script
        const pythonProcess = spawn('python3', [scriptPath, resumePath, jobRole, jobLevel]);

        // Handle data received from the Python script
        let dataToSend = '';
        pythonProcess.stdout.on('data', (data) => {
            dataToSend += data.toString();
        });

        // Handle errors from the Python script
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        // When the process is finished, send the response
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                return NextResponse.json({ message: 'Processing completed.', feedback: dataToSend });
            } else {
                return NextResponse.json({ error: 'Failed to process resume.' }, { status: 500 });
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
