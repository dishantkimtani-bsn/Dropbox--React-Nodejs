import React, {Component} from 'react';
import * as API from '../api/API';
import FileGridList from "./FileGridList";
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import {connect} from 'react-redux';
import {addFile} from "../actions/index";
import {deleteFile} from "../actions/index";
import RightNavBar from "./RightNavBar";
import LeftNavBar from "./LeftNavBar";
import {afterlogin} from "../actions/index";
import Header from "./Header";



class FileUpload extends Component {

    state = {
        message: '',
        fileparent:''
    };

    componentWillMount(){
        const data=localStorage.getItem("email")
        API.getState(data)
            .then((res) => {

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

    handleFileUpload = (event) => {

        const payload = new FormData();
console.log(this.state);
        payload.append('mypic', event.target.files[0]);
        payload.append('email', this.props.userdata.email);
        payload.append('fileparent', this.state.fileparent);
        payload.append('isfile', 'T');

        API.uploadFile(payload)
        .then((res) => {

            if (res.status == 204) {

                this.props.addFile(res.filedata);
                this.setState({

                    message: "File uploaded successfully"
                });
            }else if (res.status == 401) {
                this.setState({

                    message: "File error"
                });
            }
        });
    };

    deleteFile=(index, file) => {

        const fileData={file:file, email:this.props.userdata.email}
        API.deleteFile(fileData)
            .then((res) => {

                if (res.status == 204) {

                    console.log("Delete success")
                    this.props.deleteFile(index);
                    this.setState({

                        message: "File deleted successfully"
                    });
                }else if (res.status == 401) {
                    this.setState({

                        message: res.message
                    });
                }
            });

    }

    makeFolder=(folder) => {

        const folderData={folder:folder, email:this.props.userdata.email}
        API.makeFolder(folderData)
            .then((res) => {

                if (res.status == 204) {

                    this.props.addFile(res.folderdata);
                    this.setState({

                        message: "folder created successfully"
                    });

                }else if (res.status == 401) {
                    this.setState({

                        message: "Folder error"
                    });
                }
            });

    }

    sharefile=(filedata) => {


        var emailList=filedata.shareEmail.trim().split(';');

        console.log(emailList)

        for (var key in emailList) {

            const data = {filedata: filedata.file, shareEmail: emailList[key], email: this.props.userdata.email}

            API.shareFile(data)
                .then((res) => {

                    if (res.status == 201) {
                        this.setState({

                            message: "File Shared with "+data.shareEmail
                        });
                        console.log("Success...")

                    } else if (res.status == 401) {
                        this.setState({

                            message: res.message
                        });
                    }
                });
        }

    }

    openFileFolder=(filedata) =>{
        console.log("nnnnnn")
        console.log(filedata)
        if(filedata.isfile=='F'){

            this.setState({
                fileparent:filedata.filepath
            });

        }


        else{


            API.getFile(filedata)
                .then((res) => {
                    console.log("hello");
                console.log(res);

/*console.log(res.status);
                    if (res.status == 201) {
                        console.log("Success...")

                    }else if (res.status == 401) {
                        this.setState({

                            message: "Folder error"
                        });
                    }*/
                });
        }
        console.log(this.state.fileparent);

    }

    render() {


        console.log(this.state.fileparent);
        return (



            <div className="container-fluid">
                <Header/>

                { this.state.message===''?'':(
                    <div className="text-danger">
                        {this.state.message}
                    </div>)
                }

            <div className="jumbotron">

                <div className="row justify-content-md-center">

               {/* <Typography
                    align={'center'}
                    type="display1"
                >
                    Upload a file:
                </Typography>*/}

                <TextField

                    type="file"
                    name="mypic"
                    onChange={this.handleFileUpload}
                />
                </div>
                <br/><br/>

                <div className="container-fluid">
                    <div className="row">

                        <div className="col-sm-7 ">
                            <a href="#" className="link-title "
                               onClick={() => this.setState({
                                   fileparent:'',
                                   message:''
                               })}>
                                Dropbox
                            </a>
                        </div>
                    </div>

                    <div className="row">
                        <LeftNavBar userdetails={this.userdetails}/>
                        <div className="col-sm-1 "></div>
                        <FileGridList files={this.props.userdata.files}
                                      deleteFile={this.deleteFile}
                                      sharefile={this.sharefile}
                                      openFileFolder={this.openFileFolder}
                                      parentFile={this.state.fileparent}
                                      userEmail={this.props.userdata.email}/>
                        <div className="col-sm-1 "></div>
                        {/*<RightNavBar makeFolder={this.makeFolder}
                                     parentFile={this.state.fileparent}/>*/}
                    </div>
                </div>

            </div>


</div>


        );
    }
}



function mapStateToProps(userdata) {

    return {userdata};
}

function mapDispatchToProps(dispatch) {
    return {
        addFile : (data) => dispatch(addFile(data)),
        deleteFile : (index) => dispatch(deleteFile(index)),
        afterlogin : (data) => dispatch(afterlogin(data))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUpload);


