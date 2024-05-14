
import React from 'react';
import type {PropsWithChildren} from 'react';

import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
  FlatList,
  SectionList,
} from 'react-native';

const diceimg = require("./pictures/dice.jpeg");

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: "#f1ecda",
            fontFamily: 'Cochin',
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: "#f1ecda",
            fontFamily: 'Cochin',
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function Textele() {}


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: "#1f4336",
  };
  const safeStyle = {
    backgroundColor: "#5C4033",
  };

  return (
    <SafeAreaView style={safeStyle}>
      <StatusBar
        barStyle={'dark-content'}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: "#1f4336",
          }}>
          <Section title="Willkommen">
            in der besten Backgammon App, die es jemals gab.
          </Section>
          <Button
            title="Press to play"
            onPress={() => Alert.alert('Ups, this is not working right now')}
          />
          <View>
          <Image
            source={diceimg}
            style={{ width: 100, height: 100, margin: "auto",}}
          />
          </View>
          <Section title="Learn More">
          Backgammon ist ein Brettspiel und eine Mischung aus Strategie- und Glücksspiel, es gehört zu den Wurfzabel-Spielen (englisch tables games), einer der ältesten Brettspielefamilien der Welt. Es gewinnt der Spieler, der als Erster alle eigenen Steine aus dem Spielfeld abtragen kann.
          </Section>
        </View>
        <View>
        <SectionList style={[{marginTop: 8,}]}
      sections={[
        {
          title: 'Our Founders',
          data: ['Jann the Gammon-Beast', 'Schmo the Thunder-Gammer'],
        },
        {
          title: 'Upcoming',
          data: ['Online Playing', 'Lessons', 'Much more...'],
        }]}
      keyExtractor={(item, index) => item + index}
      renderItem={({item}) => (
        <View style={styles.item}>
          <Text style={[
          styles.sectionLI
        ]}>{item}</Text>
        </View>
      )}
      renderSectionHeader={({section: {title}}) => (
        <Text style={[
          styles.sectionTitle,
          {
            color: "#f1ecda",
            fontFamily: 'Cochin',
            paddingHorizontal: 24,
          },
        ]}>{title}</Text>
      )}
    />
      </View>
      <Section title="Other Information">
      Das Spielbrett besteht aus 24 Dreiecken, Points, Zungen oder Felder genannt, von denen sich jeweils 12 auf einer Seite befinden. Zwischen dem 6. und 7. Point auf jeder Seite werden die Points durch die so genannte Bar in das Home- und das Outer-Board oder Heimfeld und Außenfeld aufgeteilt.

Ein Spieler zieht im Uhrzeigersinn und der andere im Gegenuhrzeigersinn um das Brett herum; der erste Point eines Spielers ist zugleich der letzte des Gegners. Jeder Spieler zieht seine Steine aus dem gegnerischen Heimfeld über die 12 Points des Außenfelds in sein eigenes Heimfeld und trägt sie von dort ab (würfelt sie heraus). Geschlagene Steine werden auf die Bar gelegt und von ihrem Besitzer wieder in das gegnerische Heimfeld gespielt.

Es ist nicht festgelegt, ob Weiß im Uhrzeigersinn zieht und ob das Heimfeld aus Sicht von Weiß rechts oder links liegt. Es gibt hier also vier Möglichkeiten: Der Startpunkt von Weiß kann links oder rechts oben oder links oder rechts unten sein. Falls man hierüber keine Einigung erzielt, wird es ausgewürfelt. Die Zugrichtungen der Spieler ergeben sich dann daraus. Es ist auch nicht vorgegeben, ob Weiß oder Schwarz den ersten Zug hat, auch das wird ausgewürfelt.

Gespielt wird mit 15 weißen und 15 schwarzen Steinen, die jedoch auch von anderer Farbe sein können, man muss sie nur deutlich unterscheiden können. Ihre Aufstellung ist fest vorgegeben. Auf dem jeweils ersten Point eines Spielers (also im Bild für Weiß ganz rechts unten, für Schwarz ganz rechts oben) liegen zwei von dessen Steinen, auf dem in Spielrichtung liegenden 12. Point (ganz links unten für Weiß und ganz links oben für Schwarz) jeweils fünf, dann auf dem 17. Point jeweils drei und auf dem 19. Point wieder jeweils fünf Steine (somit oben rechts von der Bar für Weiß und unten rechts von der Bar für Schwarz).

Gewürfelt wird mit zwei sechsseitigen Würfeln.

Bei Turnierspielen wird mit dem Dopplerwürfel gespielt, der zu Beginn in die Mitte der Bar gelegt wird.
      </Section>
      </ScrollView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  sectionLI: {
    marginTop: 5,
    paddingHorizontal: 24,
    color: "#f1ecda",
    fontFamily: 'Cochin',
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  red: {
    color: 'red',
  },
  item: {
    paddingHorizontal: 24,
    fontSize: 18,
    fontWeight: '400',
    marginTop: 8,
    color: "#f1ecda",
    fontFamily: 'Cochin',
    
  },
});

export default App;