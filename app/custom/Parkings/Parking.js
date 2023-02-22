import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'enl-api/dummy/brand';
import { injectIntl } from 'react-intl';
import MUIDataTable from 'mui-datatables';
import { withStyles } from '@material-ui/core/styles';
import {
  Button, IconButton, Tooltip, TextField, DialogActions, Dialog, InputLabel, MenuItem, FormControl, Select,
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

const url = 'https://pb.kwad.in/api/parkings'

function Parking(props) {
  const title = brand.name + ' - Parkings';
  const description = brand.desc;
  const { classes } = props;
  const [add, setAdd] = useState(false);
  const [addData, setAddData] = useState(
    {
      name: '',
      area: 0,
      placeType: 0,
      city: '',
      pin: '',
      state: '',
      address: '',
    })
  const [edit, setEdit] = useState(false);
  const [editData, setEditData] = useState(
    {
      id: 0,
      name: '',
      area: 0,
      placeType: 0,
      city: '',
      pin: '',
      state: '',
      address: '',
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
        "name": addData.name,
        "area": addData.area,
        "placeType": addData.placeType,
        "city": addData.city,
        "state": addData.state,
        "pin": addData.pin,
        "address": addData.address,
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
        "name": editData.name,
        "area": editData.area,
        "placeType": editData.placeType,
        "city": editData.city,
        "state": editData.state,
        "pin": editData.pin,
        "address": editData.address,
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

  const columns = [
    {
      label: 'ID',
      name: 'id',
      options: {
        filter: false
      }
    },
    {
      label: 'Name',
      name: 'name',
      options: {
        filter: false
      }
    },
    {
      label: 'Place',
      name: 'placeType',
      options: {
        filter: true,
      }
    },
    {
      label: 'Area',
      name: 'area',
      options: {
        filter: true
      }
    },
    {
      label: 'City',
      name: 'city',
      options: {
        filter: true
      }
    },
    {
      label: 'State',
      name: 'state',
      options: {
        filter: true
      }
    },
    {
      label: 'PIN',
      name: 'pin',
      options: {
        filter: false
      }
    },
    {
      label: 'Address',
      name: 'address',
      options: {
        filter: false,
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
                    const a = area.filter(entry => {if(entry.area === data[tableMeta.rowIndex].area) return entry })
                    const p = placeType.filter(entry => {if(entry.type === data[tableMeta.rowIndex].placeType) return entry.id})
                    editData.id = data[tableMeta.rowIndex].id
                    editData.name = data[tableMeta.rowIndex].name
                    editData.area = a[0].id
                    editData.placeType = p[0].id
                    editData.city = data[tableMeta.rowIndex].city
                    editData.state = data[tableMeta.rowIndex].state
                    editData.pin = data[tableMeta.rowIndex].pin
                    editData.address = data[tableMeta.rowIndex].address
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

  const [data, setData] = useState();
  const [area, setArea] = useState();
  const [placeType, setPlaceType] = useState();

  const getApiData = async () => {
    const response = await fetch(url).then((response) => response.json());
    const areas = await fetch('https://pb.kwad.in/api/areas').then((response) => response.json());
    const placeTypes = await fetch('https://pb.kwad.in/api/placeType').then((response) => response.json());

    // update the state
    setData(response);
    setArea(areas);
    setPlaceType(placeTypes);
  };

  useEffect(() => {
    getApiData();
  }, []);

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

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
      </Helmet>
      <div className={classes.table}>
        {data &&
          <MUIDataTable
            title="List of Parkings"
            data={data}
            columns={columns}
            options={options}
          />
        }

        <Dialog fullWidth maxWidth="sm"
          open={add}
          onClose={handleClose} >
          <DialogTitle id="alert-dialog-title">
            {"Add New Parking"}
          </DialogTitle>
          <DialogContent>
            <TextField id="name" label="Name" variant="outlined" fullWidth required
              onChange={(e) => {
                addData.name = e.target.value
              }} />
            <FormControl fullWidth>
              <InputLabel id="area-label">Area</InputLabel>
              <Select
                labelId="area-label"
                id="area"
                label="Area"
                defaultValue = ""
                onChange={(e) => {
                  addData.area = e.target.value
                }}
              >
                {area && area.map(e => (<MenuItem value={e.id}>{e.area}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="placeType-label">Place</InputLabel>
              <Select
                labelId="placeType-label"
                id="placeType"
                label="Place"
                defaultValue = ""
                onChange={(e) => {
                  addData.placeType = e.target.value
                }}
              >
                {placeType && placeType.map(e => (<MenuItem value={e.id}>{e.type}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField id="city" label="city" variant="outlined" fullWidth required
              onChange={(e) => {
                addData.city = e.target.value
              }} />
            <TextField id="state" label="State" variant="outlined" fullWidth required
              onChange={(e) => {
                addData.state = e.target.value
              }} />
              <TextField id="address" label="Address" variant="outlined" fullWidth required
              onChange={(e) => {
                addData.address = e.target.value
              }} />
            <TextField id="pin" label="PIN" variant="outlined" fullWidth required
              onChange={(e) => {
                addData.pin = e.target.value
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
            {"Edit Parking"}
          </DialogTitle>
          <DialogContent>
            <TextField id="name" label="Name" variant="outlined" fullWidth required defaultValue={editData.name}
              onChange={(e) => {
                editData.name = e.target.value
              }} />
            
            <FormControl fullWidth>
              <InputLabel id="area-label">Area</InputLabel>
              <Select
                labelId="area-label"
                id="area"
                defaultValue={editData.area}
                label="Area"
                onChange={(e) => {
                  editData.area = e.target.value
                }}
              >
                {area && area.map(e => (<MenuItem value={e.id}>{e.area}</MenuItem>))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="placeType-label">Place</InputLabel>
              <Select
                labelId="placeType-label"
                id="placeType"
                defaultValue={editData.placeType}
                label="Place"
                onChange={(e) => {
                  editData.placeType = e.target.value
                }}
              >
                {placeType && placeType.map(e => (<MenuItem value={e.id}>{e.type}</MenuItem>))}
              </Select>
            </FormControl>
            <TextField id="city" label="City" variant="outlined" fullWidth required defaultValue={editData.city}
              onChange={(e) => {
                editData.city = e.target.value
              }} />
            <TextField id="state" label="State" variant="outlined" fullWidth required defaultValue={editData.state}
              onChange={(e) => {
                editData.state = e.target.value
              }} />
            <TextField id="pin" label="PIN" variant="outlined" fullWidth required defaultValue={editData.pin}
              onChange={(e) => {
                editData.pin = e.target.value
              }} />
              <TextField id="address" label="Address" variant="outlined" fullWidth required defaultValue={editData.address}
              onChange={(e) => {
                editData.address = e.target.value
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
            {"Delete Parking"}
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
    </div>
  );
}

Parking.propTypes = {
  intl: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

export default injectIntl(withStyles(styles)(Parking));
