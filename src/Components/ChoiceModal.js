import React, { Component } from 'react';
import firebase from '../firebase.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/choiceModal.css';

const MySwal = withReactContent(Swal);

library.add(faTimesCircle);

class ChoiceModal extends Component {
  constructor(props) {
    super(props);
    //setting initial state
    this.state = {
      lists: []
    };
  }

  // connecting to firebase, getting user's list names, creating a temporary array to hold the names, and setting state to the new temporary array
  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on('value', res => {
      const response = res.val();
      let tempArray = [];
      for (let object in response) {
        tempArray.push(response[object].name);
      }
      this.setState({
        lists: tempArray
      });
    });
  }

  //user selects list to add movie to a specific list. Then go through each object in database response, checking to see if list names match, once we get to the list name that is the same as the list name we clicked on, we set matched object equal to the key of the same name - and then push the movie to the specific list.
  chosenList = listName => {
    const dbRef = firebase.database().ref();
    let matchedObject = '';
    let tempObject = {};
    let response;

    tempObject = {
      id: this.props.movieId,
      name: this.props.title,
      poster: this.props.poster,
      duration: this.props.duration,
      genre: this.props.genre
    };

    dbRef.on('value', res => {
      response = res.val();

      for (let object in response) {
        if (response[object].name === listName) {
          matchedObject = object;
        }
      }
    });
    const listRef = dbRef.child(matchedObject);
    listRef
      .child('movies')
      .child(this.props.movieId)
      .set(tempObject);

    //close modal on click
    this.confirmAlert();
    this.props.handleClose("showChoice");
  };

  confirmAlert = () => {
    MySwal.fire({
      title: <p>Hello World</p>,
      footer: 'Copyright 2018',
      onOpen: () => {
        // `MySwal` is a subclass of `Swal`
        //   with all the same instance & static methods
        MySwal.clickConfirm();
      }
    }).then(() => {
      return MySwal.fire({
        position: 'top-end',
        type: 'success',
        title: 'Movie added',
        showConfirmButton: false,
        timer: 1500,
        width: '25rem'
      });
    });
  };

  //print user's lists to screen
  //icon to close modal
  //calling this.props.handleClose from the MoreInfo page
  render() {
    return (
      <div className='mask'>
        <div className='mojal'>
          <div className='closeIcon'>
            <FontAwesomeIcon
              icon='times-circle'
              onClick={() => { this.props.handleClose('showChoice') }}
            />
          </div>
          <h3>
            Where do you want to add
            <span className='modalTitle'> {this.props.title}</span>?
          </h3>
          <ul>
            {this.state.lists.map(list => {
              return (
                <li
                  onClick={() => {
                    this.chosenList(list);
                  }}
                >
                  {list.replace(/-/g, ' ')}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default ChoiceModal;
