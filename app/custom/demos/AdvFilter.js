import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import MUIDataTable from 'mui-datatables';
import {
  Button, IconButton, Tooltip, TextField, DialogActions, Dialog,
  DialogContent, DialogTitle, DialogContentText
} from '@material-ui/core';
import { Add, Delete, Edit } from '@material-ui/icons';

const styles = theme => ({
  table: {
    '& > div': {
      overflow: 'auto'
    },
    '& table': {
      '& td': {
        wordBreak: 'keep-all'
      },
      [theme.breakpoints.down('md')]: {
        '& td': {
          height: 60,
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }
    }
  }
});
/*
  It uses npm mui-datatables. It's easy to use, you just describe columns and data collection.
  Checkout full documentation here :
  https://github.com/gregnb/mui-datatables/blob/master/README.md
*/
const url = 'https://pb.kwad.in/api/users'

function AdvFilter(props) {
  const [data, setData] = useState();
  const [add, setAdd] = useState(false);
  const [addData, setAddData] = useState(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      mobile: '',
    })
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(
    {
      id: 0,
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
    })
  const [del, setDelete] = useState(false);
  const [delData, setDelData] = useState({ id: 0 })

  const handleAdd = () => {
    setAdd(true);
  };

  const handleClose = () => {
    setAdd(false);
    setEdit(false);
    setDelete(false);
  };
  const submitAdd = () => {
    fetch(url, {
      method: 'post',
      body: JSON.stringify({
        "firstName": addData.firstName,
        "lastName": addData.lastName,
        "email": addData.email,
        "password": addData.password,
        "mobile": addData.mobile,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => getUpdatedApiData())
    setAdd(false);
  }
  const submitEdit = () => {
    fetch(url + '/edit', {
      method: 'post',
      body: JSON.stringify({
        "id": editData.id,
        "firstName": editData.firstName,
        "lastName": editData.lastName,
        "email": editData.email,
        "mobile": editData.mobile,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => getUpdatedApiData())
    setEdit(false);
  }
  const submitDelete = () => {
    fetch(url + '/delete', {
      method: 'post',
      body: JSON.stringify({
        "id": delData.id
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((res) => getUpdatedApiData())
    setDelete(false);
  }

  const getUpdatedApiData = () => {
    fetch(url).then((response) => response.json()).then((data) => setData(data));
  };

  const getApiData = async () => {
    const response = await fetch(url).then((response) => response.json());

    // update the state
    setData(response);
  };

  useEffect(() => {
    getApiData();
  }, []);

  const columns = [
    {
      label: 'ID',
      name: 'id',
      options: {
        filter: false
      }
    },
    {
      label: 'First Name',
      name: 'firstName',
      options: {
        filter: true
      }
    },
    {
      label: 'Last Name',
      name: 'lastName',
      options: {
        filter: true
      }
    },
    {
      label: 'Email',
      name: 'email',
      options: {
        filter: true,
      }
    },
    {
      label: 'Mobile',
      name: 'mobile',
      options: {
        filter: false,
      }
    },
    {
      label: 'Status',
      name: 'status',
      options: {
        filter: true,
        customBodyRender: (value) => {
          if (value === 'active') {
            return (<Chip label="Active" color="secondary" />);
          }
          if (value === 'non-active') {
            return (<Chip label="Non Active" color="primary" />);
          }
          return (<Chip label="Unknown" />);
        }
      }
    },
    {
      label: 'Block',
      name: 'isBlocked',
      options: {
        filter: true,
        customBodyRender: (value) => {
          if (value === 'true') {
            return (<Chip label="Unblock" color="secondary" />);
          }
          if (value === 'false') {
            return (<Chip label="Block" color="primary" />);
          }
          return (<Chip label="Unknown" />);
        }
      }
    },
    {
      name: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              <span>
                <Tooltip title={"Edit"}>
                  <IconButton onClick={() => {
                    setEdit(true);
                    editData.id = data[tableMeta.rowIndex].id
                    editData.firstName = data[tableMeta.rowIndex].firstName
                    editData.lastName = data[tableMeta.rowIndex].lastName
                    editData.email = data[tableMeta.rowIndex].email
                    editData.mobile = data[tableMeta.rowIndex].mobile
                  }}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              </span>
              <span>
                <Tooltip title={"Delete"}>
                  <IconButton onClick={() => {
                    setDelete(true);
                    delData.id = data[tableMeta.rowIndex].id
                  }}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </span>
            </div>
          )
        }
      }
    },
  ];

  const options = {
    filterType: 'dropdown',
    responsive: 'vertical',
    print: true,
    rowsPerPage: 10,
    page: 0,
    customToolbar: () => {
      return (
        <span>
          <Tooltip title={"Add Type"}>
            <IconButton onClick={handleAdd}>
              <Add />
            </IconButton>
          </Tooltip>
        </span>
      )
    },
    selectableRows: 'none'
  };

  const { classes } = props;

  return (
    <div className={classes.table}>
      {data &&
        <MUIDataTable
          title="Users list"
          data={data}
          columns={columns}
          options={options}
        />
      }

      <Dialog fullWidth maxWidth="sm"
        open={add}
        onClose={handleClose} >
        <DialogTitle id="alert-dialog-title">
          {"Add New User"}
        </DialogTitle>
        <DialogContent>
          <TextField id="firstName" label="First Name" variant="outlined" fullWidth required
            onChange={(e) => {
              addData.firstName = e.target.value
            }} />
          <TextField id="lastName" label="Last Name" variant="outlined" fullWidth required
            onChange={(e) => {
              addData.lastName = e.target.value
            }} />
          <TextField id="email" label="Email" type="email" variant="outlined" fullWidth required
            onChange={(e) => {
              addData.email = e.target.value
            }} />
          <TextField id="password" label="Password" type="password" variant="outlined" fullWidth required
            onChange={(e) => {
              addData.password = e.target.value
            }} />
          <TextField id="mobile" label="Mobile" variant="outlined" fullWidth required
            onChange={(e) => {
              addData.mobile = e.target.value
            }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={submitAdd}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth="sm"
        open={edit}
        onClose={handleClose} >
        <DialogTitle id="alert-dialog-title">
          {"Edit User"}
        </DialogTitle>
        <DialogContent>
          <TextField id="firstName" label="First Name" variant="outlined" fullWidth required defaultValue={editData.firstName}
            onChange={(e) => {
              editData.firstName = e.target.value
            }} />
          <TextField id="lastName" label="Last Name" variant="outlined" fullWidth required defaultValue={editData.lastName}
            onChange={(e) => {
              editData.lastName = e.target.value
            }} />
          <TextField id="email" label="Email" variant="outlined" fullWidth required defaultValue={editData.email}
            onChange={(e) => {
              editData.email = e.target.value
            }} />
          <TextField id="mobile" label="Mobile" variant="outlined" fullWidth required defaultValue={editData.mobile}
            onChange={(e) => {
              editData.mobile = e.target.value
            }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={submitEdit}>Edit</Button>
        </DialogActions>
      </Dialog>

      <Dialog fullWidth maxWidth="sm"
        open={del}
        onClose={handleClose} >
        <DialogTitle id="alert-dialog-title">
          {"Delete User"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

AdvFilter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AdvFilter);
