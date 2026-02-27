import { useToast } from "./context/ToastContext";
import type {
  Toast as ToastType,
  ToastType as ToastVariant,
} from "./Toast.types";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ToastProps {
  toast: ToastType;
  index: number;
  onHeightChange?: (id: string, height: number) => void;
}

const getBackgroundColor = (type: ToastVariant): string => {
  switch (type) {
    case "success":
      return "#10B981";
    case "error":
      return "#EF4444";
    case "warning":
      return "#F59E0B";
    case "info":
      return "#3B82F6";
    default:
      return "#262626";
  }
};

const getIconForType = (type: ToastVariant): string => {
  switch (type) {
    case "success":
      return "✓";
    case "error":
      return "✗";
    case "warning":
      return "⚠";
    case "info":
      return "ℹ";
    default:
      return "";
  }
};

export const Toast: React.FC<ToastProps> = ({ toast, index }) => {
  const { dismiss, expandedToasts, expandToast, collapseToast } = useToast();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(
    new Animated.Value(toast.options.position === "top" ? -20 : 20),
  ).current;

  const isExpanded = expandedToasts.has(toast.id);
  const hasExpandedContent = !!toast.options.expandedContent;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: false,
        tension: 100,
        friction: 10,
      }),
    ]).start();
  }, [opacity, translateY]);

  const handleDismiss = (): void => {
    dismiss(toast.id);
    toast.options.onClose?.();
  };

  const handlePress = (): void => {
    if (!hasExpandedContent) return;
    if (isExpanded) {
      collapseToast(toast.id);
    } else {
      expandToast(toast.id);
    }
  };

  const backgroundColor =
    toast.options.backgroundColor ?? getBackgroundColor(toast.options.type);
  const icon = getIconForType(toast.options.type);
  const _styles = toast.options?.style ?? {};

  const renderExpandedContent = (): React.ReactNode => {
    if (!hasExpandedContent) return null;
    const content = toast.options.expandedContent;
    if (typeof content === "function") {
      return content({ dismiss: handleDismiss });
    }
    return content;
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          opacity,
          transform: [{ translateY }],
          zIndex: 1000 - index,
          position: "absolute",
          top: toast.options.position === "top" ? 80 : undefined,
          bottom: toast.options.position === "bottom" ? 0 : undefined,
        },
        _styles,
      ]}
    >
      <Pressable
        style={[styles.toast, { backgroundColor }]}
        onPress={handlePress}
      >
        <View style={styles.mainContent}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <View style={styles.contentContainer}>
            {typeof toast.content === "string" ? (
              <Text style={styles.text}>{toast.content}</Text>
            ) : (
              toast.content
            )}
          </View>
          {toast.options.action && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                toast.options.action?.onPress();
                handleDismiss();
              }}
            >
              <Text style={styles.actionText}>
                {toast.options.action.label}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {hasExpandedContent && isExpanded && (
          <View style={styles.expandedContent}>{renderExpandedContent()}</View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
    marginVertical: 4,
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  toast: {
    flexDirection: "column",
    borderRadius: 12,
  },
  mainContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  icon: {
    color: "#fff",
    fontSize: 20,
    marginRight: 12,
    fontWeight: "bold",
    textAlign: "center",
    width: 24,
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginLeft: 12,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  expandedContent: {
    overflow: "hidden",
  },
});
