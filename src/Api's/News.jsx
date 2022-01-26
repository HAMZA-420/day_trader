import React from "react";



//

const Api= "https://api.benzinga.com/api/v2/news"
const Key = "d815a95f39c74a819642351f1460d571"

//Write Component to fetch data from Api with key and show json in frontend




export default class News extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        data: [],
        isLoaded: false,
        error: null
        };
    }
    
    componentDidMount() {
        fetch(Api, {
        method: "GET",
        headers: {
            "X-API-Key": Key
        }
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                isLoaded: true,
                data: result
                });
            }

        )
        .catch(error => this.setState({ error, isLoaded: true }));
    }

    render() {

        return (
            <div>
                <h1>News</h1>
                <p>{this.state.data}</p>
            </div>
        );
    }
}








