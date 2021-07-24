import React, { useState, useEffect, useMemo, useRef } from "react";
import CustomerDataService from "../services/CustomerService";
import { useTable } from "react-table";

const CustomersList = (props) => {
  const [customers, setCustomers] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const customersRef = useRef();

  customersRef.current = customers;

  useEffect(() => {
    retrieveCustomers();
  }, []);

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const retrieveCustomers = () => {
    CustomerDataService.getAll()
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrieveCustomers();
  };

  const removeAllCustomers = () => {
    CustomerDataService.removeAll()
      .then((response) => {
        console.log(response.data);
        refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const findByName = () => {
    CustomerDataService.findByName(searchTitle)
      .then((response) => {
        setCustomers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  

  const columns = useMemo(
    () => {
      const openCustomer = (rowIndex) => {
        const id = customersRef.current[rowIndex].id;

        props.history.push("/customers/" + id);
      };

      const deleteCustomer = (rowIndex) => {
        const id = customersRef.current[rowIndex].id;

        CustomerDataService.remove(id)
          .then((response) => {
            props.history.push("/customers");

            let newCustomers = [...customersRef.current];
            newCustomers.splice(rowIndex, 1);

            setCustomers(newCustomers);
          })
          .catch((e) => {
            console.log(e);
          });
      };

      return [
        {
          Header: "First Name",
          accessor: "first_name",
        },
        {
          Header: "Middle Name",
          accessor: "middle_name",
        },
        {
          Header: "Last Name",
          accessor: "last_name",
        },
        {
          Header: "Birth Date",
          accessor: "birth_date",
          Cell: (props) => {
            return props.value ? new Date(props.value).toISOString().split('T')[0] : '';
          },
        },
        {
          Header: "ID Number",
          accessor: "id_number",
        },
        {
          Header: "ID Issue Date",
          accessor: "id_issue_date",
          Cell: (props) => {
            return props.value ? new Date(props.value).toISOString().split('T')[0] : '';
          },
        },
        {
          Header: "ID Expire Date",
          accessor: "id_expire_date",
          Cell: (props) => {
            return props.value ? new Date(props.value).toISOString().split('T')[0] : '';
          },
        },
        {
          Header: "Status",
          accessor: "published",
          Cell: (props) => {
            const expire_date = props.row.values.id_expire_date
            if (expire_date && new Date(expire_date) >= new Date()) {
              return 'Valid'
            } else if(expire_date) {
              return 'Expired'
            } else {
              return 'Invalid'
            }
          },
        },
        {
          Header: "Actions",
          accessor: "actions",
          Cell: (props) => {
            const rowIdx = props.row.id;
            return (
              <div>
                <span onClick={() => openCustomer(rowIdx)}>
                  <i className="far fa-edit action mr-2"></i>
                </span>

                <span onClick={() => deleteCustomer(rowIdx)}>
                  <i className="fas fa-trash action"></i>
                </span>
              </div>
            );
          },
        },
      ]
    },
    [props.history]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: customers,
  });

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Name"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-12 list">
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="col-md-8">
        <button className="btn btn-sm btn-danger" onClick={removeAllCustomers}>
          Remove All
        </button>
      </div>
    </div>
  );
};

export default CustomersList;
