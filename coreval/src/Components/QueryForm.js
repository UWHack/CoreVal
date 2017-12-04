import React from "react";
import firebase from "firebase/app";
import "firebase/database";
import QueryListView from "./QueryList"
export default class QueryFormView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            professor : "",
            professorQueryFormat: "",
            classAbrev: "",
            courseArr: []
        }
    }

    // Send request to firebase
    handleSubmit(evt) {
        evt.preventDefault();
        if (this.state.courseArr.length === 0) {
            
            let db = firebase.database();
            let path = "";

            let nameTokens = this.state.professor.toLowerCase().trim().split(' ');
            let capTokens = nameTokens.map(token => token.charAt(0).toUpperCase() + token.slice(1));
            let professorQueryFormat = capTokens.join('_');
            console.log(professorQueryFormat);
            if (!professorQueryFormat && !this.state.classAbrev) {
                alert("Empty Fields");
                return;
            } else if (professorQueryFormat && !this.state.classAbrev) {
                path = `/Professors/${professorQueryFormat}`
            } else  if (this.state.classAbrev && !professorQueryFormat) {
                path = `/Classes/${professorQueryFormat}`
            } else {
                path = `/Classes/${this.state.classAbrev}/${this.state.classAbrev}`
            }
            let queryResultTemp = this.state.courseArr.slice();
            // Query on the path and get a snapshot of the results.
            db.ref(path).orderByValue().on("value", querySnapshot => {
                // Add each query result to the temp array and update
                // and update the state.
                querySnapshot.forEach(function(queryResultObj) {
                    let queryResult = queryResultObj.val();
                    queryResultTemp.push(queryResult);
                });
                this.setState({
                    courseArr: queryResultTemp
                });
            });
        }
    }

    render() {
        return (
            <div className="pt-3 pb-3"> 
                <form onSubmit={evt => this.handleSubmit(evt)} className="input-group">
                    <input type="text"
                        id="searchbar"
                        className="form-control"
                        value={this.state.professor}
                        placeholder="Enter your professor"
                        // Update the professor when the user types
                        onChange={evt => {
                            this.setState({
                                professor: evt.target.value,
                                professorQueryFormat: "",
                                classAbrev: "",
                                courseArr: []
                            }) 
                        }}
                    />
                    <span className="input-group-btn">
                        <button id="searchbutton" type="button" className="btn btn-success">
                            <span className="glyphicon glyphicon-search"> Search </span>
                        </button>
                    </span>
                </form>
                {/* Create a QueryListView which renders a bunch of Query Results */}
                <QueryListView results={this.state.courseArr} prof={this.state.professor}/>
            </div>
        );
    }
}