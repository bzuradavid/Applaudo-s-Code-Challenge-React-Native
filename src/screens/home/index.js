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
  let [loadingData, setLoadingData] = React.useState(true);
  let [fetchUrl, setFetchUrl] = React.useState("https://kitsu.io/api/edge/anime");
  let [responseData, setResponseData] = React.useState([]);
  let [count, setCount] = React.useState(0);
  const fetchData = React.useCallback(() => {
    const resultArray = []
    axios.get(fetchUrl).then((response) => {
      resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
      axios.get(response.data.links.next).then((response) => {
        resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
        axios.get(response.data.links.next).then((response) => {
          resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
          axios.get(response.data.links.next).then((response) => {
            resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
            axios.get(response.data.links.next).then((response) => {
              resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
              axios.get(response.data.links.next).then((response) => {
                resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
                axios.get(response.data.links.next).then((response) => {
                  resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
                  axios.get(response.data.links.next).then((response) => {
                    resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
                    axios.get(response.data.links.next).then((response) => {
                      resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
                      axios.get(response.data.links.next).then((response) => {
                        resultArray.push({id: `section${resultArray.length + 1}`, name: `Section ${resultArray.length + 1}`, movies: response.data.data})
                        console.log(resultArray)
                        setResponseData(resultArray)
                        setLoadingData(false)
                      }).catch((error) => { console.log(error)})
                    }).catch((error) => { console.log(error)})
                  }).catch((error) => { console.log(error)})
                }).catch((error) => { console.log(error)})
              }).catch((error) => { console.log(error)})
            }).catch((error) => { console.log(error)})
          }).catch((error) => { console.log(error)})
        }).catch((error) => { console.log(error)})
      }).catch((error) => { console.log(error)})
    }).catch((error) => { console.log(error)})
  }, [])
  React.useEffect(() => {
      fetchData()
  }, [fetchData])

  const renderSection = ({ item }) => (
    <Section title={item.name} movies={item.movies} navigation={navigation} />
  );
  return (
    <Container style={{ backgroundColor: '#000', padding: 10}}>
      <View style={{ marginHorizontal: 20 }}>
        <Item>
          <Icon active name='md-search' style={{ color: '#fff'}} />
          <Input placeholder='Search' placeholderTextColor='#fff' style={{ color: '#fff'}} />
          <Icon active name='md-close' style={{ color: '#fff'}} />
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