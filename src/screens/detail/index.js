import * as React from 'react';
import { View, Text } from 'react-native';

function DetailScreen({ route, navigation }) {
  const { itemId } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Detail Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
    </View>
  );
}

export default DetailScreen