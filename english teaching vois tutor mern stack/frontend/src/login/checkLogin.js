import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";



const CheckLogin = async (user) => {

    try {
        Swal.fire({
            title: 'Loading...',
            backdrop: 'true',
            allowOutsideClick: false,
            backdrop: 'grey'
        })
        Swal.showLoading()
        /* await new Promise(r => setTimeout(r, 1000)); */
        const res = await axios.get("http://localhost:4000/login/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "role": user
            }
        }).then(res => {
            Swal.close()
            console.log(res)
            return res.data.user
        })
        .catch(err => {
            Swal.close()
            console.log(err)
            return err
        })

    }
    catch (err) {
        console.log(err)
    }

}

export default CheckLogin