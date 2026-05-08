import * as Sharing from 'expo-sharing';
import { Button, View, Alert } from "react-native";
import type { Model } from "../types/models";

interface ShareButtonProps {
  model: Model;
}

export default function ShareButton({ model }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing Not Available', 'Sharing is not available on this device');
        return;
      }

      const shareText = `${model.name} by ${model.provider}`;
      const shareUrl = model.pricingUrl || `https://example.com/models/${encodeURIComponent(model.name)}`;

      await Sharing.shareAsync(shareUrl, {
        dialogTitle: `Share ${model.name} Model`,
        mimeType: 'text/plain',
      });
    } catch (error: any) {
      console.error('Share failed:', error);
      Alert.alert('Share Failed', 'Could not share model details');
    }
  };

  return (
    <View style={{ marginTop: 8 }}>
      <Button 
        title="Share Model" 
        onPress={handleShare}
        color="#007AFF"
      />
    </View>
  );
}