import { Text as RNText } from "react-native";
import { clsx } from "clsx";

const Text = ({ children, className, ...props }) => {
  const baseClasses = "text-sm md:text-base lg:text-lg tracking-wide"; // standard font sizes
  return (
    <RNText
      className={clsx(baseClasses, className)}
      {...props}
    >
      {children}
    </RNText>
  );
};

export default Text;