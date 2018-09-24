import React, { Component } from "react";
import { Route } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from 'axios'; 
import AddNote from "./components/AddNote";
import NotesView from "./components/NotesView";
import Note from "./components/Note";
import Edit from "./components/Edit";
import "./App.css";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      id: null,
      title: "",
      note: ""
    };
  }

  componentDidMount() {

    axios.get('http://localhost:5000/notes')
      .then(notes => {
        this.setState({notes: notes.data.notes}); 
      })
      .catch(err => {
        console.log(err); 
      });
    
 }

  inputHandler = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSaveHandler = e => {
    e.preventDefault();

    let notes = {
      title: this.state.title,
      note: this.state.note
    };

    axios.post('http://localhost:5000/notes', notes)
      .then(notes => {
        this.setState({notes: notes.data.notes}); 
      })
      .catch(err => {
        console.log(err); 
      });
  };

  inputHandlerUpdate = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onUpdateHandler = (e, id) => {
    e.preventDefault();

    let edit = {
      title: this.state.title,
      note: this.state.note
    };

    axios.put(`http://localhost:5000/notes/${id}`, edit)
      .then(notes => {
        return (axios.get('http://localhost:5000/notes')
          .then(notes => {
            this.setState({notes: notes.data.notes}); 
          })
          .catch(err => {
            console.log(err); 
          }));
        })
      .catch(err => {
        console.log(err); 
        });
 };



  deleteHandler = (e, id) => {
    e.preventDefault();
    
    axios.delete(`http://localhost:5000/notes/${id}`)
      .then(notes => {
        return (axios.get('http://localhost:5000/notes')
          .then(notes => {
            this.setState({notes: notes.data.notes}); 
          })
          .catch(err => {
            console.log(err); 
        }));
      })
      .catch(err => {
        console.log(err); 
      });  
      
  };

  render() {
    console.log("app state", this.state.notes);
    return (
      <div className="app">
        <div className="navbar">
          <div className="navbar-title">Lambda Notes</div>
          <NavLink className="navlink" exact to="/">
            View Your Notes
          </NavLink>
          <NavLink className="navlink" to="/add-note">
            + Create New Note
          </NavLink>
        </div>

        <div className="notesbody">
          <Route
            exact
            path="/"
            render={props => <NotesView {...props} notes={this.state.notes} />}
          />

          <Route
            path="/add-note"
            render={props => (
              <AddNote
                {...props}
                inputHandler={this.inputHandler}
                onSaveHandler={this.onSaveHandler}
              />
            )}
          />

          <Route
            path="/note/:id"
            render={props => (
              <Note
                {...props}
                notes={this.state.notes}
                deleteHandler={this.deleteHandler}
              />
            )}
          />

          <Route
            path="/edit/:id"
            render={props => (
              <Edit
                {...props}
                notes={this.state.notes}
                inputHandlerUpdate={this.inputHandlerUpdate}
                onUpdateHandler={this.onUpdateHandler}
              />
            )}
          />
        </div>
      </div>
    );
  }
}