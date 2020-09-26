import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { Container, Header, Content, Item, Input, Icon } from 'native-base';
import axios from 'axios';

const myObject = {
  title: 'This is a title',
  text: 'This is some text and its a bit longer',
  photoURL: 'http://lalaland.com'
}

function HomeScreen({ navigation }) {
  return (
    <Container style={{ backgroundColor: '#000', padding: 20}}>
      <Content>
        <Item>
          <Icon active name='md-search' style={{ color: '#fff'}} />
          <Input placeholder='Search' style={{ color: '#fff'}} />
          <Icon active name='md-close' style={{ color: '#fff'}} />
        </Item>
      </Content>
    </Container>
  );
}

export default HomeScreen