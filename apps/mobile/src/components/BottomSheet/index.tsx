import { useEffect, useRef } from 'react';
import { Animated, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

interface BottomSheetProps {
  isPresented: boolean;
  onDismiss: () => void;
  children?: React.ReactNode;
  testID?: string;
}

export function BottomSheet({ isPresented, onDismiss, children, testID }: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (isPresented) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: Platform.OS !== 'web',
        bounciness: 4,
      }).start();
    } else {
      translateY.setValue(500);
    }
  }, [isPresented, translateY]);

  return (
    <Modal
      visible={isPresented}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      testID={testID}
    >
      <Pressable style={styles.overlay} onPress={onDismiss} />
      <Animated.View
        style={[styles.sheet, Platform.OS !== 'web' && { transform: [{ translateY }] }]}
      >
        <View style={styles.handle} />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d4d4d8',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  content: {
    paddingBottom: 32,
  },
});
