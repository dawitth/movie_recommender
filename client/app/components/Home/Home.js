import React, { Component } from 'react';
import 'whatwg-fetch';


import { Redirect, browserHistory } from 'react-router';


import HelloWorld from '../HelloWorld/HelloWorld';


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      counters: [],
      redirect: false
    };


    

    
    this.setRedirect = this.setRedirect.bind(this);
    this.newCounter = this.newCounter.bind(this);
    this.incrementCounter = this.incrementCounter.bind(this);
    this.decrementCounter = this.decrementCounter.bind(this);
    this.deleteCounter = this.deleteCounter.bind(this);

    this._modifyCounter = this._modifyCounter.bind(this);
  }

  setRedirect() {
    this.setState({
      redirect : true
    })


  }

  renderRedirect(){
      if (this.state.redirect) {
      return <Redirect to='/target' />
    }
  }


  componentDidMount() {
    fetch('/api/counters')
      .then(res => res.json())
      .then(json => {
        this.setState({
          counters: json
        });
      });
  }

  newCounter() {

    fetch('/api/counters', { method: 'POST' })
      .then(res => res.json())
      .then(json => {
        let data = this.state.counters;
        data.push(json);
        
        this.setState({

          counters: data
        });
      });
  }

  incrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/increment`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  decrementCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}/decrement`, { method: 'PUT' })
      .then(res => res.json())
      .then(json => {
        this._modifyCounter(index, json);
      });
  }

  deleteCounter(index) {
    const id = this.state.counters[index]._id;

    fetch(`/api/counters/${id}`, { method: 'DELETE' })
      .then(_ => {
        this._modifyCounter(index, null);
      });
  }

  _modifyCounter(index, data) {
    let prevData = this.state.counters;

    if (data) {
      prevData[index] = data;
    } else {
      prevData.splice(index, 1);
    }

    this.setState({
      counters: prevData
    });
  }

  render() {
    return (
      <>

        <p>movie recommender:</p>
        <p>Select your favourite movies below</p>
        <button onClick={() => this.incrementCounter(i)}>Movie1</button>
        <button onClick={() => this.incrementCounter(i)}>Movie2</button>
        <button onClick={() => this.incrementCounter(i)}>Movie3</button>
        <button onClick={() => this.incrementCounter(i)}>Movie4</button>
        <button onClick={() => this.incrementCounter(i)}>Movie5</button>
        <button onClick={() => this.incrementCounter(i)}>Movie6</button>
        

        <div>
        {this.renderRedirect()}
        <button onClick={this.setRedirect}>Redirect</button>
       </div>



        <ul>
          { this.state.counters.map((counter, i) => (
            <li key={i}>
              <span>{counter.count} </span>
              <button onClick={() => this.incrementCounter(i)}>+</button>
              <button onClick={() => this.decrementCounter(i)}>-</button>
              <button onClick={() => this.deleteCounter(i)}>x</button>
            </li>
          )) }
        </ul>

        <button onClick={this.newCounter}>New counter</button>
      </>
    );
  }
}

export default Home;
