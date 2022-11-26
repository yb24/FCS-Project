import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DatePicker from "react-datepicker";
import {Button, InputLabel, MenuItem, FormControl, Select, TextField} from '@mui/material';
import { getToken } from '../services/localStorageService';
import "react-datepicker/dist/react-datepicker.css";


function RequestDocuments(){

    const [startDate, setStartDate] = useState(new Date());
    const [type, setType] = useState('');
    const [email, setEmail] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');


    let {access_token, refresh_token} = getToken()
    let userID = access_token?JSON.parse(window.atob(access_token.split('.')[1])):""
    userID = userID['user_id'] 

    const handleChangeType = (event) => {
        setType(event.target.value);
    };

    const RequestDocument = (type, date, email) =>{

        if(!type || !date || !email) return;
       
        axios({
            method: "POST",
            url:`${process.env.REACT_APP_BACKEND}/request_documents`,
            data:{
                token: access_token,
                docType: type,
                date: date,
                receiverEmail: email
            }
          }).then((response)=>{
            const data = response.data
            console.log(data)
            setType(null);
            setEmail(null);
            setStartDate(new Date());
            setResponseMessage("Document requested successfully!")
          }).catch((error) => {
            if (error.response) {
              console.log(error.response);
            }
            setResponseMessage("Error in requesting document!")

          })
    };











    const [state, setState] = useState({
      title: '',
      content: '',
      image: null
    });
  
    const handleChange = (e) => {
      setState({...state, 
        [e.target.id]: e.target.value
      })
    };
  
    const handleImageChange = (e) => {
      setState({...state,
        image: e.target.files[0]
      })
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(state);
      let form_data = new FormData();
      form_data.append('image', state.image, state.image.name);
      form_data.append('title', state.title);
      form_data.append('content', state.content);
      let url = 'http://127.0.0.1:8000/api/user/upload_doc';
      axios.post(url, form_data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
          .then(res => {
            console.log(res.data);
          })
          .catch(err => console.log(err))
    };

    const [file, setFile] = useState(null);

    const [img, setImg] = useState('')
    const aryanHandle = () =>{
      axios({
        method: "POST",
        url:`${process.env.REACT_APP_BACKEND}/get_file`,
        data:{
            file:"VPN.pdf_2022-11-26:11:35:49.965613+00:00_11"
        },
        responseType:'blob',
      }).then((response)=>{
        
        console.log(response.data)
        // setImg(response.data)
        // let fileNew = new File([response.data], "newFile")
        // console.log(img)
        console.log(URL.createObjectURL(response.data))
    
      }).catch((error) => {
        if (error.response) {
          console.log(error.response);
        }
      

      })
    }

    return(
        <div>

            <FormControl sx={{ m: 1, minWidth: 170 }}>
                <InputLabel id="type-select">Type of Document</InputLabel>
                <Select
                labelId="type-select"
                id="select"
                value={type}
                label="Type"
                onChange={handleChangeType}
                >
                <MenuItem value={"prescription"}>Prescription</MenuItem>
                <MenuItem value={"test_result"}>Test Result</MenuItem>
                <MenuItem value={"bill"}>Bill</MenuItem>
                <MenuItem value={"insurance_document"}>Insurance Document</MenuItem>
                <MenuItem value={"discharge_summary"}>Discharge Summary</MenuItem>
                </Select>
            </FormControl>

            <br></br>
            <br></br>

            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />

            <br></br>
            <br></br>

            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Emai ID of the Healtchare Professional/Hospital"
                type="email"
                variant="standard"
                onChange={(e)=>setEmail(e.target.value)}
              />

            <br></br>
            <br></br>

            <Button variant = "contained" onClick={()=>RequestDocument(type, startDate, email)}>
                  Request Document
            </Button>

            <br></br>
            <br></br>

            <p>{responseMessage}</p>

            <div className="Appp">
            <form onSubmit={handleSubmit}>
          <p>
            <input type="text" placeholder='Title' id='title' value={state.title} onChange={handleChange} required/>
          </p>
          <p>
            <input type="text" placeholder='Content' id='content' value={state.content} onChange={handleChange} required/>

          </p>
          <p>
            <input type="file"
                   id="image"
                   accept="image/png, image/jpeg"  onChange={handleImageChange} required/>
          </p>
          <input type="submit"/>
        </form>
      </div>



      <Button variant = "contained" onClick={aryanHandle}>
                  Aryan button
            </Button>

            {/* {img?<img src={img} alt="Italian Trulli"> </img>:""} */}

        </div>

    )

}


export default RequestDocuments;














































































