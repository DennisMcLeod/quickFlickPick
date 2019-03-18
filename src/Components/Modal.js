import React, { Component } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import firebase from "firebase";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "../styles/modal.css";

const MySwal = withReactContent(Swal);

library.add(faTimesCircle);

class Modal extends Component {
  constructor(props) {
    super(props);
    //setting initial state
    this.state = {
      name: "",
      movies: []
    };
  }

  // Sweet alert to confirm list has been successfully created
  confirmAlert = () => {
    MySwal.fire({
      onOpen: () => {
        // `MySwal` is a subclass of `Swal`
        //   with all the same instance & static methods
        MySwal.clickConfirm();
      }
    }).then(() => {
      return MySwal.fire({
        position: "top-end",
        type: "success",
        title: "List created",
        showConfirmButton: false,
        timer: 1500,
        width: "25rem",
        toast: true
      });
    });
  };

  // Sweet alert for when a duplicate list is entered
  duplicateAlert = () => {
    MySwal.fire({
      onOpen: () => {
        // `MySwal` is a subclass of `Swal`
        //   with all the same instance & static methods
        MySwal.clickConfirm();
      }
    }).then(() => {
      return MySwal.fire({
        position: "top-end",
        type: "error",
        title: "Duplicate list name",
        showConfirmButton: false,
        timer: 1500,
        width: "25rem"
      });
    });
  };

  // Sweet alert for when an unnamed list is entered
  emptyListNameAlert = () => {
    MySwal.fire({
      onOpen: () => {
        // `MySwal` is a subclass of `Swal`
        //   with all the same instance & static methods
        MySwal.clickConfirm();
      }
    }).then(() => {
      return MySwal.fire({
        position: "top-end",
        type: "error",
        title: "Please enter list name",
        showConfirmButton: false,
        timer: 1500,
        width: "25rem"
      });
    });
  };
  //creating event to set state of name to the value the user enters.
  handleChange = event => {
    this.setState({
      name: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      //removing spaces from listnames to use in URL
      name: this.state.name.replace(/\s+/g, "-").toLowerCase()
    });
    //conditional, if name is not an empty string, grab data from firebase
    if (this.state.name !== "") {
      const dbRef = firebase.database().ref();
      dbRef.once("value").then(res => {
        const response = res.val();
        let duplicate = false;
        //error handling re: case sensitive
        for (let object in response) {
          if (
            this.state.name.toLowerCase() ===
            response[object].name.toLowerCase()
          ) {
            //alert user if the list name already exists
            duplicate = true;
            this.duplicateAlert();
          }
        }
        //if it's not a duplicate list name, push to database
        if (duplicate === false) {
          dbRef.push(this.state);
          this.confirmAlert();
        }
        this.setState({
          name: ""
        });
        this.props.handleClose("showCreate");
      });
    } else {
      this.emptyListNameAlert();
    }
  };

  //close modal on click, calling props to pass handle close
  //user enters list name on change call handle change
  render() {
    return (
      <div className="clearfix">
        <div className="mask">
          <div className="mojal">
            <FontAwesomeIcon
              className="modalClose"
              icon="times-circle"
              onClick={() => {this.props.handleClose('showCreate')}}
            />
            <form onSubmit={this.handleSubmit}>
              <label htmlFor="text" className="visuallyHidden">
                Enter List Name
              </label>
              <input
                onChange={this.handleChange}
                value={this.state.name}
                type="text"
                id="text"
                name="name"
                placeholder="Enter new list name"
              />
              <label htmlFor="submit" className="visuallyHidden">
                Create List
              </label>
              <input
                className="buttonStyle"
                type="submit"
                id="submit"
                value="Create list"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default Modal;