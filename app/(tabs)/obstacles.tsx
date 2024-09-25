import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  Button,
  StyleSheet,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storeData } from '../utils/storage';
import { launchImageLibrary } from 'react-native-image-picker';

// Define an interface for the data items
interface DataItem {
  id: number;
  name: string;
  indication: string;
  position: string;
  imageUri: string; // Add imageUri to the DataItem interface
}

export default function ObstaclesScreen() {
  const insets = useSafeAreaInsets();

  const styles = StyleSheet.create({
    safeView: {
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginRight: insets.right,
      marginLeft: insets.left,
      flex: 1,
      padding: 16,
      borderWidth: 1,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      height: 40,
      borderColor: 'red',
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
      color: 'blue',
    },
    buttonContainer: {
      marginVertical: 10,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 10,
    },
  });

  // Initial state for form inputs
  const [name, setName] = useState('');
  const [indication, setIndication] = useState('');
  const [position, setPosition] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [data, setData] = useState<DataItem[]>([]); // Explicitly type the data state

  // Handle form submission to store data
  const addData = async () => {
    const newItem: DataItem = {
      id: data.length + 1,
      name,
      indication,
      position,
      imageUri,
    };
    
    // Save to state and AsyncStorage (optional)
    const newData = [...data, newItem];
    setData(newData);
    await storeData('dataList', JSON.stringify(newData)); // Storing data locally

    // Reset form inputs
    setName('');
    setIndication('');
    setPosition('');
    setImageUri('');
  };

  // Handle image selection
  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeView}>
      {/* Form Input Fields */}
      <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold' }}>
        Ajouter un obstacle
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Indication"
        value={indication}
        onChangeText={setIndication}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Position"
        value={position}
        onChangeText={setPosition}
      />

      {/* Image Picker */}
      <View style={styles.buttonContainer}>
        <Button title="Select Image" onPress={selectImage} />
      </View>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <Button title="Add Data" onPress={addData} />
      </View>
    </SafeAreaView>
  );
}