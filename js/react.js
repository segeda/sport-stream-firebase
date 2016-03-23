var SportStreamItem = React.createClass({
    render: function() {
        return <li>{this.props.item.text}</li>;
    }
});

var SportStreamList = React.createClass({
    render: function() {
        return (
            <ul>
                {this.props.stream.map(function(item, index) {
                    return <SportStreamItem key={item['.key']} item={item} />;
                }) }
            </ul>
        );
    }
});

var SportStreamScore = React.createClass({
    render: function() {
        return <h2>{this.props.score.home}&nbsp;:&nbsp;{this.props.score.visitor}</h2>;
    }
});

var SportStreamApp = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function() {
        return {
            stream: [],
            score: {}
        };
    },

    componentWillMount: function() {
        this.bindAsArray(new Firebase('https://<YOUR-FIREBASE-APP>.firebaseio.com/sport-stream/stream/'), 'stream');
        this.bindAsObject(new Firebase('https://<YOUR-FIREBASE-APP>.firebaseio.com/sport-stream/score/'), 'score');
    },

    render: function() {
        return (
            <div>
                <SportStreamScore score={this.state.score} />
                <SportStreamList stream={this.state.stream} />
            </div>
        );
    }
});

var SportStreamAdmin = React.createClass({
    mixins: [ReactFireMixin],

    getInitialState: function() {
        return {
            text: ''
        };
    },

    componentWillMount: function() {
        this.bindAsArray(new Firebase('https://<YOUR-FIREBASE-APP>.firebaseio.com/sport-stream/stream/'), 'stream');
        this.bindAsObject(new Firebase('https://<YOUR-FIREBASE-APP>.firebaseio.com/sport-stream/score/'), 'score');
    },

    onChange: function(e) {
        this.setState({ text: e.target.value });
    },

    handleSubmit: function(e) {
        e.preventDefault();
        if (this.state.text && this.state.text.trim().length !== 0) {
            var itemRef = this.firebaseRefs['stream'].push({ text: this.state.text });
            this.firebaseRefs['stream'].child(itemRef.key()).setPriority(-1 * Date.now());
            this.setState({ text: '' });
        }
    },

    handleGoal: function(e) {
        var score = this.state.score[e.target.name] || 0;
        var data = {};
        data[e.target.name] = score + 1;
        this.firebaseRefs['score'].update(data);
        var itemRef = this.firebaseRefs['stream'].push({ text: 'Goal ' + e.target.name });
        this.firebaseRefs['stream'].child(itemRef.key()).setPriority(-1 * Date.now());
    },

    render: function() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.onChange} value={this.state.text} />
                </form>
                <button name="home" onClick={this.handleGoal}>Home</button>
                <button name="visitor" onClick={this.handleGoal}>Visitor</button>
            </div>
        );
    }
});

ReactDOM.render(<SportStreamApp />, document.getElementById('app'));
ReactDOM.render(<SportStreamAdmin/>, document.getElementById('admin'));
