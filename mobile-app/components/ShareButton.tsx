import * as Sharing from 'expo-sharing';
import { Button } from 'react-native-paper';
import { useCallback } from 'react';
import type { Model } from '../types/models';

interface ShareButtonProps {
  model: Model;
}

export default function ShareButton({ model }: ShareButtonProps) {
  const handleShare = useCallback(async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        alert('Sharing is not available on this device');
        return;
      }

      const shareText = `${model.name} by ${model.provider}`;
      const shareUrl = `https://example.com/models/${encodeURIComponent(model.name)}`;

      await Sharing.shareAsync(shareUrl, {
        dialogTitle: `Share ${model.name} Model`,
        mimeType: 'text/plain',
      });
    } catch (error: any) {
      console.error('Share failed:', error);
      alert('Could not share model details');
    }
  }, [model.name, model.provider]);

  return (
    <Button
      icon="share-variant"
      mode="contained-tonal"
      onPress={handleShare}
      accessibilityLabel={`Share ${model.name} model details`}
      style={{ marginTop: 8 }}
    >
      Share Model
    </Button>
  );
}
