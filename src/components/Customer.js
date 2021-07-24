import React, { useState, useEffect } from "react";
import CustomerDataService from "../services/CustomerService";

const Customer = props => {
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [message, setMessage] = useState("");

  const getCustomer = id => {
    CustomerDataService.get(id)
      .then(response => {
        setCurrentCustomer(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getCustomer(props.match.params.id);
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentCustomer({ ...currentCustomer, [name]: value });
  };

  const updateCustomer = () => {
    CustomerDataService.update(currentCustomer.id, currentCustomer)
      .then(response => {
        console.log(response.data);
        setMessage("The customer was updated successfully!");
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteCustomer = () => {
    CustomerDataService.remove(currentCustomer.id)
      .then(response => {
        console.log(response.data);
        props.history.push("/customers");
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {currentCustomer ? (
        <div className="edit-form">
          <h4>Customer</h4>
          <form>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                value={currentCustomer.first_name ? currentCustomer.first_name : ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="middle_name">Middle Name</label>
              <input
                type="text"
                className="form-control"
                id="middle_name"
                name="middle_name"
                value={currentCustomer.middle_name ? currentCustomer.middle_name : ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                value={currentCustomer.last_name ? currentCustomer.last_name : ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="id_number">ID Number</label>
              <input
                type="text"
                className="form-control"
                id="id_number"
                name="id_number"
                value={currentCustomer.id_number}
                onChange={handleInputChange}
              />
            </div>
          </form>

          <button className="badge badge-danger mr-2" onClick={deleteCustomer}>
            Delete
          </button>

          <button
            type="submit"
            className="badge badge-success"
            onClick={updateCustomer}
          >
            Update
          </button>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Customer...</p>
        </div>
      )}
    </div>
  );
};

export default Customer;
