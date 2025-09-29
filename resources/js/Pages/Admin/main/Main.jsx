import React from 'react'
import NavAdmin from '../components/NavAdmin'
import AdminHeader from '../components/AdminHeader'
import './main.css'

export default function Main({ auth }) {
    return (
        <>
            <NavAdmin/>
            <AdminHeader title="Dashboard" />
            
        </>
    )
}