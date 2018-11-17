import React, { Component } from 'react';
import 'whatwg-fetch';

import Cards, { Card } from 'react-swipe-card'


import { Redirect, browserHistory } from 'react-router';


import HelloWorld from '../HelloWorld/HelloWorld';



const Wrapper = ({data, onSwipeLeft, onSwipeRight}) => {
  return (
    <Cards onEnd={console.log("action('end')")} className='master-root'>
      {data.map(item =>
        <Card
          key={item}
          onSwipeLeft={() => onSwipeLeft(item)}
          onSwipeRight={() => onSwipeRight(item)}>
          <h2>{item}</h2>
        </Card>
      )}
    </Cards>
  )
}


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
      return <Redirect to='../SecondPage/SecondPage' />
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

        <p>Movie Match:</p>
       

        <div>
        {this.renderRedirect()}
        <button onClick={this.setRedirect}>Select movies</button>
       </div>



      </>
    );
  }
}

export default Home;
