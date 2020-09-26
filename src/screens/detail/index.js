import * as React from 'react';
import { View, Text } from 'react-native';

function DetailScreen({ route, navigation }) {
  const { name, description } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{ name }</Text>
      <Text>{ description }</Text>
    </View>
  );
}

export default DetailScreen