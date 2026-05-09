const React = require('react');
const { Text } = require('react-native');

function MockIcon(props) {
  return React.createElement(Text, props, props.name || 'icon');
}

module.exports = {
  __esModule: true,
  Ionicons: MockIcon,
  AntDesign: MockIcon,
  MaterialIcons: MockIcon,
  FontAwesome: MockIcon,
  Feather: MockIcon,
  Entypo: MockIcon,
  MaterialCommunityIcons: MockIcon,
  FontAwesome5: MockIcon,
};
