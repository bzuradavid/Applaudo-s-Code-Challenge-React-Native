import * as React from 'react';
import { Button, View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Container, Header, Content, Item, Input, Icon, Spinner } from 'native-base';
import axios from 'axios';



const Movie = ({ navigation, data, name }) => (
  <TouchableOpacity style={styles.movie} onPress={() => navigation.navigate('Detail', data)}>
    <Image style={{ height: 132, width: 99 }} source={{uri: data.attributes.posterImage.small}} />
  </TouchableOpacity>
);

function Section ({ navigation, title, movies }) { 
  const renderMovie = ({ item }) => (
    <Movie data={item} name={item.attributes.canonicalTitle} navigation={navigation} />
  );
  return (
    <View style={styles.section}>
      {title &&
        <Text style={styles.title}>{title}</Text>
      }
      <FlatList
        horizontal
        data={movies.filter(movie => movie.attributes.posterImage != null)}
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

  const getSection = async (URL) => {
    return (await axios.get(URL)).data
  }

  const fetchData = React.useCallback(async (searchTerm=null) => {
    setLoadingData(true)
    const formattedResponse = []
    let URL = getUrl(searchTerm)

    for (let i = 0; i < 5; i++) {
      let section = await getSection(URL)
      formattedResponse.push({
        id: `section${formattedResponse.length + 1}`,
        name: null,
        movies: section.data 
      })
      URL = section.links.next
      if (!URL) break;
    }

    setResponseData(formattedResponse)
    setLoadingData(false)
  }, [])

  const fetchInitial = React.useCallback(() => {
    setLoadingData(true)
    let genreList = []
    const formattedResponse = []
    axios.get('https://kitsu.io/api/edge/categories').then(async (response) => {
      try {
        genreList = response.data.data
        console.log(genreList)
        for (let i = 0; i < genreList.length; i++) {
          let url = `https://kitsu.io/api/edge/anime?filter%5Bcategories%5D=${genreList[i].attributes.slug}`
          let section = await axios.get(url)
          // console.log(url)
          // console.log(section.data.data)
          formattedResponse.push({
            id: `section${formattedResponse.length + 1}`,
            name: genreList[i].attributes.title,
            movies: section.data.data
          })
        }
        setResponseData(formattedResponse)
        setLoadingData(false)
      } catch(err) {
        console.log(err)
      }
    })
  }, [])

  React.useEffect(() => {
      fetchInitial();
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