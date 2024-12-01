// LoadingScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Surface, useTheme } from 'react-native-paper';

const CreationLoadingScreen = () => {
  const theme = useTheme();
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isLastLog, setIsLastLog] = useState(false);

  // List of log messages to show sequentially
  const logMessages = [
    'Initializing upload...',
    'Uploading data to the server...',
    'Processing data...',
    'Finalizing upload...',
  ];

  useEffect(() => {
    // Override console.log to capture logs and add them to consoleLogs
    const originalConsoleLog = console.log;
    console.log = (message) => {
      setConsoleLogs((prevLogs) => [...prevLogs, message]);
      originalConsoleLog(message); // Also print to the developer console
      setIsLastLog(false); // Reset last log indicator when new logs arrive
    };

    // Sequentially display each message in logMessages
    let interval;
    if (currentLogIndex < logMessages.length) {
      console.log(logMessages[currentLogIndex]); // Log to both console and UI
      interval = setTimeout(() => {
        setCurrentLogIndex((prevIndex) => prevIndex + 1);
      }, 2000); // 2-second delay between messages
    } else {
      setIsLastLog(true); // Set flag to indicate the last predefined log is displayed
    }

    // Restore console.log on component unmount
    return () => {
      console.log = originalConsoleLog;
      clearTimeout(interval);
    };
  }, [currentLogIndex]);

  return (
    <Surface style={[styles.surface, { backgroundColor: theme.colors.surface }]}>
      <Image
        source={require('../assets/gif/arisu-blue-archive.gif')}
        style={styles.gif}
      />

      {/* Display current log message or the last log if it is finalizing */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {isLastLog ? logMessages[logMessages.length - 1] : consoleLogs[currentLogIndex] || ''}
        </Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: '#E6E6FA',
  },
  gif: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  textContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default CreationLoadingScreen;
