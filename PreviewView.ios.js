'use strict';

var React = require('react-native');
var {
  View,
  PropTypes,
  StyleSheet,
  NativeModules,
  Dimensions,
  NativeMethodsMixin,
  requireNativeComponent,
} = React;
var { RNPreviewViewManager } = NativeModules;

let window = Dimensions.get('window');

var RN_PREVIEW_VIEW_REF = 'native-preview-view-ref';

var PreviewView = React.createClass({
  propTypes: {
    onPop: PropTypes.func,
    onActivate: PropTypes.func,
  },
  mixins: [NativeMethodsMixin],
  activate({sourceView}) {
    if (this.props.onActivate) {
      setTimeout(this.props.onActivate);
    } 
    RNPreviewViewManager.setSourceView(sourceView);
    RNPreviewViewManager.activate(this.getRootNodeHandle(), this.props.width || window.width, this.props.height || window.height);
  },

  getRootNodeHandle() {
    return React.findNodeHandle(this.refs[RN_PREVIEW_VIEW_REF]);
  },

  render() {
    return (
      <RNPreviewView ref={RN_PREVIEW_VIEW_REF} onPop={this.props.onPop} style={{position: 'absolute'}}>
        {React.Children.map(this.props.children, React.addons.cloneWithProps)}
      </RNPreviewView>
    );
  },
});

var RNPreviewView = requireNativeComponent('RNPreviewView', PreviewView);

module.exports = PreviewView;
