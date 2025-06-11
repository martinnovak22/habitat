import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {RouterProvider} from '@tanstack/react-router';
import {router} from './routes/router';
import {ClerkProvider} from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            <RouterProvider router={router}/>
        </ClerkProvider>
    </React.StrictMode>
);
