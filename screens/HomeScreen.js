import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import PokeCard from "../components/PokeCard";
import pokeBall from "../assets/pokeball-grey.png";

export default function HomeScreen({ navigation }) {
  const [pokemon, setPokemon] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?limit=151")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something wrong!");
        }
        return response.json();
      })
      .then((data) => {
        let results = data.results;
        let promisesArray = results.map((result) => {
          return fetch(result.url).then((response) => response.json());
        });
        return Promise.all(promisesArray);
      })
      .then((data) => {
        const allowed = ["id", "name", "sprites", "types"];

        const filtered = data.map((el) => {
          let elFilter = Object.keys(el)
            .filter((key) => allowed.includes(key))
            .reduce((obj, key) => {
              obj[key] = el[key];
              return obj;
            }, {});
          return elFilter;
        });

        filtered.forEach((el) => {
          el.name = el.name.charAt(0).toUpperCase() + el.name.slice(1);
          el.typeA =
            el.types[0].type.name.charAt(0).toUpperCase() +
            el.types[0].type.name.slice(1);
          if (el.types.length > 1) {
            el.typeB =
              el.types[1].type.name.charAt(0).toUpperCase() +
              el.types[1].type.name.slice(1);
          }
        });
        setPokemon(filtered);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  if (error) {
    return (
      <Text>
        It seems we ran into some troubles. Please try again in a few minutes.
      </Text>
    );
  }

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ marginTop: 15 }}
      />
    );
  }

  const renderItem = ({ item }) => <PokeCard item={item} />;

  return (
    <View style={styles.container}>
      <View style={styles.titleCont}>
        <Text style={styles.title}>Pokedex</Text>
        <Image source={pokeBall} style={styles.imageBg}></Image>
      </View>
      <View style={styles.cards}>
        <FlatList
          data={pokemon}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={false}
          numColumns={2}
        />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    paddingTop: 25,
  },
  titleCont: {
    marginBottom: 25,
    flexDirection: "row",
    height: 40,
  },
  title: {
    fontWeight: "800",
    fontSize: 25,
  },
  imageBg: {
    opacity: 0.1,
    width: 300,
    height: 300,
    left: 50,
    top: -180,
  },
  cards: {
    flex: 1,
  },
});
