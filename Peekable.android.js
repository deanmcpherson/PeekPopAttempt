var React = require('react');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableHighlight,
  NativeModules,
} = require('react-native');

var Peekable = {};

var PREVIEW_REF = 'peekable-preview';
var device = require('../react-native-device/Device');
Peekable.Preview = require('./PreviewView');

var MeasurePreview = React.createClass({
  handleLayout: function(e) {
    this.props.setDimensions(e.nativeEvent.layout)
  },
  render: function() {
    return <View ref="view" onLayout={this.handleLayout}>
      {React.Children.map(this.props.children, child => {
        return React.cloneElement(child, {
          isPreview: true,
          isActive: this.props.active
        })
      })}
    </View>
  }
})


Peekable.View = React.createClass({
  propTypes: {
    renderPreview: React.PropTypes.func,
    onPop: React.PropTypes.func,
    ...View.propTypes,
  },
  _handlePress: function(e) {
    var ev = e.nativeEvent;
    var oldEv = this.__lastPressIn;
    if (ev.locationX === oldEv.locationX && ev.locationY === oldEv.locationY && this.props.onPress) this.props.onPress(); 
  },

  getInitialState: function() {
    return {
      active: false
    }
  },

  onActivate: function() {
    this.setState({active: true})
  },

  setDimensions: function(dimensions) {
    this.width = dimensions.width;
    this.height = dimensions.height;
  },
  allowedDevices: [
    'iPhone 6s',
    'iPhone 6s Plus',
  ],
  render() {

      return <TouchableWithoutFeedback {...this.props} underlayColor={'transparent'} >
        <View>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
  }
});

module.exports = Peekable;
