import React, {Component} from 'react';
import * as API from '../api/API';
import '../Login.css';
import PropTypes from 'prop-types';
import dropbox from "./dropboxplus.gif";
import {connect} from 'react-redux';
import {Row,Col,ListGroupItem} from 'react-bootstrap';
import {afterlogin} from "../actions/index";
import { Route, withRouter } from 'react-router-dom';
import Header from "./Header";

class UserDetails extends Component {

    componentWillMount(){
        const data=localStorage.getItem("email")
        API.getState(data)
            .then((res) => {
                console.log(res)
                if (res.status == 201) {
                    this.props.afterlogin(res.userdetails);
                    console.log("Success...")

                }else if (res.status == 401) {
                    this.setState({

                        message: "Folder error"
                    });
                }
            });
    }

    render() {

        return (
            <div>
                <Header/>
            <div className="jumbotron">

            <div className="container-fluid row justify-content-md-center">

                <div className="account-wall col-md-7">
                    <div className="col-md-12">

                        <h2>User Details</h2>

                        <table className="table table-user-information ">
                            <tbody >
                            <tr>
                                <td>First Name:</td>
                                <td>{this.props.userdata.firstName}</td>
                            </tr>


                                <tr>
                                    <td>Last Name:</td>
                                    <td>{this.props.userdata.lastName}</td>
                                </tr>
                                <tr>
                                    <td>Email:</td>
                                    <td>{this.props.userdata.email}</td>
                                </tr>
                                <tr>
                                    <td>Contact Number:</td>
                                    <td>{this.props.userdata.contactNo}</td>
                                </tr>
                            <tr>
                                <td>Interests:</td>

                                <td><textarea type="text" className="form-control" placeholder="" required
                                        value={this.props.userdata.interests}      onChange={(event) => {
                                                  this.setState({
                                                      password: event.target.value
                                                  });
                                              }}/>
                                </td>

                            </tr>

                            </tbody>
                        </table>

                        <br/>

                        <div className="row justify-content-md-center">
                            <div className="col-md-5">
                                <button className="btn btn-primary" type="submit"
                                        onClick={() => this.props.login(this.state)}>
                                    Save
                                </button>
                            </div>
                            <div className="col-md-5">
                                <button className="btn btn-primary" type="submit"
                                        onClick={() => this.props.history.push("/files")}>
                                    Back
                                </button>
                            </div>
                        </div>

                    </div>

                </div>



            </div>

            </div>
            </div>
        );
    }
}


function mapStateToProps(userdata) {
console.log(userdata);
    return {userdata};
}

function mapDispatchToProps(dispatch) {
    return {
       // updateUser : (data) => dispatch(updateUser(data)),
        afterlogin : (data) => dispatch(afterlogin(data))
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserDetails));