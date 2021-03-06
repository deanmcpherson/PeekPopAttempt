var React = require('react');
var ReactNative = require('react-native');
var {PropTypes} = React;
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
    renderPreview: PropTypes.func,
    onPop: PropTypes.func,
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

    if (!this.props.renderPreview || (device.deviceName.indexOf('6s') === -1 && this.allowedDevices.indexOf(device.model) !== -1) || Number(device.systemVersion.split('.')[0]) < 9) {
      return <TouchableWithoutFeedback {...this.props} onPress={this.props.onPress} underlayColor={'transparent'} >
        <View>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    }

    let preview = (
      <Peekable.Preview ref={PREVIEW_REF} height={this.height} width={this.width} onPop={this.props.onPop} onActivate={this.onActivate}>
        <MeasurePreview setDimensions={this.setDimensions} active={this.state.active}> 
          {this.props.renderPreview()}
        </MeasurePreview>
      </Peekable.Preview>
    );
    
    return (
      <TouchableWithoutFeedback {...this.props} onPressIn={this._handlePressIn} onPress={this._handlePress}>
        <View {...this.props} ref={(view) => { this._root = view; }}>
          {this.props.children}
          {preview}
        </View>
      </TouchableWithoutFeedback>
    )
  },

  _handlePressIn(e) { 
    this.__lastPressIn = e.nativeEvent;
    setTimeout(() => {
      if (!this.refs[PREVIEW_REF]) return;
      this.refs[PREVIEW_REF].activate({
        sourceView: ReactNative.findNodeHandle(this._root)
      });

     
    })
  },
});

module.exports = Peekable;
