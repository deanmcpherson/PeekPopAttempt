var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PropTypes,
  TouchableWithoutFeedback,
  TouchableHighlight,
  NativeModules,
} = React;

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

    if ((device.deviceName.indexOf('6s') === -1 && this.allowedDevices.indexOf(device.model) !== -1) || Number(device.systemVersion.split('.')[0]) < 9) {
      return <TouchableWithoutFeedback {...this.props} onPress={this.props.onPress} underlayColor={'transparent'} >
        {this.props.children}
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
        sourceView: React.findNodeHandle(this._root)
      });

     
    })
  },
});

module.exports = Peekable;
