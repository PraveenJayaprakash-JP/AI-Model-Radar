import { Banner } from "react-native-paper";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <Banner
      visible={true}
      actions={[ 
        {
          label: "Retry",
          onPress: onRetry,
        },
      ]}
    >
      {message}
    </Banner>
  );
}