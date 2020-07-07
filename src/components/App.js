import React, { Component } from 'react';
import '../css/App.css';

import { without, findIndex } from 'lodash';
import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';

class App extends Component {
  constructor() {
    super();
    this.state = {
      myAppointments: [],
      formDisplay: false,
      lastIndex: 0,
      orderBy: 'petName',
      orderDir: 'desc',
      queryText: '',
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointments = this.addAppointments.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  updateInfo(name, value, id) {
    const tempApts = this.state.myAppointments;
    const aptIndex = findIndex(this.state.myAppointments, {
      aptId: id,
    });
    tempApts[aptIndex][name] = value;
    this.setState({
      myAppointments: tempApts,
    });
  }

  changeOrder(order, dir) {
    this.setState({
      orderBy: order,
      orderDir: dir,
    });
  }

  searchApts(query) {
    this.setState({
      queryText: query,
    });
  }

  addAppointments(apt) {
    const tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1,
    });
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay,
    });
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);
    this.setState({
      myAppointments: tempApts,
    });
  }

  componentDidMount() {
    fetch('./data.json')
      .then((response) => response.json())
      .then((result) => {
        const apts = result.map((item) => {
          item.aptId = this.state.lastIndex;
          this.setState({
            lastIndex: this.state.lastIndex + 1,
          });
          return item;
        });
        this.setState({
          myAppointments: apts,
        });
      });
  }

  render() {
    let order;
    let filteredApts = this.state.myAppointments;
    if (this.state.orderDir === 'asc') {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts
      .sort((a, b) => {
        if (
          a[this.state.orderBy].toLowerCase()
          < b[this.state.orderBy].toLowerCase()
        ) {
          return -1 * order;
        }
        return 1 * order;
      })
      .filter((eachItem) => (
        eachItem.petName
          .toLowerCase()
          .includes(this.state.queryText.toLocaleLowerCase())
          || eachItem.ownerName
            .toLowerCase()
            .includes(this.state.queryText.toLocaleLowerCase())
          || eachItem.aptNotes
            .toLowerCase()
            .includes(this.state.queryText.toLocaleLowerCase())
      ));

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointments={this.addAppointments}
                />
                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts}
                />
                <ListAppointments
                  appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo={this.updateInfo}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
