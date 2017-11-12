import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, Radio, Checkbox, Button, Table, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import {
  getPeople,
  getLastID,
  deletePerson,
  addPersonToPeople,
} from './localStorage';
import { getYearDiff } from './time-util';
import TableHeader from './table-header';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      surName: '',
      familyName: '',
      birthDate: null,
      isMale: null,
      tableData: [],
      editMode: false,
      showMales: true,
      showAge: false,
      asc: true,
      sortHeaderIndex: 0,
    }
  }
  handleSubmit = (event) => {
    event.preventDefault();
    const {
      surName,
      familyName,
      birthDate,
      isMale,
    } = this.state;
    if (
      this.validateSurName() === 'success' &&
      this.validateFamilyName() === 'success' &&
      birthDate.length > 0
    ) {
      const personID = getLastID() + 1;
      addPersonToPeople({ personID, surName, familyName, birthDate, isMale });
      this.setState({
        surName: '',
        familyName: '',
        birthDate: null,
        isMale: null,
        tableData: getPeople(),
      })
      this.formNode.reset();
    } else {
      alert('You didn\'t fill every detail!');
    }
  }
  handleSurnameChange = (event) => {
    if (!event) return;
    this.setState({ surName: event.target.value });
  }
  handleFamilyNameChange = (event) => {
    if (!event) return;
    this.setState({ familyName: event.target.value });
  }
  handleBirthDateChange = (event) => {
    if (!event) return;
    getYearDiff(event.target.value);
    this.setState({ birthDate: event.target.value });
  }
  changeGender = (isMale) => {
    this.setState({ isMale });
  }
  changeShowGender = () => {
    this.setState({ showMales: !this.state.showMales });
  }
  toggleEditMode = () => {
    this.setState({ editMode: !this.state.editMode });
  }
  toggleAgeMode = () => {
    this.setState({ showAge: !this.state.showAge });
  }
  validateSurName = () => {
    const length = this.state.surName.length;
    if (length > 2) return 'success';
    else if (length > 0) return 'error';
  }
  validateFamilyName = () => {
    const length = this.state.familyName.length;
    if (length > 2) return 'success';
    else if (length > 0) return 'error';
  }
  FieldGroup = ({ id, label, validationState, help, ...props }) => {
    return (
      <FormGroup controlId={id} validationState={validationState}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props}/>
      </FormGroup>
    );
  }
  deleteRecord = (personID) => {
    deletePerson(personID);
    this.setState({
      tableData: getPeople(),
    })
  }
  createDeleteButton = (personID) => {
    return (
      <Button 
        bsStyle="danger"
        className="delete-button"
        onClick={() => this.deleteRecord(personID)}
      >
        x
      </Button>
    );
  }
  componentDidMount() {
    this.setState({
      tableData: getPeople(),
    })
  }
  render() {
    const {
      tableData,
      editMode,
      showMales,
      showAge,
      asc,
      sortHeaderIndex,
    } = this.state;
    const sortedTableData = tableData.sort((a, b) => {
      const surNameA = a.surName.toUpperCase();
      const surNameB = b.surName.toUpperCase();
      const familyNameA = a.familyName.toUpperCase();
      const familyNameB = b.familyName.toUpperCase();
      const ageA = getYearDiff(a.birthDate);
      const ageB = getYearDiff(b.birthDate);
      let slotA = surNameA;
      let slotB = surNameB;
      if (sortHeaderIndex === 1) {
        slotA = familyNameA;
        slotB = familyNameB;
      } else if (sortHeaderIndex === 2) {
        slotA = ageA;
        slotB = ageB;
      };
      if (slotA < slotB && asc) {
        return -1;
      } else if (slotA > slotB && !asc) {
        return -1;
      } else if (slotA > slotB && asc) {
        return 1;
      } else if (slotA < slotB && !asc) {
        return 1;
      };
      return 0;
    });
    const dataTable = sortedTableData.length > 0 ? 
    sortedTableData.map(entry => {
        if ((showMales && entry.isMale) || (!showMales && !entry.isMale)) {
          return (
            <tr key={Math.random()}>
              <td>{entry.surName}</td>
              <td>{entry.familyName}</td>
              <td>
                {showAge ? getYearDiff(entry.birthDate) : entry.birthDate}
                {editMode ? this.createDeleteButton(entry.personID) : null}
              </td>
            </tr>
          );
        }
        return null;
      })
    : null;
    const tableClassName = editMode ? 'data-table data-table-edit' : 'data-table';
    const tableHeaderArray = ['First Name', 'Last Name', showAge ? 'Age' : 'Birth Date'];
    const tableHeaders = tableHeaderArray.map((header, index) => (
      <TableHeader
        position={index}
        asc={asc}
        key={header+index}
        sortHeaderIndex={sortHeaderIndex}
        onClick={() => this.setState({
          sortHeaderIndex: index,
          asc: !asc,
        })}
      >
        {header}
      </TableHeader>
    ));
    return (
      <div className="app">
        <div className="form-container">
          <form
            className="custom-form"
            onSubmit={(ev) => this.handleSubmit(ev)}
            ref={(form) => this.formNode = form}
          >
            <this.FieldGroup
              id="formControlsSurname"
              type="text"
              label="Surname"
              placeholder="Enter Surname"
              validationState={this.validateSurName()}
              onChange={(ev) => this.handleSurnameChange(ev)}
            />
            <this.FieldGroup
              id="formControlsFamilyName"
              type="text"
              label="Family Name"
              placeholder="Enter Family Name"
              validationState={this.validateFamilyName()}
              onChange={(ev) => this.handleFamilyNameChange(ev)}
            />
            <FormGroup controlId="formBirthday">
              <ControlLabel>Birthday Date</ControlLabel>
              <FormControl
                type="date"
                placeholder="Enter Birthday Date"
                onChange={(ev) => this.handleBirthDateChange(ev)}
              />
            </FormGroup>
            <ControlLabel>Gender</ControlLabel>
            <div className="gender-control">
              <Radio name="radioGroup" inline onClick={() => this.changeGender(true)}>
                Male
              </Radio>
              {' '}
              <Radio name="radioGroup" inline onClick={() => this.changeGender(false)}>
                Female
              </Radio>
            </div>
            <Button
              bsStyle="primary"
              className="submit-button"
              type="submit">
            Submit
            </Button>
          </form>
        </div>
        <div className="data-table-container">
          <div className="table-options">
            <div className="show-gender-control">
              <ToggleButtonGroup type="radio" name="options" defaultValue={1}>
                <ToggleButton value={1} onChange={() => this.changeShowGender()}>
                  Males
                </ToggleButton>
                <ToggleButton value={2} onChange={() => this.changeShowGender()}>
                  Females
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            <span className="show-age-control">
              <Checkbox 
                inline={true}
                onClick={() => this.toggleAgeMode()}
              >
                Show Age
              </Checkbox>
            </span>
            <ToggleButtonGroup type="checkbox" className="deletion-mode-option">
              <ToggleButton value={1} onChange={() => this.toggleEditMode()}>
                Edit Mode
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
          <Table striped bordered condensed hover className={tableClassName}>
            <thead>
              <tr>
                {tableHeaders}
              </tr>
            </thead>
            <tbody>
              {dataTable}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default App;
