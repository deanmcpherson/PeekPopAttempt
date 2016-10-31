'use strict';

var React = require('react');
var {
  View,

  StyleSheet,
  NativeModules,
  Dimensions,
  NativeMethodsMixin,
  requireNativeComponent,
} = require('react-native');

let window = Dimensions.get('window');

var RN_PREVIEW_VIEW_REF = 'native-preview-view-ref';

var PreviewView = React.createClass({
  propTypes: {
    onPop: React.PropTypes.func,
    onActivate: React.PropTypes.func,
  },
  mixins: [NativeMethodsMixin],
  activate({sourceView}) {

  },

  getRootNodeHandle() {
    return React.findNodeHandle(this.refs[RN_PREVIEW_VIEW_REF]);
  },

  render() {
    return (
      <View ref={RN_PREVIEW_VIEW_REF} onPop={this.props.onPop} style={{position: 'absolute'}}>
        {React.Children.map(this.props.children, React.addons.cloneWithProps)}
      </View>
    );
  },
});

module.exports = PreviewView;
