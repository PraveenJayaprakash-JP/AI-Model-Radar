const React = require('react');
const { Text } = require('react-native');

const MockIcon = (props) => React.createElement(Text, props, props.name || 'icon');

jest.mock('@expo/vector-icons', () => ({
  Ionicons: MockIcon,
  AntDesign: MockIcon,
  MaterialIcons: MockIcon,
  FontAwesome: MockIcon,
  Feather: MockIcon,
  Entypo: MockIcon,
  MaterialCommunityIcons: MockIcon,
  FontAwesome5: MockIcon,
}));
