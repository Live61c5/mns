import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Button,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getData, removeData, storeData } from '../utils/storage';

interface DataItem {
  id: number;
  name: string;
  indication: string;
  position: string;
  imageUri: string;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<DataItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = await getData('dataList');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    };

    fetchData();
  }, []);

  const styles = StyleSheet.create({
    safeView: {
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginRight: insets.right,
      marginLeft: insets.left,
      flex: 1,
      padding: 16,
      justifyContent: 'center',
    },
    item: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      
    },
    image: {
      width: 100,
      height: 100,
      alignSelf: 'center', 
      marginTop: 10,
      marginBottom: 10, 
    },
  });

  const Item = ({ name, indication, position, imageUri }: DataItem) => (
    
    <View style={styles.item}>
      <Text>Name: {name}</Text>
      <Text>Indication: {indication}</Text>
      <Text>Position: {position}</Text>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
      <Button
        title="Remove"
        onPress={async () => {
          const newData = data.filter((item) => item.name !== name);
          setData(newData);
          await removeData('dataList');
          await storeData('dataList', JSON.stringify(newData));
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeView}>
      <Text style={{textAlign: 'center', fontWeight: 'bold', marginBottom: 25, marginTop: 25 }}>
        Liste des obstacles
      </Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}