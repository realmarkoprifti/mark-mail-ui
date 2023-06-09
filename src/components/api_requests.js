import axios from 'axios'
import { formToJSON } from 'axios'


const url = "http://127.0.0.1:8000/api"

export async function login(dataform, recaptcha_token) {
    const form = formToJSON(dataform)
    delete form.g
    form.recaptcha_token = recaptcha_token

    const response = await axios.post(url + '/login', form)

    return response.data
}


export async function refresh(refresh) {
    const response = await axios.post(url + '/refresh/token', {
        refresh: refresh
    })

    return response.data
}


export async function get_emails(emailClass) {
    const response = await axios.post(url + "/get/emails", {
        emailClass: emailClass
    }, 
    {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access')
        }
    })

    return response.data
}


export async function check_code(form) {
    const dataform = formToJSON(form)
    const response = await axios.post(url + "/verify/rescue-code", {
        email: dataform.email,
        rescue_code: parseInt(dataform.rescue_code)
    })

    return response.data
}


export async function reset_password(form) {
    const dataform = formToJSON(form)
    dataform.rescue_code = parseInt(dataform.rescue_code)

    const response = await axios.post(url + '/reset/password', dataform)

    return response.data
}


export async function logout() {
    await axios.post(url + '/logout', {
        refresh: localStorage.getItem("refresh")
    })
}


export async function compose_mail(dataform) {
    const form = formToJSON(dataform)
    const response = await axios.post(url + "/compose", form, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    })

    return response.data
}


export async function change_status(status="", id, isRead) {
    const response = await axios.put(url + "/change/status", {
        id: id,
        status: status,
        isRead: isRead && "True"
    }, 
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    })

    return response.data
}


export async function change_password(dataform, recaptcha) {
    const form = formToJSON(dataform)
    form.recaptcha_token = recaptcha
    const response = await axios.post(url + '/change/password', form, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    })

    return response.data
}


export async function check_email(email) {
    const response = await axios.post(url + "/check/email", {
        email: email
    })

    return response.data
}


export async function register(form, recaptcha_token) {
    const dataform = formToJSON(form)
    delete dataform.g
    dataform.recaptcha_token = recaptcha_token
    dataform.rescue_code = parseInt(dataform.rescue_code)
    
    const response = await axios.post(url + "/register", dataform)

    return response.data
}