import React, { useState } from "react";
import ContentLoader from 'react-content-loader'
import CustomerDataService from "../services/CustomerService";

const MyLoader = () => (
  <div className="card mt-4 p-2">
    <ContentLoader />
  </div>
)

function AddCustomer() {

  const [file, setFile] = useState(null)
  const [imageSource, setImageSource] = useState(null)
  const [imageResult, setImageResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const selectedHandler = e => {
    const selected_file = e.target.files[0]
    setFile(selected_file)

    if (selected_file instanceof Blob) {
      const reader = new FileReader()
    
      reader.readAsDataURL(selected_file)
      reader.onloadend = function(e) {
        setImageSource(reader.result)
      }  
    } else {
      alert('Selected file is not Blob type')
    }
  }

  const sendHandler = async () => {
    setLoading(true)

    if(!file){
      alert('you must upload file')
      return
    }
    
    const payload = {
      ImageBase64: imageSource.replace(/^data:image\/[a-z]+;base64,/, ""),
    };

    CustomerDataService.validateId(payload)
      .then(response => {
        console.log(response.data)
        setImageResult(response.data)
        setLoading(false)
      })
      .catch(e => {
        console.log(e)
        setLoading(false)
      });

    // document.getElementById('fileinput').value = null
  }

  const saveCustomer = () => {
    const data = {
      first_name: imageResult['FirstName'],
      middle_name: imageResult['MiddleName'],
      last_name: imageResult['LastName'],
      birth_date: imageResult['BirthDate'] ? imageResult['BirthDate'].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : null,
      id_number: imageResult['LicenseId'],
      id_issue_date: imageResult['IssueDate'] ? imageResult['IssueDate'].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : null,
      id_expire_date: imageResult['ExpireDate'] ? imageResult['ExpireDate'].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") : null,
    };

    CustomerDataService.create(data)
      .then(response => {
        console.log(response.data);
        setImageResult(null)
        alert('Successfully added a new customer')
      })
      .catch(err => {
        console.log(err.response.data);
        alert(err.response.data.message)
      });
  }

  const getIdStatus = () => {
    if (imageResult && imageResult['ExpireDate']) {
      const expire_date = imageResult['ExpireDate'].replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
      if (new Date(expire_date) >= new Date()) {
        return 'Valid'
      } else {
        return 'Expired'
      }
    } else {
      return 'Invalid'
    }
  }

  return (
    <div>
      <div className="p-3">
        <div className="row">
          <div className="col-8">
            <div className="row">
              <div className="col-8">
                <input id="fileinput" onChange={selectedHandler} className="form-control" type="file"/>
              </div>
              <div className="col-4">
                <button onClick={sendHandler} type="button" className="btn btn-primary">Validate</button>
              </div>
            </div>
            
            { 
              loading
                ? <MyLoader />
                :  imageResult &&
                    <div className="card mt-4">
                      <div className="card-header">
                        { getIdStatus() }
                      </div>
                      <div className="card-body">
                        <h5 className="card-title">{imageResult['FirstName']} {imageResult['MiddleName ']} {imageResult['LastName']}</h5>
                        <p className="card-text">Sex: {imageResult['Sex'] ? imageResult['Sex'] : 'N/A'}</p>
                        <p className="card-text">Address: {imageResult['Address']}, {imageResult['City']}, {imageResult['State']}</p>
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">ID Number: {imageResult['LicenseId'] ? imageResult['LicenseId'] : 'N/A'}</li>
                        <li className="list-group-item">Birth Date: {imageResult['BirthDate'] ? imageResult['BirthDate'] : 'N/A'}</li>
                        <li className="list-group-item">Issue Date: {imageResult['IssueDate'] ? imageResult['IssueDate'] : 'N/A'}</li>
                        <li className="list-group-item">Expire Date: {imageResult['ExpireDate'] ? imageResult['ExpireDate'] : 'N/A'}</li>
                      </ul>
                      <div className="card-body">
                        <button onClick={saveCustomer} type="button" className="btn btn-primary">Add to customer list</button>
                      </div>
                    </div>
            }
          </div>
          <div className="col-4">
            <img src={imageSource} alt="Upload your ID/Passport/Driver's lisence please" width="100%" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCustomer;
