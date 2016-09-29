// Include React 
var React = require('react');

// Helper Function
var helpers = require('../utils/helpers.js');

// This is the results component
var Query = React.createClass({

  // This function will respond to the user click
  handleClick: function(){
    // Send article data to server to save to db
    helpers.postArticles({
      title: this.props.title,
      date: this.props.date,
      url: this.props.url
    }).then(function(res){
      console.log(res.status);
      // Show message
      //this.props.saved(res.status);
    }.bind(this));
  },

  // Here we render the function
  render: function(){

    return(

      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title text-center">Query</h3>
        </div>
        <div className="panel-body text-center">

            <li className="list-group-item">
                <h3>{this.props.title}</h3>
                <p>{this.props.lead}</p>
                <div className="btn-group pull-right">
                  <button className="btn btn-primary" onClick={this.handleClick}>Save</button>
                  <a className="btn btn-default" href={this.props.url} target="_blank">
                    View Article
                  </a>
                </div>
              <p>Date Published: {this.props.date}</p>
            </li>

        </div>
      </div>

    )
  }
});

// Export the component back for use in other files
module.exports = Query;