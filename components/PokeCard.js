import { Image, StyleSheet, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import pokeBall from "../assets/pokeball-white.png";

const PokeCard = ({ item }) => {
  const backgrounds = {
    Grass: "#63bc5a",
    Fire: "#ff9d55",
    Water: "#5090d6",
    Normal: "#929da3",
    Fighting: "#ce416b",
    Flying: "#8fa9de",
    Poison: "#aa6bc8",
    Ground: "#d97845",
    Rock: "#c5b78c",
    Bug: "#91c12f",
    Ghost: "#5269ad",
    Steel: "#5a8ea2",
    Electric: "#f4d23c",
    Psychic: "#fa7179",
    Ice: "#73cec0",
    Dragon: "#0b6dc3",
    Dark: "#5a5465",
    Fairy: "#ec8fe6",
  };
  const defaultBackground = "white";

  const navigation = useNavigation();
  const singleTapGesture = Gesture.Tap().onStart(() => {
    navigation.navigate("Pokemon", { itemId: item.id });
  });

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={singleTapGesture}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: backgrounds[item.typeA] || defaultBackground,
            },
            {
              marginEnd: item.id % 2 === 0 ? 0 : 5,
            },
            {
              marginStart: item.id % 2 === 0 ? 5 : 0,
            },
          ]}
        >
          <View style={styles.titleCont}>
            <Text style={styles.title}>{item.name}</Text>
            <View style={styles.typeContainer}>
              <View style={styles.typeContainerS}>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{item.typeA}</Text>
                </View>
              </View>
              <View style={styles.typeContainerS}>
                {item.typeB && (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{item.typeB}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View>
            <Image
              style={styles.cardImage}
              source={{
                uri: item.sprites.other["official-artwork"].front_default,
              }}
            />
            <Image source={pokeBall} style={styles.imageBg}></Image>
          </View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 175,
    borderRadius: 17,
    elevation: 3,
    marginVertical: 5,
    paddingVertical: 20,
    paddingHorizontal: 15,
    height: 130,
    overflow: "hidden",
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    color: "white",
  },
  typeContainer: {
    marginTop: 5,
    height: 50,
  },
  typeContainerS: {
    flexDirection: "row",
  },
  pill: {
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255, 0.4)",
    borderRadius: 15,
    paddingVertical: 3,
    marginBottom: 5,
  },
  pillText: {
    color: "white",
    fontWeight: "500",
    fontSize: 11,
  },
  cardImage: {
    width: 80,
    height: 80,
    left: 73,
    bottom: 55,
    zIndex: 1,
  },
  imageBg: {
    opacity: 0.3,
    width: 90,
    height: 90,
    left: 75,
    bottom: 135,
  },
});

export default PokeCard;
