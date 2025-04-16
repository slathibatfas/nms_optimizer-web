import ReactGA from "react-ga4";
import { Button } from "@radix-ui/themes";

export default function Buymeacoffee() {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Send the GA event
    ReactGA.event({
      category: "User Interactions",
      action: "buyMeACoffeeClick",
      label: "Buy Me a Coffee Button",
    });

    // Slight delay to allow GA to capture the event
    setTimeout(() => {
      window.open("https://www.buymeacoffee.com/jbelew", "_blank", "noopener,noreferrer");
    }, 100);
  };

  return (
    <Button size="2" variant="surface" asChild>
      <a href="https://www.buymeacoffee.com/jbelew" onClick={handleClick}>☕ Buy me a Coffee!</a>
    </Button>
  );
}
