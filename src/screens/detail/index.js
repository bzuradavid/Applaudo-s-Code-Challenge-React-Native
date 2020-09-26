import * as React from 'react';
import { View, Text } from 'react-native';

function DetailScreen({ route, navigation }) {
  const { title, text, photoURL } = route.params;
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{ title }</Text>
      <Text>{ text }</Text>
      <Text>{ photoURL }</Text>
    </View>
  );
}

export default DetailScreen