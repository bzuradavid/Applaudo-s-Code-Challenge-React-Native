import * as React from 'react';
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Container, Header, Content, Item, Input, Icon, Spinner } from 'native-base';
import axios from 'axios';



const Movie = ({ navigation, data, name }) => (
  <TouchableOpacity style={styles.movie} onPress={() => navigation.navigate('Detail', data)}>
    { data && data.attributes && data.attributes.posterImage && data.attributes.posterImage.original &&
      <Image style={{ height: 132, width: 99 }} source={{uri: data.attributes.posterImage.small}} />
    }
  </TouchableOpacity>
);

function Section ({ navigation, title, movies }) { 
  const renderMovie = ({ item }) => (
    <Movie data={item} name={item.attributes.canonicalTitle} navigation={navigation} />
  );
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        horizontal
        data={movies}
        renderItem={renderMovie}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

function HomeScreen({ navigation }) {

  let [searchTerm, setSearchTerm] = React.useState('');
  let [loadingData, setLoadingData] = React.useState(false);
  let [responseData, setResponseData] = React.useState([]);

  const getUrl = (searchTerm = null) => {
    let URL = "https://kitsu.io/api/edge/anime"
    if (searchTerm) {
      URL = `https://kitsu.io/api/edge/anime?filter%5Btext%5D=${searchTerm}`
      URL = URL.replace(/ /g, '%20')
    }
    return URL
  }

  const getSection = async (URL, nextUrl) => {
    if (!nextUrl) {
      return (await axios.get(URL)).data
    } else {
      return (await axios.get(nextUrl)).data
    }
  }

  const fetchData = React.useCallback(async (searchTerm=null) => {
    setLoadingData(true)
    const formattedArray = []
    const URL = getUrl(searchTerm)
    let nextUrl = null

    for (let i = 0; i < 20; i++) {
      let section = await getSection(URL, nextUrl)
      formattedArray.push({id: `section${formattedArray.length + 1}`, name: `Section ${formattedArray.length + 1}`, movies: section.data })
      nextUrl = section.links.next
      if (!nextUrl) break;
    }
    
    setResponseData(formattedArray)
    setLoadingData(false)
  }, [])

  React.useEffect(() => {
      fetchData()
  }, [])

  const renderSection = ({ item }) => (
    <Section title={item.name} movies={item.movies} navigation={navigation} />
  );
  return (
    <Container style={{ backgroundColor: '#000', padding: 10}}>
      <View style={{ marginHorizontal: 20 }}>
        <Item>
          <Icon active name='md-search' style={{ color: '#fff'}} />
          <Input 
            value={searchTerm}
            onChangeText={value => setSearchTerm(value)}
            onBlur={() => fetchData(searchTerm)}
            placeholder='Search'
            placeholderTextColor='#fff'
            style={{ color: '#fff'}}
          />
          <Icon onPress={() => setSearchTerm('')} active name='md-close' style={{ color: '#fff'}} />
        </Item>
      </View>

      {loadingData ?
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner color='white' />
        </View>
      :
        <FlatList
          style={{ marginTop: 30 }}
          data={responseData}
          renderItem={renderSection}
          keyExtractor={item => item.id}
        />
      }

    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 16,
    color: '#fff'
  },
  movie: {
    marginVertical: 8,
    marginRight: 16,
    height: 132,
    width: 99,
  }
});

export default HomeScreen