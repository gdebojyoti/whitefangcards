const FORM_ID = "email-form"
const EMAIL_FIELD_NAME = "email"

const ALERT_TYPE = {
  SUCCESS: "success",
  ERROR: "error"
}
const MSGS = {
  INVALID_EMAIL: "Please enter a valid email ID"
}

const API_URL = 'https://r19o3mda10.execute-api.ap-south-1.amazonaws.com/prod/save-email'

window.onload = () => {
  console.log("I got in")
  const emailForm = document.getElementById(FORM_ID)

  emailForm.addEventListener("submit", async (e) => {
    console.log("submittin form", e)
    e.stopPropagation()
    e.preventDefault()

    const emailvalue = document.forms[FORM_ID][EMAIL_FIELD_NAME].value

    // for missing or invalid emails
    if (!emailvalue || !isEmailValid(emailvalue)) {
      triggerAlert(ALERT_TYPE.ERROR, MSGS.INVALID_EMAIL)
      return
    }

    // for valid emails
    const { msg, status } = await saveEmail(emailvalue) || {}
    triggerAlert(status ? ALERT_TYPE.ERROR : ALERT_TYPE.SUCCESS, msg)
  })
}

function triggerAlert (type, msg) {
  console.log("type, msg", type, msg)
  alert(msg)
}

function isEmailValid (email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

async function saveEmail (email) {
  console.log("saving email...", email)

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })

    const result = await response.json()
    return { ...result, status: 0 }
  } catch (e) {
    console.log("FAILED!", e)
    return { msg: 'Some error occurred. Please try again', status: 1 }
  }
}