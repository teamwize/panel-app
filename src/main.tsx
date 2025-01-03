import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App'
import './index.css'
import {Toaster} from "@/components/ui/toaster.tsx";

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
        <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
)