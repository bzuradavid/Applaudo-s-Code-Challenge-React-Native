import * as React from 'react';
import { View, Text } from 'react-native';

function DetailScreen({ route, navigation }) {
  const data = route.params
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{ data.attributes.canonicalTitle }</Text>
      <Text>{ data.attributes.synopsis }</Text>
    </View>
  );
}

export default DetailScreen